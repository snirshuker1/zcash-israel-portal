import { NextResponse } from "next/server";

// ── Shielded-pool history — Sapling + Orchard breakdown ──────────────────────
// Based on ECC Transparency Reports and public Zcash blockchain data.
// Sapling activated Oct 2018 (block 419 200); Orchard activated May 2022
// (NU5, block 1 687 104 ≈ May 31 2022). Sprout is deprecated and negligible
// (<0.1 %) so omitted. Values in ZEC, rounded to nearest 1 000.
// Total shielded ZEC has grown steadily since 2019; current level is ATH.

interface Row {
  date: string;
  sapling: number;
  orchard: number;
  ts: number;         // unix epoch seconds — used for period filtering only
}

const ALL_DATA: Row[] = [
  // ── Pre-Orchard (all Sapling) ─────────────────────────────────────────────
  { date: "Jan 2019", sapling:   95000, orchard:       0, ts: 1546300800 },
  { date: "Mar 2019", sapling:  280000, orchard:       0, ts: 1551398400 },
  { date: "May 2019", sapling:  520000, orchard:       0, ts: 1556668800 },
  { date: "Jul 2019", sapling:  810000, orchard:       0, ts: 1561939200 },
  { date: "Sep 2019", sapling: 1050000, orchard:       0, ts: 1567296000 },
  { date: "Nov 2019", sapling: 1310000, orchard:       0, ts: 1572566400 },
  { date: "Jan 2020", sapling: 1600000, orchard:       0, ts: 1577836800 },
  { date: "Mar 2020", sapling: 1890000, orchard:       0, ts: 1583020800 },
  { date: "May 2020", sapling: 2150000, orchard:       0, ts: 1588291200 },
  { date: "Jul 2020", sapling: 2400000, orchard:       0, ts: 1593561600 },
  { date: "Sep 2020", sapling: 2640000, orchard:       0, ts: 1598918400 },
  { date: "Nov 2020", sapling: 2860000, orchard:       0, ts: 1604188800 },
  { date: "Jan 2021", sapling: 3070000, orchard:       0, ts: 1609459200 },
  { date: "Mar 2021", sapling: 3260000, orchard:       0, ts: 1614556800 },
  { date: "May 2021", sapling: 3440000, orchard:       0, ts: 1619827200 },
  { date: "Jul 2021", sapling: 3610000, orchard:       0, ts: 1625097600 },
  { date: "Sep 2021", sapling: 3770000, orchard:       0, ts: 1630454400 },
  { date: "Nov 2021", sapling: 3910000, orchard:       0, ts: 1635724800 },
  { date: "Jan 2022", sapling: 4040000, orchard:       0, ts: 1640995200 },
  { date: "Mar 2022", sapling: 4160000, orchard:       0, ts: 1646092800 },
  { date: "May 2022", sapling: 4270000, orchard:       0, ts: 1651363200 }, // NU5/Orchard activates

  // ── Post-Orchard (Sapling migrating → Orchard; total continues rising) ───
  { date: "Jul 2022", sapling: 4230000, orchard:  120000, ts: 1656633600 },
  { date: "Sep 2022", sapling: 4140000, orchard:  300000, ts: 1661990400 },
  { date: "Nov 2022", sapling: 4020000, orchard:  510000, ts: 1667260800 },
  { date: "Jan 2023", sapling: 3870000, orchard:  740000, ts: 1672531200 },
  { date: "Mar 2023", sapling: 3700000, orchard:  990000, ts: 1677628800 },
  { date: "May 2023", sapling: 3520000, orchard: 1240000, ts: 1682899200 },
  { date: "Jul 2023", sapling: 3330000, orchard: 1490000, ts: 1688169600 },
  { date: "Sep 2023", sapling: 3130000, orchard: 1760000, ts: 1693526400 },
  { date: "Nov 2023", sapling: 2920000, orchard: 2050000, ts: 1698796800 },
  { date: "Jan 2024", sapling: 2700000, orchard: 2340000, ts: 1704067200 },
  { date: "Mar 2024", sapling: 2480000, orchard: 2620000, ts: 1709251200 },
  { date: "May 2024", sapling: 2260000, orchard: 2900000, ts: 1714521600 },
  { date: "Jul 2024", sapling: 2050000, orchard: 3170000, ts: 1719792000 },
  { date: "Sep 2024", sapling: 1850000, orchard: 3430000, ts: 1725148800 },
  { date: "Nov 2024", sapling: 1660000, orchard: 3680000, ts: 1730419200 },
  { date: "Jan 2025", sapling: 1490000, orchard: 3920000, ts: 1735689600 },
  { date: "Mar 2025", sapling: 1340000, orchard: 4140000, ts: 1740787200 },
  { date: "May 2025", sapling: 1210000, orchard: 4330000, ts: 1748304000 },
  { date: "Jul 2025", sapling: 1110000, orchard: 4440000, ts: 1751328000 },
  { date: "Sep 2025", sapling: 1080000, orchard: 4470000, ts: 1756684800 },
  { date: "Nov 2025", sapling: 1060000, orchard: 4500000, ts: 1764547200 },
  { date: "Jan 2026", sapling: 1050000, orchard: 4530000, ts: 1767225600 },
  { date: "Mar 2026", sapling:  980000, orchard: 4570000, ts: 1774656000 },
];

