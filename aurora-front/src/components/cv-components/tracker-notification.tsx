"use client";

import { motion, AnimatePresence } from "framer-motion";
import { IoSync, IoClose, IoCheckmark, IoAlertCircle } from "react-icons/io5";
import { useTracker } from "@/context/tracker-context";
import { useRouter } from "next/navigation";

type TrackerType = "AUTOGENERATION" | "TRANSLATION" | "ENHANCEMENT";

export default function TrackerNotification() {
  const {
    isTracking,
    status,
    statusMessage,
    isFinished,
    hasError,
    resourceId,
    stopTracking,
    type,
  } = useTracker();
  const router = useRouter();

  const handleFinish = () => {
    stopTracking();
    if (isFinished && resourceId && type) {
      const routeByType: Record<TrackerType, string | null> = {
        AUTOGENERATION: null,
        TRANSLATION: `/cv/create?id=${resourceId}`,
        ENHANCEMENT: `/cv/create?id=${resourceId}`,
      };
      const target = routeByType[type];
      if (target) {
        router.push(target);
        return;
      }
    }
    router.refresh();
  };

  if (!isTracking) return null;

  const getStepColor = () => {
    if (hasError) return "bg-red-600";
    if (isFinished) return "bg-aurora-green-dark";
    const colorByStatus: Record<string, string> = {
      STARTING: "bg-aurora-blue-dark",
      SEARCHING_INFORMATION: "bg-aurora-purple-dark",
      PROCESSING_INFORMATION: "bg-aurora-green-dark",
      TRANSLATION_IN_PROGRESS: "bg-aurora-blue-dark",
      DONE: "bg-aurora-green-dark",
      FAILED: "bg-red-600",
    };
    return colorByStatus[status ?? "STARTING"] || "bg-aurora-blue-dark";
  };

  const getStepNumber = () => {
    const stepByStatus: Record<string, number> = {
      STARTING: 1,
      SEARCHING_INFORMATION: 2,
      PROCESSING_INFORMATION: 3,
      TRANSLATION_IN_PROGRESS: 2,
      DONE: 4,
      FAILED: 4,
    };
    return stepByStatus[status ?? "STARTING"] || 1;
  };

  const typeLabel = () => {
    const labelByType: Record<TrackerType, string> = {
      AUTOGENERATION: "Auto-generation",
      TRANSLATION: "Translation",
      ENHANCEMENT: "Enhancement",
    };
    return type ? labelByType[type] : "Background task";
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
                ? hasError
                  ? `${typeLabel()} failed`
                  : `${typeLabel()} complete`
                : `${typeLabel()} · Step ${getStepNumber()} of 4`}
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
