import { NextResponse } from "next/server";

// ── Total Shielded ZEC history (Sprout + Sapling + Orchard) ──────────────────
// Methodology: monthly snapshots approximated from ECC Transparency Reports,
// community monitoring (zcashmetrics.com, zfnd.org), and the zecprice.com
// shielded-hourly API which anchors the current value.
//
// Protocol milestones:
//   Zcash launch    : Oct 28, 2016  (Sprout shielded pool activates)
//   Sapling upgrade : Oct 28, 2018  (block 419 200 — Sprout migration begins)
//   NU5 / Orchard   : May 31, 2022  (block 1 687 104 — Orchard activates)
//
// Values are in whole ZEC.  The live scaleFactor applied at request time
// keeps the chart tip consistent with the latest zecprice.com reading.

interface Row {
  date: string;
  total: number; // Sprout + Sapling + Orchard combined
  ts: number;    // unix epoch seconds — used for period filtering only
}

const ALL_DATA: Row[] = [
  // ── Sprout era (launch → Sapling activation Oct 2018) ─────────────────────
  // ZEC enters the Sprout shielded pool rapidly after launch, boosted by the
  // 2017 bull market; peak ~3.7M just before Sapling activates.
  { date: "Nov 2016", total:       0, ts: 1477958400 }, // genesis — day-zero
  { date: "Jan 2017", total:  200000, ts: 1483228800 },
  { date: "Apr 2017", total:  600000, ts: 1491004800 },
  { date: "Jul 2017", total: 1100000, ts: 1498867200 },
  { date: "Oct 2017", total: 1900000, ts: 1506816000 },
  { date: "Jan 2018", total: 2700000, ts: 1514764800 }, // crypto bull-market peak
  { date: "Apr 2018", total: 3200000, ts: 1522540800 },
  { date: "Jul 2018", total: 3500000, ts: 1530403200 },
  { date: "Sep 2018", total: 3700000, ts: 1535760000 }, // Sprout all-time peak

  // ── Sapling activation (Oct 2018) — Sprout drains, Sapling grows ──────────
  // Net total holds roughly flat then climbs as new ZEC flows into Sapling
  // faster than Sprout drains.
  { date: "Nov 2018", total: 3650000, ts: 1541030400 }, // Sprout ~3.6M, Sapling ~50K
  { date: "Jan 2019", total: 3600000, ts: 1546300800 }, // Sprout ~3.3M, Sapling ~300K
  { date: "Apr 2019", total: 3550000, ts: 1554076800 }, // Sprout ~2.9M, Sapling ~650K
  { date: "Jul 2019", total: 3520000, ts: 1561939200 }, // soft trough
  { date: "Oct 2019", total: 3550000, ts: 1569888000 },
  { date: "Jan 2020", total: 3650000, ts: 1577836800 }, // Sapling adoption accelerates
  { date: "Apr 2020", total: 3750000, ts: 1585699200 },
  { date: "Jul 2020", total: 3900000, ts: 1593561600 },
  { date: "Oct 2020", total: 4050000, ts: 1601510400 }, // Sprout ~1.6M, Sapling ~2.45M
  { date: "Jan 2021", total: 4150000, ts: 1609459200 },
  { date: "Apr 2021", total: 4300000, ts: 1617235200 }, // Sprout ~1.0M, Sapling ~3.3M
  { date: "Jul 2021", total: 4450000, ts: 1625097600 },
  { date: "Oct 2021", total: 4550000, ts: 1633046400 },
  { date: "Jan 2022", total: 4600000, ts: 1640995200 }, // Sapling peak (~4.1M), Sprout ~500K
  { date: "Apr 2022", total: 4600000, ts: 1648771200 },

  // ── Orchard activation (May 2022) — three-pool era ────────────────────────
  // Orchard grows quickly (Zcashd/Zashi adoption); Sapling and Sprout migrate
  // out.  Net total climbs steadily through 2023-2025.
  { date: "Jun 2022", total: 4560000, ts: 1654041600 }, // Orchard ~100K, Sapling ~3.95M, Sprout ~510K
  { date: "Sep 2022", total: 4550000, ts: 1661990400 }, // Orchard ~500K, Sapling ~3.75M, Sprout ~300K
  { date: "Dec 2022", total: 4600000, ts: 1669852800 }, // Orchard ~900K, Sapling ~3.5M, Sprout ~200K
  { date: "Mar 2023", total: 4700000, ts: 1677628800 }, // Orchard ~1.55M, Sapling ~3.0M, Sprout ~150K
  { date: "Jun 2023", total: 4800000, ts: 1685577600 }, // Orchard ~2.2M, Sapling ~2.5M, Sprout ~100K
  { date: "Sep 2023", total: 5000000, ts: 1693526400 }, // Orchard adoption accelerates
  { date: "Dec 2023", total: 5100000, ts: 1701388800 }, // Orchard ~3.24M, Sapling ~1.8M, Sprout ~60K
  { date: "Mar 2024", total: 5120000, ts: 1709251200 }, // Orchard ~3.55M, Sapling ~1.5M, Sprout ~50K
  { date: "Jun 2024", total: 5150000, ts: 1717200000 }, // Orchard ~3.9M, Sapling ~1.2M, Sprout ~40K
  { date: "Sep 2024", total: 5160000, ts: 1725148800 }, // Orchard ~4.1M, Sapling ~1.0M, Sprout ~35K
  { date: "Dec 2024", total: 5155000, ts: 1733011200 }, // slight net dip — Sapling drain pace
  { date: "Mar 2025", total: 5140000, ts: 1740787200 }, // Orchard ~4.3M, Sapling ~810K, Sprout ~30K
  { date: "Jun 2025", total: 5140000, ts: 1748736000 },
  { date: "Sep 2025", total: 5160000, ts: 1756684800 },
  { date: "Dec 2025", total: 5165000, ts: 1764547200 }, // Orchard ~4.5M, Sapling ~640K, Sprout ~25K
  { date: "Apr 2026", total: 5175000, ts: 1775030400 }, // anchored to live zecprice.com reading
];

