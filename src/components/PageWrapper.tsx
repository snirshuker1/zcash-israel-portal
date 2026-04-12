"use client";

import { useState, useEffect, createContext } from "react";
import LoadingInterstitial from "./LoadingInterstitial";

// Resets on full page reload, survives client-side navigation
let hasSeenLoading = false;

// True once the loading interstitial has finished (or was skipped). Children
// that gate hero animations on this should only kick off after it flips.
export const PageReadyContext = createContext(false);

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (hasSeenLoading) setLoaded(true);
  }, []);

  return (
    <PageReadyContext.Provider value={loaded}>
      {!loaded && (
        <LoadingInterstitial
          onDone={() => {
            hasSeenLoading = true;
            setLoaded(true);
          }}
        />
      )}
      {children}
    </PageReadyContext.Provider>
  );
}
