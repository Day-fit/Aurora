// aurora-front/src/components/cv-components/cv-card.tsx
"use client";

import Link from "next/link";
import {
  FaFileAlt,
  FaEdit,
  FaUserCircle,
  FaMagic,
  FaDownload,
  FaLanguage,
  FaSpinner,
  FaCheck,
} from "react-icons/fa";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { base64ToDataUrl } from "@/lib/utils/image";
import { AutoGenerateModal } from "./auto-generate-modal";
import { TranslateModal } from "./translate-modal";
import { getResumePdf } from "@/lib/backend/get-resume-pdf";

interface CvCardProps {
  id: string;
  data: {
    title: string;
    name: string;
    surname: string;
    profileImage?: string | File[] | null;
  };
}

export function CvCard({ id, data }: CvCardProps) {
  const { title, name, surname, profileImage } = data;
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [isEnhanceModalOpen, setIsEnhanceModalOpen] = useState(false);
  const [isTranslateModalOpen, setIsTranslateModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (Array.isArray(profileImage) && profileImage[0] instanceof File) {
      const url = URL.createObjectURL(profileImage[0]);
      setBlobUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setBlobUrl(null);
    }
  }, [profileImage]);

  const imageUrl = useMemo(() => {
    if (!isMounted) return null;
    return blobUrl || (typeof profileImage === "string" ? base64ToDataUrl(profileImage) : null);
  }, [isMounted, blobUrl, profileImage]);

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadSuccess(false);
    try {
      const { data: pdfBase64, status } = await getResumePdf(id);
      if (status === 200 && pdfBase64) {
        const byteCharacters = atob(pdfBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${title || "resume"}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 2000);
      }
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -8 }}
        className="group bg-main-dark/90 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-2xl transition-shadow duration-300 hover:shadow-aurora-blue-dark/20 flex flex-col h-full"
      >
        <div className="relative h-48 bg-white/5 flex items-center justify-center overflow-hidden border-b border-white/5">
          {imageUrl ? (
            <motion.img
              src={imageUrl}
              alt={`${name} ${surname}`}
              className="absolute inset-0 w-full h-full object-cover opacity-90"
              whileHover={{ scale: 1.1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          ) : (
            <div className="flex flex-col items-center text-text-dark/20">
              <FaFileAlt className="w-12 h-12 mb-3" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                No Preview
              </span>
            </div>
          )}
          <motion.div 
            className="absolute top-4 right-4 p-2 bg-main-dark/60 backdrop-blur-md rounded-full border border-white/10 text-aurora-blue-dark"
            whileHover={{ scale: 1.1, rotate: 10 }}
          >
            <FaUserCircle className="w-4 h-4" />
          </motion.div>
        </div>

        <div className="p-6 grow flex flex-col">
          <h3 className="font-extrabold text-text-dark truncate text-xl leading-tight mb-1 group-hover:text-aurora-green-dark transition-colors duration-300">
            {title || "Untitled Resume"}
          </h3>
          <p className="text-sm font-medium text-text-dark/60 mb-6 uppercase tracking-wider">
            {name} {surname}
          </p>

          <div className="mt-auto flex flex-col gap-2">
            <Link
              href={{ pathname: "/cv/create", query: { id } }}
              className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-linear-to-r from-aurora-blue-dark to-aurora-blue-dark/80 hover:from-aurora-green-dark hover:to-aurora-green-dark/80 text-white text-sm font-bold rounded-lg transition-all duration-300 shadow-lg active:scale-95 hover:shadow-aurora-blue-dark/30"
            >
              <FaEdit className="w-4 h-4" />
              EDIT RESUME
            </Link>
            <motion.button
              onClick={() => setIsEnhanceModalOpen(true)}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-linear-to-r from-aurora-green-dark to-aurora-green-dark/80 hover:from-aurora-blue-dark hover:to-aurora-blue-dark/80 text-white text-sm font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-aurora-green-dark/30"
            >
              <FaMagic className="w-4 h-4" />
              ENHANCE CV
            </motion.button>
            <div className="flex gap-2">
              <motion.button
                onClick={handleDownload}
                disabled={isDownloading}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center justify-center gap-2 flex-1 py-3 px-4 text-sm font-bold rounded-lg transition-all duration-300 disabled:opacity-50 ${
                  downloadSuccess 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-white/5 hover:bg-white/10 text-text-dark'
                }`}
              >
                {isDownloading ? (
                  <FaSpinner className="w-4 h-4 animate-spin" />
                ) : downloadSuccess ? (
                  <FaCheck className="w-4 h-4" />
                ) : (
                  <FaDownload className="w-4 h-4" />
                )}
                {isDownloading ? "..." : downloadSuccess ? "Done!" : "PDF"}
              </motion.button>
              <motion.button
                onClick={() => setIsTranslateModalOpen(true)}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-2 flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 text-text-dark text-sm font-bold rounded-lg transition-all duration-300"
              >
                <FaLanguage className="w-4 h-4" />
                TRANSLATE
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
      <AutoGenerateModal
        isOpen={isEnhanceModalOpen}
        onClose={() => setIsEnhanceModalOpen(false)}
        cvId={id}
      />
      <TranslateModal
        isOpen={isTranslateModalOpen}
        onClose={() => setIsTranslateModalOpen(false)}
        cvId={id}
      />
    </>
  );
}
