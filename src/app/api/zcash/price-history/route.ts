import { NextResponse } from "next/server";

const PERIOD_DAYS: Record<string, number> = {
  "1w": 7,
  "1m": 30,
  "3m": 90,
  "1y": 365,
  "all": 1825, // 5 years
};

function fmtDate(ts: number, period: string): string {
  const d = new Date(ts);
  if (period === "1w" || period === "1m") {
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") ?? "1y";
  const days = PERIOD_DAYS[period] ?? 365;

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/zcash/market_chart?vs_currency=usd&days=${days}&interval=daily`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) throw new Error(`CoinGecko ${res.status}`);

    const json = await res.json();
    const prices = (json.prices as [number, number][]).map(([ts, price]) => ({
      date: fmtDate(ts, period),
      price: Math.round(price * 100) / 100,
    }));

    return NextResponse.json(prices);
  } catch (err) {
    console.error("CoinGecko price history error:", err);
    return NextResponse.json({ error: "Failed to fetch price history" }, { status: 500 });
  }
}
