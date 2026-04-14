"use client";

import { useEffect, useState } from "react";

// Binance bookTicker — fires on every best-bid/ask reprice.
// Strictly real market data: no simulation, no jitter, no fake ticks.
// Frame: { u: ..., s: "ZECUSDT", b: "45.21", B: "15", a: "45.22", A: "10" }
const BOOKTICKER_WS_URL = "wss://stream.binance.com:9443/ws/zecusdt@bookTicker";

const RECONNECT_BASE_MS = 500;
const RECONNECT_CAP_MS  = 8_000;
const TEARDOWN_DELAY_MS = 150;

type Snapshot = { price: number | null; connected: boolean };
type Listener = (snapshot: Snapshot) => void;

let ws: WebSocket | null = null;
let sharedPrice: number | null = null;
let sharedConnected = false;
let reconnectAttempts = 0;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let teardownTimer:  ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<Listener>();

function emit() {
  const snap: Snapshot = { price: sharedPrice, connected: sharedConnected };
  listeners.forEach((l) => l(snap));
}

function scheduleReconnect() {
  if (reconnectTimer || listeners.size === 0) return;
  const delay = Math.min(RECONNECT_BASE_MS * 2 ** reconnectAttempts, RECONNECT_CAP_MS);
  reconnectAttempts += 1;
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    openConnection();
  }, delay);
}

function openConnection() {
  if (typeof window === "undefined") return;
  if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) return;

  try {
    ws = new WebSocket(BOOKTICKER_WS_URL);
  } catch {
    ws = null;
    scheduleReconnect();
    return;
  }

  ws.onopen = () => {
    reconnectAttempts = 0;
    sharedConnected = true;
    emit();
  };

  ws.onmessage = (ev) => {
    try {
      const data = JSON.parse(ev.data as string);
      // bookTicker: b = best bid price
      const next = parseFloat(data?.b);
      if (!Number.isFinite(next) || next <= 0) return;
      sharedPrice = next;
      emit();
    } catch {
      // ignore malformed frames
    }
  };

  ws.onerror = () => {
    // onclose handles the reconnect path
  };

  ws.onclose = () => {
    sharedConnected = false;
    ws = null;
    emit();
    if (listeners.size > 0) scheduleReconnect();
  };
}

function closeConnection() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  if (ws) {
    ws.onopen    = null;
    ws.onmessage = null;
    ws.onerror   = null;
    ws.onclose   = null;
    if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
      try { ws.close(); } catch { /* already tearing down */ }
    }
    ws = null;
  }
  sharedConnected   = false;
  reconnectAttempts = 0;
}

export type LivePriceState = {
  price: number | null;
  connected: boolean;
};

export function useLiveZecPrice(initialPrice: number | null = null): LivePriceState {
  const [snapshot, setSnapshot] = useState<Snapshot>(() => ({
    price: sharedPrice,
    connected: sharedConnected,
  }));

  useEffect(() => {
    const listener: Listener = (snap) => setSnapshot({ ...snap });

    if (teardownTimer) {
      clearTimeout(teardownTimer);
      teardownTimer = null;
    }
    listeners.add(listener);
    openConnection();

    return () => {
      listeners.delete(listener);
      if (listeners.size === 0) {
        teardownTimer = setTimeout(() => {
          teardownTimer = null;
          if (listeners.size === 0) closeConnection();
        }, TEARDOWN_DELAY_MS);
      }
    };
  }, []);

  return {
    price: snapshot.price ?? initialPrice,
    connected: snapshot.connected,
  };
}
