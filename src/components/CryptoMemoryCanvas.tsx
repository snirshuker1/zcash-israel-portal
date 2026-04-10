"use client";

import { useEffect, useRef } from "react";

/**
 * Zcash Cryptographic Memory Matrix
 * Canvas-based heatmap hex-grid — converted from vanilla JS to React.
 * Renders as a fixed background layer; pointer-events disabled.
 */

// ─── Design constants (do not alter) ─────────────────────────────────────────
const COLORS = {
  bg:       "#040404",
  coldText: "#151515",
  warmText: "#5c4b1e",
  hotText:  "#F4B728",
  peakText: "#ffffff",
};

const HEX_CHARS   = "0123456789ABCDEF";
const FONT_SIZE   = 12;
const WORD_LENGTH = 8;
const LINE_HEIGHT = 18;
const DECAY_RATE  = 0.02;

// ─── Types ────────────────────────────────────────────────────────────────────
interface Cell {
  text:          string;
  heat:          number;
  isCalculating: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getHexWord(): string {
  let s = "";
  for (let i = 0; i < WORD_LENGTH; i++) {
    s += HEX_CHARS[Math.floor(Math.random() * 16)];
  }
  return s;
}

function getColorForHeat(heat: number): string {
  if (heat < 0.1) return COLORS.coldText;
  if (heat < 0.4) return COLORS.warmText;
  if (heat < 0.8) return COLORS.hotText;
  return COLORS.peakText;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CryptoMemoryCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    // Cast to non-null so nested closures see the narrowed types
    const canvas = canvasRef.current as HTMLCanvasElement;

    const rawCtx = canvas.getContext("2d", { alpha: false });
    if (!rawCtx) return;
    const ctx = rawCtx as CanvasRenderingContext2D;

    // Mutable state — lives inside the effect closure
    let grid: Cell[][]  = [];
    let cols            = 0;
    let rows            = 0;
    let wordWidth       = 0;
    let rafId: number;
    let alive           = true; // guard against stale RAF after unmount

    // ── Grid initialisation (also called on resize) ──────────────────────────
    function initGrid() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;

      // Canvas resize resets context state — re-apply font before measuring
      ctx.font          = `${FONT_SIZE}px 'Consolas', monospace`;
      ctx.textBaseline  = "top";

      const charWidth = ctx.measureText("A").width;
      wordWidth = charWidth * WORD_LENGTH + 15;

      cols = Math.ceil(canvas.width  / wordWidth);
      rows = Math.ceil(canvas.height / LINE_HEIGHT);

      grid = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({
          text:          getHexWord(),
          heat:          Math.random() * 0.1,
          isCalculating: false,
        }))
      );
    }

    // ── Main render loop ─────────────────────────────────────────────────────
    function renderLoop() {
      if (!alive) return;

      // Hard-clear (alpha:false context, no transparency cost)
      ctx.fillStyle = COLORS.bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font         = `${FONT_SIZE}px 'Consolas', monospace`;
      ctx.textBaseline = "top";

      // Inject sparks (1–5 hot cells per frame)
      const numSparks = Math.floor(Math.random() * 5) + 1;
      for (let i = 0; i < numSparks; i++) {
        const rx = Math.floor(Math.random() * cols);
        const ry = Math.floor(Math.random() * rows);
        const row = grid[ry];
        if (!row || !row[rx]) continue;
        row[rx].heat          = 1.0;
        row[rx].isCalculating = true;
        // Spread heat to neighbours (cluster effect)
        if (rx > 0)         row[rx - 1].heat = Math.max(row[rx - 1].heat, 0.5);
        if (rx < cols - 1)  row[rx + 1].heat = Math.max(row[rx + 1].heat, 0.5);
      }

      // Update + draw each cell
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const cell = grid[y][x];

          // Gradual cool-down
          if (cell.heat > 0) {
            cell.heat -= DECAY_RATE;
            if (cell.heat < 0) cell.heat = 0;
          }

          // Active computation: scramble text until half-cooled
          if (cell.isCalculating) {
            cell.text = getHexWord();
            if (cell.heat < 0.5) cell.isCalculating = false;
          }

          ctx.fillStyle = getColorForHeat(cell.heat);

          // Glow on hot cells
          if (cell.heat >= 0.8) {
            ctx.shadowBlur  = 10;
            ctx.shadowColor = COLORS.hotText;
          } else {
            ctx.shadowBlur = 0;
          }

          ctx.fillText(cell.text, x * wordWidth, y * LINE_HEIGHT);
        }
      }

      rafId = requestAnimationFrame(renderLoop);
    }

    // ── Bootstrap ────────────────────────────────────────────────────────────
    initGrid();
    rafId = requestAnimationFrame(renderLoop);

    const onResize = () => initGrid();
    window.addEventListener("resize", onResize);

    // ── Cleanup (CRITICAL — no leaks) ────────────────────────────────────────
    return () => {
      alive = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position:      "absolute",
        inset:         0,
        zIndex:        1,
        display:       "block",
        pointerEvents: "none",
      }}
    />
  );
}
