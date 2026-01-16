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
  startTracking: () => void;
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

  const startTracking = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
    }

    setIsTracking(true);
    setIsFinished(false);
    setHasError(false);
    setStatus("STARTING");

    // Use environment variable for WebSocket URL
    // Priority: NEXT_PUBLIC_WS_URL > NEXT_PUBLIC_BACKEND_CORE_URL (with ws:// protocol) > same origin
    let wsBaseUrl: string;
    
    if (process.env.NEXT_PUBLIC_WS_URL) {
      wsBaseUrl = process.env.NEXT_PUBLIC_WS_URL;
    } else if (process.env.NEXT_PUBLIC_BACKEND_CORE_URL) {
      wsBaseUrl = process.env.NEXT_PUBLIC_BACKEND_CORE_URL.replace(/^http/, 'ws');
    } else {
      // Fallback to same origin WebSocket
      wsBaseUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`;
    }
    
    // The backend WebSocket endpoint is /api/v1/core/ws/tracker (context-path + endpoint)
    // Cookies will be sent automatically for same-origin or properly configured CORS
    const wsUrl = `${wsBaseUrl}/api/v1/core/ws/tracker`;

    try {
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log("WebSocket connected to tracker");
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
        setStatus("ERROR");
      };

      socket.onclose = (event) => {
        console.log("WebSocket closed:", event.code, event.reason);
        // If closed unexpectedly and not finished, show error
        if (!event.wasClean && status !== "DONE") {
          setHasError(true);
        }
      };
    } catch (err) {
      console.error("Failed to create WebSocket:", err);
      setHasError(true);
      setStatus("ERROR");
    }
  }, [status]);

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
