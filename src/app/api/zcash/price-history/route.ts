import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/zcash/market_chart?vs_currency=usd&days=30&interval=daily",
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) throw new Error(`CoinGecko ${res.status}`);

    const json = await res.json();

    const prices = (json.prices as [number, number][]).map(([ts, price]) => ({
      date: new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      price: Math.round(price * 100) / 100,
    }));

    return NextResponse.json(prices);
  } catch (err) {
    console.error("CoinGecko price history error:", err);
    return NextResponse.json({ error: "Failed to fetch price history" }, { status: 500 });
  }
}
