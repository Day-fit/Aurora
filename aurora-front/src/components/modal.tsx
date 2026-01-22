"use client";

import { FaTimes } from "react-icons/fa";
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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-main-dark border border-white/10 rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold text-text-dark">{title}</h2>
          <button
            onClick={onClose}
            className="text-text-dark/60 hover:text-text-dark transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {children}

        {footer && <div className="flex gap-3">{footer}</div>}
      </div>
    </div>
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
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-text-dark font-semibold rounded-lg transition-colors"
      >
        {cancelText}
      </button>
      <button
        type={type}
        onClick={type === "button" ? onSubmit : undefined}
        disabled={isLoading}
        className="flex-1 px-4 py-3 bg-aurora-green-dark hover:bg-aurora-green-dark/80 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
      >
        {isLoading ? loadingText : submitText}
      </button>
    </>
  );
}
