"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";

export default function FormSection({
  title,
  children,
  hasErrors = false,
}: {
  title: string;
  children: React.ReactNode;
  hasErrors?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const isFirstRenderRef = useRef(true);
  const isMountedRef = useRef(true);

  // Auto-expand section when errors appear (transition from no errors to errors)
  useEffect(() => {
    // Track mounted state for cleanup
    isMountedRef.current = true;

    // Skip the first render to avoid expanding all sections on initial load
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    // Only expand when hasErrors becomes true (and section is not already open)
    if (hasErrors) {
      // Use setTimeout to schedule the state update outside of React's render cycle
      // This avoids the flushSync warning while still providing immediate feedback
      timeoutId = setTimeout(() => {
        if (isMountedRef.current) {
          setOpen(true);
        }
      }, 0);
    }

    // Cleanup function to prevent memory leaks and state updates on unmounted components
    return () => {
      isMountedRef.current = false;
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, [hasErrors]);

  return (
    <div
      className={`w-full border rounded-xl bg-main-dark/50 transition-colors duration-200 hover:border-white/20 ${
        hasErrors
          ? "border-red-500/50 shadow-[0_0_8px_rgba(239,68,68,0.15)]"
          : "border-white/10"
      }`}
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-3 sm:px-4 py-2.5 sm:py-3 text-left text-text-dark/90 font-semibold hover:bg-white/5 active:bg-white/10 rounded-t-xl transition-colors text-sm sm:text-base"
      >
        <span className="flex items-center gap-2">
          {title}
          {hasErrors && (
            <FiAlertCircle className="text-red-500 text-base animate-pulse" />
          )}
        </span>

        <motion.span
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className={hasErrors ? "text-red-500" : "text-aurora-blue-dark"}
        >
          ▶
        </motion.span>
      </button>

      {/* Collapsible content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden px-3 sm:px-4 pb-3 sm:pb-4"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
