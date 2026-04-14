import { NextResponse } from "next/server";

// ── Data sources ────────────────────────────────────────────────────────────
// CoinGecko free public API supports up to 365 days with interval=daily.
// Anything beyond 365 days returns 401 Unauthorized on the free tier.
// For the "all" timeframe we therefore use CryptoCompare's free histoday API
// (no key required) which covers the full Zcash history since Oct 2016.
// Two parallel page-fetches are stitched + downsampled to ≤300 points.
// ────────────────────────────────────────────────────────────────────────────

const COINGECKO_DAYS: Record<string, string> = {
  "1w": "7",
  "1m": "30",
  "3m": "90",
  "1y": "365",
};

function fmtDate(ts: number, period: string): string {
  const d = new Date(ts);
  if (period === "1w" || period === "1m") {
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

/** Thin an array to at most `maxPoints` evenly-spaced entries, always keeping the last. */
function downsample<T>(arr: T[], maxPoints: number): T[] {
  if (arr.length <= maxPoints) return arr;
  const step = Math.ceil(arr.length / maxPoints);
  const result: T[] = [];
  for (let i = 0; i < arr.length; i++) {
    if (i % step === 0 || i === arr.length - 1) result.push(arr[i]);
  }
  return result;
}

// ── All-time fetch via CryptoCompare ────────────────────────────────────────
// CryptoCompare histoday returns at most 2000 points per call.
// ZEC history spans ~3 500 days (Oct 2016 → now), so we fetch two pages in
// parallel and stitch them.
async function fetchAllTimeCryptoCompare(): Promise<Array<{ date: string; price: number }>> {
  const BASE =
    "https://min-api.cryptocompare.com/data/v2/histoday?fsym=ZEC&tsym=USD";

  // Page 1 — most recent 2 000 days (toTs=-1 means "up to now")
  const page1Url = `${BASE}&limit=2000&toTs=-1`;
  // Page 2 — 1 500 days ending ~2 001 days ago (slight overlap is OK; we deduplicate)
  const approxCutoff = Math.floor(Date.now() / 1000) - 2001 * 86400;
  const page2Url = `${BASE}&limit=1500&toTs=${approxCutoff}`;

  console.log(`[price-history] all → CryptoCompare parallel fetch`);
  console.log(`  page1: ${page1Url}`);
  console.log(`  page2: ${page2Url}`);

  const [res1, res2] = await Promise.all([
    fetch(page1Url, { next: { revalidate: 3600 } }),
    fetch(page2Url, { next: { revalidate: 3600 } }),
  ]);

  if (!res1.ok) throw new Error(`CryptoCompare page1 HTTP ${res1.status}`);
  if (!res2.ok) throw new Error(`CryptoCompare page2 HTTP ${res2.status}`);

  const [json1, json2] = await Promise.all([res1.json(), res2.json()]);

  if (json1.Response !== "Success")
    throw new Error(`CryptoCompare page1: ${json1.Message ?? "unknown error"}`);
  if (json2.Response !== "Success")
    throw new Error(`CryptoCompare page2: ${json2.Message ?? "unknown error"}`);

  type RawPt = { time: number; close: number };
  const page1: RawPt[] = json1.Data.Data ?? [];
  const page2: RawPt[] = json2.Data.Data ?? [];

  // Dec 1 2016 00:00:00 UTC — skip the zero-liquidity launch spike (Oct–Nov 2016)
  // which would otherwise compress the entire rest of the chart to near-zero.
  const ALL_START_TS = 1480550400;

  // Merge, deduplicate by timestamp, sort ascending, strip pre-launch / zero-price entries
  const seen = new Set<number>();
  const combined = [...page2, ...page1]
    .filter((p) => {
      if (p.close <= 0 || p.time < ALL_START_TS || seen.has(p.time)) return false;
      seen.add(p.time);
      return true;
    })
    .sort((a, b) => a.time - b.time);

  const formatted = combined.map((p) => ({
    date: fmtDate(p.time * 1000, "all"),
    price: Math.round(p.close * 100) / 100,
  }));

  const result = downsample(formatted, 300);
  console.log(
    `[price-history] all → ${result.length} pts (raw: ${formatted.length}, p1: ${page1.length}, p2: ${page2.length})`
  );
  return result;
}

// ── Main handler ─────────────────────────────────────────────────────────────
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") ?? "1y";

  // "all" timeframe uses CryptoCompare
  if (period === "all") {
    try {
      const prices = await fetchAllTimeCryptoCompare();
      return NextResponse.json(prices);
    } catch (err) {
      console.error("[price-history] CryptoCompare all-time error:", err);
      return NextResponse.json(
        { error: String(err instanceof Error ? err.message : err) },
        { status: 500 }
      );
    }
  }

  // Shorter periods use CoinGecko (free tier supports ≤365 days with interval=daily)
  const days = COINGECKO_DAYS[period] ?? "365";
  const cgUrl = `https://api.coingecko.com/api/v3/coins/zcash/market_chart?vs_currency=usd&days=${days}&interval=daily`;

  console.log(`[price-history] ${period} → ${cgUrl}`);

  try {
    const res = await fetch(cgUrl, { next: { revalidate: 300 } });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`CoinGecko HTTP ${res.status}: ${body.slice(0, 200)}`);
    }

    const json = await res.json();
    if (!Array.isArray(json.prices)) {
      throw new Error("Unexpected CoinGecko response shape");
    }

    const prices = (json.prices as [number, number][]).map(([ts, price]) => ({
      date: fmtDate(ts, period),
      price: Math.round(price * 100) / 100,
    }));

    console.log(`[price-history] ${period} → ${prices.length} pts`);
    return NextResponse.json(prices);
  } catch (err) {
    console.error(`[price-history] CoinGecko ${period} error:`, err);
    return NextResponse.json(
      { error: String(err instanceof Error ? err.message : err) },
      { status: 500 }
    );
  }
}
