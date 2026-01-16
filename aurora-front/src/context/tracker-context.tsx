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

interface TrackerMessage {
  trackerId: string;
  status: TrackerStatus;
  type: string;
  resourceId: string;
}

interface TrackerContextType {
  isTracking: boolean;
  trackingId: string | null;
  resourceId: string | null;
  status: TrackerStatus | null;
  statusMessage: string;
  isFinished: boolean;
  hasError: boolean;
  startTracking: () => Promise<void>;
  stopTracking: () => void;
}

const TrackerContext = createContext<TrackerContextType | undefined>(undefined);

const STATUS_MESSAGES: Record<TrackerStatus, string> = {
  STARTING: "Starting generation...",
  SEARCHING_INFORMATION: "Searching for information...",
  PROCESSING_INFORMATION: "Processing information...",
  DONE: "Resume ready!",
  ERROR: "Generation failed",
};

export function TrackerProvider({ children }: { children: React.ReactNode }) {
  const [isTracking, setIsTracking] = useState(false);
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [resourceId, setResourceId] = useState<string | null>(null);
  const [status, setStatus] = useState<TrackerStatus | null>(null);
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
        const data = await response.json();
        accessToken = data?.accessToken;
      } else {
        console.error("Refresh failed with status:", response.status);
      }
    } catch (error) {
      console.error("Failed to refresh access token:", error);
    }

    const wsUrl = accessToken
      ? `ws://localhost:8081/api/v1/core/ws/tracker?token=${accessToken}`
      : "ws://localhost:8081/api/v1/core/ws/tracker";

    console.log("Token found:", accessToken ? "yes" : "no");
    console.log("WS URL:", wsUrl);

    const socket = new WebSocket(wsUrl);
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

  const statusMessage = status ? STATUS_MESSAGES[status] : "Connecting...";

  return (
    <TrackerContext.Provider
      value={{
        isTracking,
        trackingId,
        resourceId,
        status,
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
