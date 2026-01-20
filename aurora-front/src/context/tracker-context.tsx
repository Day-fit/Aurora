"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
} from "react";
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
          try {
            const data = await response.json();
            accessToken = data?.accessToken;
          } catch (error) {
            console.error("Failed to parse refresh response:", error);
          }
        }
      } else {
        console.error("Refresh failed with status:", response.status);
      }
    } catch (error) {
      console.error("Failed to refresh access token:", error);
    }

    const wsUrl =
      (process.env.NODE_ENV === "production"
        ? `https://${process.env.NEXT_PUBLIC_BACKEND_CORE_URL}`
        : `http://${process.env.NEXT_PUBLIC_BACKEND_CORE_URL}`) +
      `/api/v1/core/ws/tracker?token=${accessToken}`;

    console.log("Token found:", accessToken ? "yes" : "no");
    console.log("WS URL:", wsUrl);

    const socket = new SockJS(wsUrl);
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
  if (!context)
    throw new Error("useTracker must be used within a TrackerProvider");
  return context;
}
