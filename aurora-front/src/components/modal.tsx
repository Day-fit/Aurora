"use client";

import { FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  error?: string | null;
  footer?: React.ReactNode;
}

interface ModalButtonsProps {
  onCancel: () => void;
  onSubmit?: () => void;
  isLoading?: boolean;
  cancelText?: string;
  submitText?: string;
  loadingText?: string;
  type?: "button" | "submit";
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  error,
  footer,
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="bg-main-dark border border-white/10 rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-extrabold text-text-dark">{title}</h2>
              <motion.button
                onClick={onClose}
                className="text-text-dark/60 hover:text-text-dark transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTimes className="w-5 h-5" />
              </motion.button>
            </div>

            {error && (
              <motion.div
                className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {error}
              </motion.div>
            )}

            {children}

            {footer && <div className="flex gap-3">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ModalButtons({
  onCancel,
  onSubmit,
  isLoading = false,
  cancelText = "Cancel",
  submitText = "Submit",
  loadingText = "Processing...",
  type = "submit",
}: ModalButtonsProps) {
  return (
    <>
      <motion.button
        type="button"
        onClick={onCancel}
        className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-text-dark font-semibold rounded-lg transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {cancelText}
      </motion.button>
      <motion.button
        type={type}
        onClick={type === "button" ? onSubmit : undefined}
        disabled={isLoading}
        className="flex-1 px-4 py-3 bg-aurora-green-dark hover:bg-aurora-green-dark/80 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors relative overflow-hidden"
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-center gap-2"
            >
              <motion.span
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                role="status"
                aria-label="Loading"
              />
              {loadingText}
            </motion.span>
          ) : (
            <motion.span
              key="submit"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {submitText}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
