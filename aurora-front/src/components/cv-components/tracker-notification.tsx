"use client";

import { motion, AnimatePresence } from "framer-motion";
import { IoSync, IoClose, IoCheckmark, IoAlertCircle } from "react-icons/io5";
import { useTracker, TYPE_LABELS } from "@/context/tracker-context";
import { useRouter } from "next/navigation";

export default function TrackerNotification() {
  const {
    isTracking,
    status,
    trackerType,
    trackingId,
    statusMessage,
    isFinished,
    hasError,
    resourceId,
    stopTracking,
  } = useTracker();
  const router = useRouter();

  const handleFinish = () => {
    if (isFinished) {
      if (trackerType === "AUTOGENERATION" && trackingId) {
        // For auto-generation, redirect to create page with tracking ID
        // Store trackingId in sessionStorage for the create page to fetch data
        sessionStorage.setItem("autoGenerationTrackingId", trackingId);
        router.push("/cv/create?autogen=true");
      } else if (resourceId) {
        // For translation/enhancement, redirect to edit the CV with the new resourceId
        router.push(`/cv/create?id=${resourceId}`);
      } else {
        // Fallback: redirect to CV list page
        router.push("/cv");
      }
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

  const typeLabel = trackerType ? TYPE_LABELS[trackerType] : "";

  return (
    <AnimatePresence>
      {isTracking && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className={`fixed bottom-4 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-2xl z-[9999] flex items-center gap-3 sm:gap-4 text-white sm:min-w-[300px] max-w-full sm:max-w-md transition-colors duration-500 ${getStepColor()} ${isFinished ? "cursor-pointer active:scale-95" : ""}`}
          onClick={isFinished ? handleFinish : undefined}
        >
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[10px] sm:text-xs font-medium opacity-80 uppercase truncate">
              {isFinished
                ? "Click to complete"
                : typeLabel
                  ? `${typeLabel} • Step ${getStepNumber()} of 4`
                  : `Step ${getStepNumber()} of 4`}
            </span>
            <span className="text-xs sm:text-sm font-bold truncate">{statusMessage}</span>
          </div>
          {hasError ? (
            <IoAlertCircle className="text-xl sm:text-2xl flex-shrink-0" />
          ) : isFinished ? (
            <IoCheckmark className="text-xl sm:text-2xl flex-shrink-0" />
          ) : (
            <IoSync className="text-xl sm:text-2xl animate-spin flex-shrink-0" />
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              stopTracking();
            }}
            className="ml-1 sm:ml-2 opacity-50 hover:opacity-100 active:scale-90 transition-all flex-shrink-0"
          >
            <IoClose size={18} className="sm:w-5 sm:h-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
