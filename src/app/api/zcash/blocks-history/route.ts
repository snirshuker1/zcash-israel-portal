import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get daily block count for the last 30 days
    const res = await fetch(
      "https://api.blockchair.com/zcash/blocks?a=date,count()&limit=30&s=date(desc)",
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) throw new Error(`Blockchair blocks ${res.status}`);

    const json = await res.json();

    // Blockchair returns newest first — reverse for chart chronology
    const data = (
      json.data as { date: string; "count()": number }[]
    )
      .reverse()
      .map((row) => ({
        date: new Date(row.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        blocks: row["count()"],
      }));

    return NextResponse.json(data);
  } catch (err) {
    console.error("Blockchair blocks history error:", err);
    return NextResponse.json({ error: "Failed to fetch blocks history" }, { status: 500 });
  }
}
