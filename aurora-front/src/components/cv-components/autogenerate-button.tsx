"use client";

import { useState } from "react";
import { AutoGenerateModal } from "./auto-generate-modal";

interface AutogenerateButtonProps {
  className?: string;
}

export function AutogenerateButton({ className }: AutogenerateButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={className}
      >
        Autogenerate with socials
      </button>
      <AutoGenerateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
