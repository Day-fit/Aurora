"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { AutoGenerateModal } from "./auto-generate-modal";

export function CvHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full border-b border-white/5 pb-8 gap-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-3xl font-extrabold leading-tight tracking-tighter">
          Your{" "}
          <span className="bg-clip-text text-transparent bg-linear-to-r from-aurora-blue-dark via-aurora-green-dark to-aurora-blue-dark">
            CVs
          </span>
        </h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link
            href="/cv/create"
            className="group flex items-center justify-center gap-2 px-6 py-3 bg-aurora-blue-dark text-white hover:bg-aurora-blue-dark/80 transform transition-all duration-200 font-semibold shadow-xl rounded-lg text-lg active:scale-95"
          >
            <motion.span 
              className="transition-transform"
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              +
            </motion.span>
            Create New CV
          </Link>
          <motion.button
            onClick={() => setIsModalOpen(true)}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-aurora-green-dark text-white hover:bg-aurora-green-dark/80 transform transition-all duration-200 font-semibold shadow-xl rounded-lg text-lg text-center"
          >
            Auto-Generate
          </motion.button>
        </div>
      </header>
      <AutoGenerateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