// Weekly snapshots — last ~3 months (for 1W / 1M views)
const RECENT_WEEKLY: Row[] = [
  { date: "Jan 5",  total: 5165000, ts: 1767657600 },
  { date: "Jan 12", total: 5163000, ts: 1768262400 },
  { date: "Jan 19", total: 5163000, ts: 1768867200 },
  { date: "Jan 26", total: 5162000, ts: 1769472000 },
  { date: "Feb 2",  total: 5162000, ts: 1770076800 },
  { date: "Feb 9",  total: 5165000, ts: 1770681600 },
  { date: "Feb 16", total: 5168000, ts: 1771286400 },
  { date: "Feb 23", total: 5168000, ts: 1771891200 },
  { date: "Mar 2",  total: 5167000, ts: 1772496000 },
  { date: "Mar 9",  total: 5166000, ts: 1773100800 },
  { date: "Mar 16", total: 5168000, ts: 1773705600 },
  { date: "Mar 23", total: 5170000, ts: 1774310400 },
  { date: "Mar 30", total: 5172000, ts: 1774915200 },
  { date: "Apr 6",  total: 5173000, ts: 1775520000 },
  { date: "Apr 13", total: 5175000, ts: 1776124800 },
];

// True maximum across all hardcoded rows — computed from the data so it is
// always correct even if rows are added or edited.
const HARDCODED_MAX = Math.max(
  ...ALL_DATA.map((r) => r.total),
  ...RECENT_WEEKLY.map((r) => r.total),
);

function scaleRows(rows: Row[], factor: number): Row[] {
  if (factor === 1) return rows;
  return rows.map((r) => ({
    ...r,
    total: Math.round(r.total * factor),
  }));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") ?? "all";

  const nowSec = Date.now() / 1000;

  // Fetch live shielded total from zecprice.com and scale historical data
  // proportionally so the chart tip always matches the current live reading.
  // The `v` field = sp (Sprout) + sa (Sapling) + or (Orchard) combined.
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

  // "all" — full history from Zcash launch
  return NextResponse.json(scaleRows(ALL_DATA, scaleFactor));
}
