"use client";

import { motion, AnimatePresence } from "framer-motion";
import { IoSync, IoClose, IoCheckmark, IoAlertCircle } from "react-icons/io5";
import { useTracker } from "@/context/tracker-context";
import { useRouter } from "next/navigation";

export default function TrackerNotification() {
  const {
    isTracking,
    status,
    statusMessage,
    isFinished,
    hasError,
    resourceId,
    stopTracking,
  } = useTracker();
  const router = useRouter();

  const handleFinish = () => {
    if (isFinished && resourceId) {
      router.push(`/dashboard/cv/${resourceId}`);
    }
    stopTracking();
    router.refresh();
  };

  if (!isTracking) return null;

  const getStepColor = () => {
    if (hasError) return "bg-red-600";
    if (isFinished) return "bg-aurora-green-dark";
    if (status === "STARTING") return "bg-aurora-blue-dark";
    if (status === "SEARCHING_INFORMATION") return "bg-aurora-purple-dark";
    return "bg-aurora-green-dark";
  };

  const getStepNumber = () => {
    switch (status) {
      case "STARTING":
        return 1;
      case "SEARCHING_INFORMATION":
        return 2;
      case "PROCESSING_INFORMATION":
        return 3;
      case "DONE":
        return 4;
      default:
        return 1;
    }
  };

  return (
    <AnimatePresence>
      {isTracking && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className={`fixed bottom-6 right-6 p-4 rounded-2xl shadow-2xl z-[9999] flex items-center gap-4 text-white min-w-[300px] transition-colors duration-500 ${getStepColor()} ${isFinished ? "cursor-pointer" : ""}`}
          onClick={isFinished ? handleFinish : undefined}
        >
          <div className="flex flex-col flex-1">
            <span className="text-xs font-medium opacity-80 uppercase">
              {isFinished
                ? "Click to complete"
                : `Step ${getStepNumber()} of 4`}
            </span>
            <span className="text-sm font-bold">{statusMessage}</span>
          </div>
          {hasError ? (
            <IoAlertCircle className="text-2xl" />
          ) : isFinished ? (
            <IoCheckmark className="text-2xl" />
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
