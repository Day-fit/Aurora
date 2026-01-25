// aurora-front/src/components/cv-components/delete-modal.tsx
"use client";

import { useState } from "react";
import deleteResume from "@/lib/backend/delete-resume";
import { Modal, ModalButtons } from "@/components/modal";
import { FaExclamationTriangle } from "react-icons/fa";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvId: string;
  cvTitle: string;
  onDeleted?: () => void;
}

export function DeleteModal({
  isOpen,
  onClose,
  cvId,
  cvTitle,
  onDeleted,
}: DeleteModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { status } = await deleteResume(cvId);
      if (status !== 200 && status !== 204) {
        throw new Error("Failed to delete resume");
      }

      onClose();
      onDeleted?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Resume"
      error={error}
      footer={
        <ModalButtons
          onCancel={onClose}
          onSubmit={handleDelete}
          isLoading={isLoading}
          submitText="Delete"
          loadingText="Deleting..."
          type="button"
        />
      }
    >
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
          <FaExclamationTriangle className="w-8 h-8 text-red-400" />
        </div>
        <p className="text-text-dark/80 mb-2">
          Are you sure you want to delete{" "}
          <span className="font-bold text-text-dark">
            {cvTitle || "this resume"}
          </span>
          ?
        </p>
        <p className="text-sm text-text-dark/60">
          This action cannot be undone.
        </p>
      </div>
    </Modal>
  );
}
