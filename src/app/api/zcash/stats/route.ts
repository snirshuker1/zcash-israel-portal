import { NextResponse } from "next/server";

const ZATOSHI = BigInt(100_000_000);

// Convert a ZEC float value (up to 8 decimal places) to Zatoshis using BigInt
// to avoid floating-point precision loss.
function zecToZatoshis(zec: number): bigint {
  const str = zec.toFixed(8); // e.g. "5153538.74000000"
  const [whole, frac] = str.split(".");
  return BigInt(whole) * ZATOSHI + BigInt(frac);
}

// Convert Zatoshis (BigInt) back to a ZEC number safe for JSON / display.
function zatoshisToZec(z: bigint): number {
  const whole = z / ZATOSHI;
  const frac  = z % ZATOSHI;
  return Number(whole) + Number(frac) / 1e8;
}

export async function GET() {
  try {
    const [blockchairRes, binanceRes, shieldedRes, coingeckoRes] = await Promise.allSettled([
      fetch("https://api.blockchair.com/zcash/stats", { next: { revalidate: 60 } }),
      fetch("https://api.binance.com/api/v3/ticker/price?symbol=ZECUSDT", {
        next: { revalidate: 60 },
      }),
      // Live hourly endpoint — updates every ~75 s, cache 5 min
      fetch("https://zecprice.com/api/shielded-hourly", {
        next: { revalidate: 300 },
      }),
      // CoinGecko (no API key) → authoritative ZEC circulating supply
      fetch(
        "https://api.coingecko.com/api/v3/coins/zcash?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false",
        { next: { revalidate: 300 } }
      ),
    ]);

    // Blockchair → block height + fallback price
    let blockHeight: number | null = null;
    let priceUsdFallback: number | null = null;
    let marketCapUsd: number | null = null;
    let transactions24h: number | null = null;
    let hashrate24h: number | null = null;
    let circulation: number | null = null;

    if (blockchairRes.status === "fulfilled" && blockchairRes.value.ok) {
      const json = await blockchairRes.value.json();
      const d = json.data;
      blockHeight = d.best_block_height;
      priceUsdFallback = d.market_price_usd;
      marketCapUsd = d.market_cap_usd;
      transactions24h = d.transactions_24h;
      hashrate24h = d.hashrate_24h;
      circulation = d.circulation;
    }

    // Binance → real-time ZEC/USDT price
    let priceUsd: number | null = priceUsdFallback;
    if (binanceRes.status === "fulfilled" && binanceRes.value.ok) {
      const data = await binanceRes.value.json();
      const parsed = parseFloat(data.price);
      if (!isNaN(parsed) && parsed > 0) priceUsd = parsed;
    }

    // CoinGecko → authoritative ZEC circulating supply (in whole ZEC units)
    let circulatingSupply: number | null = null;
    if (coingeckoRes.status === "fulfilled" && coingeckoRes.value.ok) {
      const json = await coingeckoRes.value.json();
      const supply = json?.market_data?.circulating_supply;
      if (typeof supply === "number" && supply > 0) {
        circulatingSupply = supply;
      }
    }

    // zecprice.com /api/shielded-hourly → live shielded pool breakdown
    let shieldedTotal: number | null = null;
    let shieldedSapling: number | null = null;
    let shieldedOrchard: number | null = null;
    let shieldedSprout: number | null = null;

    if (shieldedRes.status === "fulfilled" && shieldedRes.value.ok) {
      const json = await shieldedRes.value.json();
      const entries: { v?: number; sa?: number; or?: number; sp?: number }[] =
        json.data ?? [];
      const last = entries[entries.length - 1];

      if (last != null) {
        // Use BigInt arithmetic to avoid float precision loss when
        // working with Zatoshi-level values (1 ZEC = 100,000,000 zatoshis).
        if (last.v  != null) shieldedTotal   = zatoshisToZec(zecToZatoshis(last.v));
        if (last.sa != null) shieldedSapling  = zatoshisToZec(zecToZatoshis(last.sa));
        if (last.or != null) shieldedOrchard  = zatoshisToZec(zecToZatoshis(last.or));
        if (last.sp != null) shieldedSprout   = zatoshisToZec(zecToZatoshis(last.sp));
      }
    }

    return NextResponse.json({
      blockHeight,
      priceUsd,
      marketCapUsd,
      transactions24h,
      hashrate24h,
      circulation,
      circulatingSupply,
      shieldedTotal,
      shieldedSapling,
      shieldedOrchard,
      shieldedSprout,
    });
  } catch (err) {
    console.error("Stats fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
