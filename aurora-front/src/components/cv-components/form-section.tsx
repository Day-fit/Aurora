"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full border border-white/10 rounded-xl bg-main-dark/50 transition-colors duration-200 hover:border-white/20">
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-3 sm:px-4 py-2.5 sm:py-3 text-left text-text-dark/90 font-semibold hover:bg-white/5 active:bg-white/10 rounded-t-xl transition-colors text-sm sm:text-base"
      >
        {title}

        <motion.span
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-aurora-blue-dark"
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
