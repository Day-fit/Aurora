"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoSync, IoCloudDownload, IoClose } from "react-icons/io5";
import { useTracker } from "@/context/tracker-context";

export default function TrackerNotification() {
  const { isTracking, stopTracking } = useTracker();
  const [status, setStatus] = useState<string>("Initializing...");
  const [step, setStep] = useState<number>(1);
  const [isFinished, setIsFinished] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!isTracking) return;

    const socket = new WebSocket("ws://localhost:8081/api/v1/core/ws/tracker");

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setStatus(data.status || "Processing...");
        setStep(data.step || 1);
        if (data.finished) {
          setIsFinished(true);
          setDownloadUrl(data.downloadUrl); // Assuming backend sends the link
        }
      } catch (e) {
        setStatus(event.data);
      }
    };

    return () => socket.close();
  }, [isTracking]);

  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, "_blank");
      stopTracking(); // Close after download
    }
  };

  if (!isTracking) return null;

  // ... existing getStepColor and return statement ...
  // Inside the return, wrap the content in a button or add a download link:
  return (
    <AnimatePresence>
      {isTracking && (
        <motion.div
          // ... existing motion props ...
          className={`fixed bottom-6 right-6 p-4 rounded-2xl shadow-2xl z-50 flex items-center gap-4 text-white min-w-[300px] transition-colors duration-500 ${isFinished ? "bg-aurora-green-dark cursor-pointer" : "bg-aurora-blue-dark"}`}
          onClick={isFinished ? handleDownload : undefined}
        >
          {/* ... existing content ... */}
          <div className="flex flex-col flex-1">
            <span className="text-xs font-medium opacity-80 uppercase">
              {isFinished ? "Click to Download" : `Step ${step} of 3`}
            </span>
            <span className="text-sm font-bold">{status}</span>
          </div>
          {isFinished ? (
            <IoCloudDownload className="text-2xl animate-bounce" />
          ) : (
            <IoSync className="text-2xl animate-spin" />
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              stopTracking();
            }}
            className="ml-2 opacity-50 hover:opacity-100"
          >
            <IoClose size={20} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
