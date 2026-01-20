"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import SockJS from "sockjs-client";
import { parseBearerToken } from "@/lib/utils/parse-bearer-token";

type TrackerStatus =
  | "STARTING"
  | "SEARCHING_INFORMATION"
  | "PROCESSING_INFORMATION"
  | "DONE"
  | "ERROR";

type TrackerType = "AUTOGENERATION" | "TRANSLATION" | "ENHANCEMENT";

export type { TrackerType };

interface TrackerMessage {
  trackerId: string;
  status: TrackerStatus;
  type: TrackerType;
  resourceId: string;
}

interface TrackerContextType {
  isTracking: boolean;
  trackingId: string | null;
  resourceId: string | null;
  status: TrackerStatus | null;
  trackerType: TrackerType | null;
  statusMessage: string;
  isFinished: boolean;
  hasError: boolean;
  startTracking: () => Promise<void>;
  stopTracking: () => void;
}

const TrackerContext = createContext<TrackerContextType | undefined>(undefined);

let activeSocket: any | null = null;

const STATUS_MESSAGES: Record<TrackerType, Record<TrackerStatus, string>> = {
  AUTOGENERATION: {
    STARTING: "Starting auto-generation...",
    SEARCHING_INFORMATION: "Searching for information...",
    PROCESSING_INFORMATION: "Processing information...",
    DONE: "Resume generated!",
    ERROR: "Generation failed",
  },
  TRANSLATION: {
    STARTING: "Starting translation...",
    SEARCHING_INFORMATION: "Preparing translation...",
    PROCESSING_INFORMATION: "Translating content...",
    DONE: "Translation complete!",
    ERROR: "Translation failed",
  },
  ENHANCEMENT: {
    STARTING: "Starting enhancement...",
    SEARCHING_INFORMATION: "Analyzing resume...",
    PROCESSING_INFORMATION: "Enhancing content...",
    DONE: "Enhancement complete!",
    ERROR: "Enhancement failed",
  },
};

const TYPE_LABELS: Record<TrackerType, string> = {
  AUTOGENERATION: "Auto-generation",
  TRANSLATION: "Translation",
  ENHANCEMENT: "Enhancement",
};

export { TYPE_LABELS };

export function TrackerProvider({ children }: { children: React.ReactNode }) {
  const [isTracking, setIsTracking] = useState(false);
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [resourceId, setResourceId] = useState<string | null>(null);
  const [status, setStatus] = useState<TrackerStatus | null>(null);
  const [trackerType, setTrackerType] = useState<TrackerType | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [hasError, setHasError] = useState(false);

  const stopTracking = useCallback(() => {
    activeSocket?.close();
    activeSocket = null;

    setIsTracking(false);
    setTrackingId(null);
    setResourceId(null);
    setStatus(null);
    setTrackerType(null);
    setIsFinished(false);
    setHasError(false);
  }, []);

  const startTracking = useCallback(async () => {
    activeSocket?.close();
    activeSocket = null;

    setIsTracking(true);
    setIsFinished(false);
    setHasError(false);
    setStatus("STARTING");

    let accessToken: string | undefined;

    try {
      const response = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          endpoint: "/api/v1/auth/refresh",
          method: "POST",
        }),
      });

      if (response.ok) {
        accessToken = parseBearerToken(response.headers.get("authorization"));
        if (!accessToken) {
          const data = await response.json().catch(() => null);
          accessToken = data?.accessToken;
        }
      }
    } catch {
      setHasError(true);
      setIsFinished(true);
      return;
    }

    const baseUrl =
      process.env.NODE_ENV === "production"
        ? `https://${process.env.NEXT_PUBLIC_BACKEND_CORE_URL}`
        : `http://localhost:8081`; // port 8081 bo Spring

    const socket = new SockJS(
      `${baseUrl}/api/v1/core/ws/tracker?token=${accessToken}`,
    );

    activeSocket = socket;

    socket.onopen = () => {
      console.log("SockJS connected");
    };

    socket.onmessage = (event) => {
      try {
        const data: TrackerMessage = JSON.parse(event.data);

        setTrackingId(data.trackerId);
        setStatus(data.status);
        setResourceId(data.resourceId);
        setTrackerType(data.type);

        if (data.status === "DONE") {
          setIsFinished(true);
        }

        if (data.status === "ERROR") {
          setHasError(true);
          setIsFinished(true);
        }
      } catch {
        setHasError(true);
        setIsFinished(true);
      }
    };

    socket.onerror = () => {
      console.warn("SockJS transport error");
    };

    socket.onclose = () => {
      console.log("SockJS connection closed");
    };
  }, [isFinished]);

  const statusMessage =
    status && trackerType
      ? STATUS_MESSAGES[trackerType][status]
      : "Connecting...";

  return (
    <TrackerContext.Provider
      value={{
        isTracking,
        trackingId,
        resourceId,
        status,
        trackerType,
        statusMessage,
        isFinished,
        hasError,
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
  if (!context) {
    throw new Error("useTracker must be used within TrackerProvider");
  }
  return context;
}
