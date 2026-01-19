"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/button";
import { AutoGenerateModal } from "./auto-generate-modal";
import { motion } from "framer-motion";

export function CvEmptyState() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div
        className="flex flex-col items-center text-center md:w-1/2 space-y-6 mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
          Create Your{" "}
          <span className="whitespace-nowrap bg-clip-text text-transparent bg-linear-to-r from-aurora-blue-dark via-aurora-green-dark to-aurora-blue-dark">
            First Resume
          </span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-text-dark/80 max-w-prose leading-relaxed">
          Create your first professional resume with AuroraResume.
        </p>
        <div className="flex flex-col gap-4 mt-6 w-full max-w-xs">
          <Link
            href="/cv/create"
            className="flex flex-row items-center justify-center rounded-xl w-full px-6 py-3 bg-aurora-blue-dark text-white hover:scale-105 active:scale-95 transform transition-all duration-200 font-semibold shadow-xl text-lg"
          >
            Create on your own
          </Link>
          <Button
            text="Autogenerate with socials"
            onClick={() => setIsModalOpen(true)}
            className="w-full px-6 py-3 bg-transparent border-2 border-aurora-green-dark text-text-dark hover:bg-aurora-green-dark hover:text-white hover:scale-105 transition-all duration-200 font-semibold rounded-lg text-lg"
          />
        </div>
      </motion.div>
      <AutoGenerateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
