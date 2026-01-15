// aurora-front/src/context/tracker-context.tsx
"use client";

import React, { createContext, useContext, useState } from "react";

interface TrackerContextType {
  isTracking: boolean;
  trackingId: string | null;
  autoGenerationId: string | null;
  startTracking: (trackingId: string, autoGenerationId?: string) => void;
  stopTracking: () => void;
}

const TrackerContext = createContext<TrackerContextType | undefined>(undefined);

export function TrackerProvider({ children }: { children: React.ReactNode }) {
  const [isTracking, setIsTracking] = useState(false);
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [autoGenerationId, setAutoGenerationId] = useState<string | null>(null);

  const startTracking = (id: string, autoGenId?: string) => {
    setTrackingId(id);
    setAutoGenerationId(autoGenId || null);
    setIsTracking(true);
  };

  const stopTracking = () => {
    setIsTracking(false);
    setTrackingId(null);
    setAutoGenerationId(null);
  };

  return (
    <TrackerContext.Provider
      value={{
        isTracking,
        trackingId,
        autoGenerationId,
        startTracking,
        stopTracking,
      }}
    >
      {children}
    </TrackerContext.Provider>
  );
}

export function useTracker() {
  const context = useContext(TrackerContext);
  if (!context)
    throw new Error("useTracker must be used within a TrackerProvider");
  return context;
}
