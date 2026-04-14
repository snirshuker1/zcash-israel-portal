import { NextResponse } from "next/server";

interface RawEntry {
  t: number;  // unix timestamp (seconds)
  h: number;  // block height
  sp: number; // Sprout pool
  sa: number; // Sapling pool
  or: number; // Orchard pool
  v: number;  // pre-computed total (sp + sa + or)
}

interface DataPoint {
  date: string;  // "Mon YYYY" e.g. "Nov 2016"
  total: number; // ZEC (whole number)
}

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function toMonthKey(ts: number): string {
  const d = new Date(ts * 1000);
  return `${MONTH_NAMES[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export async function GET() {
  try {
    const res = await fetch("https://zecprice.com/shielded-pool-data.json", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`Upstream ${res.status}`);

    const json: { data: RawEntry[] } = await res.json();
    const entries: RawEntry[] = json.data ?? [];

    // Drop the last raw entry — it is often a partial/in-progress block window
    // that produces an anomalous spike. The client injects the true live value.
    const trimmed = entries.slice(0, -1);

    // Downsample to monthly: keep the LAST entry for each calendar month.
    // Map insertion order = chronological order of first occurrence, so
    // iteration produces a sorted timeline automatically.
    const monthMap = new Map<string, RawEntry>();
    for (const e of trimmed) {
      monthMap.set(toMonthKey(e.t), e);
    }

    const points: DataPoint[] = [];

    // Hardcoded anchor: Nov 2016, total = 0
    points.push({ date: "Nov 2016", total: 0 });

    for (const [date, e] of monthMap) {
      // Drop Oct 2016 (launch month) — anchor above replaces it cleanly.
      if (date === "Oct 2016" || date === "Nov 2016") continue;
      points.push({
        date,
        total: Math.round(e.sp + e.sa + e.or), // explicit sum per spec
      });
    }

    return NextResponse.json(points);
  } catch {
    return NextResponse.json({ error: "Failed to fetch shielded pool data" }, { status: 500 });
  }
}
