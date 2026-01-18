"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
} from "react";

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

const FALLBACK_WS_URL = "ws://localhost:8081/api/v1/core/ws/tracker";

export function TrackerProvider({ children }: { children: React.ReactNode }) {
  const [isTracking, setIsTracking] = useState(false);
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [resourceId, setResourceId] = useState<string | null>(null);
  const [status, setStatus] = useState<TrackerStatus | null>(null);
  const [trackerType, setTrackerType] = useState<TrackerType | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [hasError, setHasError] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  const stopTracking = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.close();
    }
    socketRef.current = null;
    setIsTracking(false);
    setTrackingId(null);
    setResourceId(null);
    setStatus(null);
    setTrackerType(null);
    setIsFinished(false);
    setHasError(false);
  }, []);

  const startTracking = useCallback(async () => {
    if (socketRef.current) {
      socketRef.current.close();
    }

    setIsTracking(true);
    setIsFinished(false);
    setHasError(false);
    setStatus("STARTING");

    let wsUrl: string;
    let accessToken: string | null = null;

    try {
      // Get WebSocket URL and access token from server-side API
      const response = await fetch("/api/ws-config", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const config = await response.json();
        wsUrl = config.wsUrl;
        accessToken = config.accessToken;
      } else {
        console.error("Failed to get WebSocket config:", response.status);
        wsUrl = FALLBACK_WS_URL;
      }
    } catch (error) {
      console.error("Failed to fetch WebSocket config:", error);
      wsUrl = FALLBACK_WS_URL;
    }

    // Append token to URL if available
    const finalWsUrl = accessToken ? `${wsUrl}?token=${accessToken}` : wsUrl;

    console.log("Token found:", accessToken ? "yes" : "no");
    console.log("WS URL:", finalWsUrl);

    const socket = new WebSocket(finalWsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
        try {
          const data: TrackerMessage = JSON.parse(event.data);
          console.log("Tracker message:", data);

          setTrackingId(data.trackerId);
          setStatus(data.status);
          setResourceId(data.resourceId);
          setTrackerType(data.type);

          if (data.status === "DONE") {
            setIsFinished(true);
          } else if (data.status === "ERROR") {
            setHasError(true);
            setIsFinished(true);
          }
        } catch (err) {
          console.error("Failed to parse tracker message:", err);
        }
      };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setHasError(true);
    };

    socket.onclose = (event) => {
      console.log("WebSocket closed:", event.code, event.reason);
    };
  }, []);

  const statusMessage = status && trackerType
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
  if (!context)
    throw new Error("useTracker must be used within a TrackerProvider");
  return context;
}
