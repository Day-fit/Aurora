"use client";

import React, { createContext, useContext, useState } from "react";

interface TrackerContextType {
  isTracking: boolean;
  startTracking: () => void;
  stopTracking: () => void;
}

const TrackerContext = createContext<TrackerContextType | undefined>(undefined);

export function TrackerProvider({ children }: { children: React.ReactNode }) {
  const [isTracking, setIsTracking] = useState(false);

  const startTracking = () => setIsTracking(true);
  const stopTracking = () => setIsTracking(false);

  return (
    <TrackerContext.Provider
      value={{ isTracking, startTracking, stopTracking }}
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
