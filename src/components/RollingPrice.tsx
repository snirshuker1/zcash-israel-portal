"use client";

import { CSSProperties, useMemo } from "react";

interface Props {
  value: number | null;
  prefix?: string;
  decimals?: number;
  locale?: string;
  color?: string;
  fontFamily?: string;
  fontSize?: CSSProperties["fontSize"];
  fontWeight?: CSSProperties["fontWeight"];
  letterSpacing?: CSSProperties["letterSpacing"];
  lineHeight?: CSSProperties["lineHeight"];
  style?: CSSProperties;
  className?: string;
  placeholder?: string;
}

// Odometer rolling animation — 300 ms feels snappy without being distracting.
const ROLL_DURATION_MS = 300;
const ROLL_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

// Every visible character — digits, prefix, separators — renders inside an
// identically shaped `Cell`. This keeps them on the same visual line: because
// each cell is `inline-block` with `overflow: hidden`, CSS assigns its baseline
// to its bottom margin edge. By making every glyph share that same rule, they
// can never drift relative to one another ("jumping digits" bug).
const CELL_STYLE: CSSProperties = {
  display: "inline-block",
  height: "1em",
  lineHeight: 1,
  overflow: "hidden",
  textAlign: "center",
  verticalAlign: "baseline",
  fontVariantNumeric: "tabular-nums",
};

function Cell({ children }: { children: React.ReactNode }) {
  return (
    <span aria-hidden style={CELL_STYLE}>
      {children}
    </span>
  );
}

function DigitReel({ value }: { value: number }) {
  return (
    <span aria-hidden style={CELL_STYLE}>
      <span
        style={{
          display: "block",
          transform: `translateY(-${value}em)`,
          transition: `transform ${ROLL_DURATION_MS}ms ${ROLL_EASE}`,
          willChange: "transform",
        }}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            style={{
              display: "block",
              height: "1em",
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {i}
          </span>
        ))}
      </span>
    </span>
  );
}

export default function RollingPrice({
  value,
  prefix = "$",
  decimals = 2,
  locale = "en-US",
  color,
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
  style,
  className,
  placeholder = "—",
}: Props) {
  const formatted = useMemo(() => {
    if (value === null || !Number.isFinite(value)) return null;
    const fixed = value.toFixed(decimals);
    const [whole, frac] = fixed.split(".");
    const wholeGrouped = Number(whole).toLocaleString(locale);
    return frac ? `${wholeGrouped}.${frac}` : wholeGrouped;
  }, [value, decimals, locale]);

  const baseStyle: CSSProperties = {
    color,
    fontFamily,
    fontSize,
    fontWeight,
    letterSpacing,
    lineHeight: lineHeight ?? 1,
    fontVariantNumeric: "tabular-nums",
    ...style,
  };

  if (formatted === null) {
    return (
      <span className={className} style={baseStyle}>
        {placeholder}
      </span>
    );
  }

  return (
    <span
      className={className}
      aria-label={`${prefix}${formatted}`}
      role="text"
      style={{
        ...baseStyle,
        display: "inline-flex",
        alignItems: "baseline",
        whiteSpace: "nowrap",
      }}
    >
      {prefix && <Cell>{prefix}</Cell>}
      {formatted.split("").map((ch, i) => {
        if (/[0-9]/.test(ch)) {
          return <DigitReel key={i} value={parseInt(ch, 10)} />;
        }
        return <Cell key={`s${i}`}>{ch}</Cell>;
      })}
    </span>
  );
}
