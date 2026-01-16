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
  | "TRANSLATION_IN_PROGRESS"
  | "DONE"
  | "FAILED";

type TrackerType = "AUTOGENERATION" | "TRANSLATION" | "ENHANCEMENT";

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
  statusMessage: string;
  isFinished: boolean;
  hasError: boolean;
  type: TrackerType | null;
  startTracking: () => void;
  stopTracking: () => void;
}

const TrackerContext = createContext<TrackerContextType | undefined>(undefined);

const STATUS_MESSAGES: Record<TrackerStatus, string> = {
  STARTING: "Starting...",
  SEARCHING_INFORMATION: "Collecting data...",
  PROCESSING_INFORMATION: "Processing data...",
  TRANSLATION_IN_PROGRESS: "Translating content...",
  DONE: "Task complete!",
  FAILED: "Task failed",
};

export function TrackerProvider({ children }: { children: React.ReactNode }) {
  const [isTracking, setIsTracking] = useState(false);
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [resourceId, setResourceId] = useState<string | null>(null);
  const [status, setStatus] = useState<TrackerStatus | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [type, setType] = useState<TrackerType | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const buildWebsocketUrl = () => {
    const rawBase =
      process.env.NEXT_PUBLIC_BACKEND_CORE_URL ||
      (typeof window !== "undefined"
        ? `${window.location.origin}/api/v1/core`
        : "");
    if (!rawBase) {
      return "ws://localhost:8081/api/v1/core/ws/tracker";
    }

    const trimmedBase = rawBase.replace(/\/$/, "");

    if (trimmedBase.startsWith("ws")) {
      return `${trimmedBase}/ws/tracker`;
    }

    const isHttps = trimmedBase.startsWith("https");
    const withoutProtocol = trimmedBase.replace(/^https?:\/\//, "");
    return `${isHttps ? "wss" : "ws"}://${withoutProtocol}/ws/tracker`;
  };

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
    setType(null);
  }, []);

  const startTracking = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
    }

    setIsTracking(true);
    setIsFinished(false);
    setHasError(false);
    setStatus("STARTING");
    setType(null);

    try {
      const wsUrl = buildWebsocketUrl();
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
          setType(data.type);

          if (data.status === "DONE") {
            setIsFinished(true);
          } else if (data.status === "FAILED") {
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
    } catch (err) {
      console.error("Unable to open tracker websocket:", err);
      setHasError(true);
      setIsTracking(false);
    }
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
        type,
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
