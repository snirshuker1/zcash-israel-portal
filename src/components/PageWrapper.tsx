"use client";

import { useState, useEffect } from "react";
import LoadingInterstitial from "./LoadingInterstitial";

// Resets on full page reload, survives client-side navigation
let hasSeenLoading = false;

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (hasSeenLoading) setLoaded(true);
  }, []);

  return (
    <>
      {!loaded && (
        <LoadingInterstitial
          onDone={() => {
            hasSeenLoading = true;
            setLoaded(true);
          }}
        />
      )}
      {children}
    </>
  );
}
