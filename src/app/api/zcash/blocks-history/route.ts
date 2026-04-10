import { NextResponse } from "next/server";

const PERIOD_LIMIT: Record<string, number> = {
  "1w": 7,
  "1m": 30,
  "3m": 90,
  "1y": 365,
  "all": 365, // Blockchair practical max for daily aggregates
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") ?? "1y";
  const limit = PERIOD_LIMIT[period] ?? 365;

  try {
    const res = await fetch(
      `https://api.blockchair.com/zcash/blocks?a=date,count()&limit=${limit}&s=date(desc)`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) throw new Error(`Blockchair blocks ${res.status}`);

    const json = await res.json();
    const data = (json.data as { date: string; "count()": number }[])
      .reverse()
      .map((row) => ({
        date: new Date(row.date).toLocaleDateString("en-US", {
          month: "short",
          ...(period === "1w" || period === "1m" ? { day: "numeric" } : { year: "numeric" }),
        }),
        blocks: row["count()"],
      }));

    return NextResponse.json(data);
  } catch (err) {
    console.error("Blockchair blocks history error:", err);
    return NextResponse.json({ error: "Failed to fetch blocks history" }, { status: 500 });
  }
}
