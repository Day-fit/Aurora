"use client";

import Link from "next/link";
import { useState } from "react";
import { AutoGenerateModal } from "./auto-generate-modal";
import { motion } from "framer-motion";

export function CvHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.header
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full border-b border-white/5 pb-6 sm:pb-8 gap-4 sm:gap-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-3xl font-extrabold leading-tight tracking-tighter">
          Your{" "}
          <span className="bg-clip-text text-transparent bg-linear-to-r from-aurora-blue-dark via-aurora-green-dark to-aurora-blue-dark">
            CVs
          </span>
        </h1>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/cv/create"
              className="group flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-aurora-blue-dark text-white transform transition-all duration-200 font-semibold shadow-xl rounded-lg text-sm sm:text-lg"
            >
              <motion.span
                className="transition-transform"
                animate={{ rotate: 0 }}
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                +
              </motion.span>
              Create New CV
            </Link>
          </motion.div>
          <motion.button
            onClick={() => setIsModalOpen(true)}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-aurora-green-dark text-white hover:bg-aurora-green-dark/80 transform transition-all duration-200 font-semibold shadow-xl rounded-lg text-sm sm:text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Auto-Generate
          </motion.button>
        </div>
      </motion.header>
      <AutoGenerateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