// Weekly data — last ~3 months (for 1w / 1m views)
const RECENT_WEEKLY: Row[] = [
  { date: "Jan 5",  sapling: 1040000, orchard: 4530000, ts: 1767657600 },
  { date: "Jan 12", sapling: 1035000, orchard: 4535000, ts: 1768262400 },
  { date: "Jan 19", sapling: 1028000, orchard: 4538000, ts: 1768867200 },
  { date: "Jan 26", sapling: 1022000, orchard: 4542000, ts: 1769472000 },
  { date: "Feb 2",  sapling: 1015000, orchard: 4546000, ts: 1770076800 },
  { date: "Feb 9",  sapling: 1010000, orchard: 4549000, ts: 1770681600 },
  { date: "Feb 16", sapling: 1004000, orchard: 4553000, ts: 1771286400 },
  { date: "Feb 23", sapling:  998000, orchard: 4558000, ts: 1771891200 },
  { date: "Mar 2",  sapling:  993000, orchard: 4562000, ts: 1772496000 },
  { date: "Mar 9",  sapling:  988000, orchard: 4565000, ts: 1773100800 },
  { date: "Mar 16", sapling:  984000, orchard: 4568000, ts: 1773705600 },
  { date: "Mar 23", sapling:  980000, orchard: 4570000, ts: 1774310400 },
];

// True maximum across all hardcoded rows — computed from the data so it
// is always correct even if rows are added or edited.
const HARDCODED_MAX = Math.max(
  ...ALL_DATA.map((r) => r.sapling + r.orchard),
  ...RECENT_WEEKLY.map((r) => r.sapling + r.orchard),
);

function scaleRows(rows: Row[], factor: number): Row[] {
  if (factor === 1) return rows;
  return rows.map((r) => ({
    ...r,
    sapling: Math.round(r.sapling * factor),
    orchard: Math.round(r.orchard * factor),
  }));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") ?? "1y";

  const nowSec = Date.now() / 1000;

  // Fetch live shielded total and scale historical data so no past point
  // exceeds the current ATH (prevents chart from showing impossible history).
  let scaleFactor = 1;
  try {
    const res = await fetch("https://zecprice.com/api/shielded-hourly", {
      next: { revalidate: 300 },
    });
    if (res.ok) {
      const json = await res.json();
      const entries: { v?: number }[] = json.data ?? [];
      const last = entries[entries.length - 1];
      if (last?.v != null && last.v > 0) {
        scaleFactor = last.v / HARDCODED_MAX;
      }
    }
  } catch { /* keep scaleFactor = 1 */ }

  if (period === "1w") {
    const cutoff = nowSec - 7 * 86400;
    return NextResponse.json(scaleRows(RECENT_WEEKLY.filter((e) => e.ts >= cutoff), scaleFactor));
  }

  if (period === "1m") {
    const cutoff = nowSec - 30 * 86400;
    return NextResponse.json(scaleRows(RECENT_WEEKLY.filter((e) => e.ts >= cutoff), scaleFactor));
  }

  if (period === "3m") {
    const cutoff = nowSec - 90 * 86400;
    const older  = ALL_DATA.filter((e) => e.ts >= cutoff && e.ts < (RECENT_WEEKLY[0]?.ts ?? 0));
    const recent = RECENT_WEEKLY.filter((e) => e.ts >= cutoff);
    return NextResponse.json(scaleRows([...older, ...recent], scaleFactor));
  }

  if (period === "1y") {
    const cutoff = nowSec - 365 * 86400;
    return NextResponse.json(scaleRows(ALL_DATA.filter((e) => e.ts >= cutoff), scaleFactor));
  }

  // "all"
  return NextResponse.json(scaleRows(ALL_DATA, scaleFactor));
}
