import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://api.blockchair.com/zcash/stats", {
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error(`Blockchair ${res.status}`);

    const json = await res.json();
    const d = json.data;

    return NextResponse.json({
      blockHeight: d.best_block_height,
      priceUsd: d.market_price_usd,
      marketCapUsd: d.market_cap_usd,
      transactions24h: d.transactions_24h,
      hashrate24h: d.hashrate_24h,
      circulation: d.circulation, // satoshis
    });
  } catch (err) {
    console.error("Blockchair stats error:", err);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
