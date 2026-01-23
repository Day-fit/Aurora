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
  FaTrash,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { base64ToDataUrl } from "@/lib/utils/image";
import { AutoGenerateModal } from "./auto-generate-modal";
import { TranslateModal } from "./translate-modal";
import { DeleteModal } from "./delete-modal";
import { getResumePdf } from "@/lib/backend/get-resume-pdf";
import {
  LanguageType,
  LANGUAGE_LABELS,
  LANGUAGE_FLAGS,
} from "@/lib/types/language";

interface CvCardProps {
  id: string;
  data: {
    title: string;
    name: string;
    surname: string;
    previewImage?: string | File[] | null;
    language?: LanguageType | null;
  };
}

export function CvCard({ id, data }: CvCardProps) {
  const { title, name, surname, previewImage, language } = data;
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [isEnhanceModalOpen, setIsEnhanceModalOpen] = useState(false);
  const [isTranslateModalOpen, setIsTranslateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (Array.isArray(previewImage) && previewImage[0] instanceof File) {
      const url = URL.createObjectURL(previewImage[0]);
      setBlobUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setBlobUrl(null);
    }
  }, [previewImage]);

  const imageUrl = isMounted
    ? blobUrl ||
      (typeof previewImage === "string" ? base64ToDataUrl(previewImage) : null)
    : null;

  const handleDownload = async () => {
    setIsDownloading(true);
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
      }
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <div className="group bg-main-dark/90 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full">
        <div className="relative h-48 bg-white/5 flex items-center justify-center overflow-hidden border-b border-white/5">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`${name} ${surname}`}
              className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
            />
          ) : (
            <div className="flex flex-col items-center text-text-dark/20">
              <FaFileAlt className="w-12 h-12 mb-3" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                No Preview
              </span>
            </div>
          )}
          <div className="absolute top-4 right-4 p-2 bg-main-dark/60 backdrop-blur-md rounded-full border border-white/10 text-aurora-blue-dark">
            <FaUserCircle className="w-4 h-4" />
          </div>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="absolute top-4 left-4 p-2 bg-main-dark/60 backdrop-blur-md rounded-full border border-white/10 text-red-400 hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-200 opacity-0 group-hover:opacity-100"
            title="Delete resume"
            aria-label="Delete resume"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 grow flex flex-col">
          <h3 className="font-extrabold text-text-dark truncate text-xl leading-tight mb-1 group-hover:text-aurora-green-dark transition-colors">
            {title || "Untitled Resume"}
          </h3>
          <p className="text-sm font-medium text-text-dark/60 mb-2 uppercase tracking-wider">
            {name} {surname}
          </p>
          {language &&
            (() => {
              const flag = LANGUAGE_FLAGS[language];
              return (
                <div className="flex items-center gap-1.5 mb-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-aurora-blue-dark/20 border border-aurora-blue-dark/30 rounded-full text-xs font-medium text-aurora-blue-dark">
                    {flag && <span>{flag}</span>}
                    {LANGUAGE_LABELS[language] || language}
                  </span>
                </div>
              );
            })()}
          {!language && <div className="mb-4" />}

          <div className="mt-auto flex flex-col gap-2">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href={{ pathname: "/cv/create", query: { id } }}
                className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-linear-to-r from-aurora-blue-dark to-aurora-blue-dark/80 hover:from-aurora-green-dark hover:to-aurora-green-dark/80 text-white text-sm font-bold rounded-lg transition-all duration-300 shadow-lg"
              >
                <FaEdit className="w-4 h-4" />
                EDIT RESUME
              </Link>
            </motion.div>
            <motion.button
              onClick={() => setIsEnhanceModalOpen(true)}
              className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-linear-to-r from-aurora-green-dark to-aurora-green-dark/80 hover:from-aurora-blue-dark hover:to-aurora-blue-dark/80 text-white text-sm font-bold rounded-lg transition-all duration-300 shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaMagic className="w-4 h-4" />
              ENHANCE CV
            </motion.button>
            <div className="flex gap-2">
              <motion.button
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex items-center justify-center gap-2 flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 text-text-dark text-sm font-bold rounded-lg transition-all duration-300 disabled:opacity-50"
                whileHover={{ scale: isDownloading ? 1 : 1.02 }}
                whileTap={{ scale: isDownloading ? 1 : 0.98 }}
              >
                <FaDownload className="w-4 h-4" />
                {isDownloading ? "..." : "PDF"}
              </motion.button>
              <motion.button
                onClick={() => setIsTranslateModalOpen(true)}
                className="flex items-center justify-center gap-2 flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 text-text-dark text-sm font-bold rounded-lg transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaLanguage className="w-4 h-4" />
                TRANSLATE
              </motion.button>
            </div>
          </div>
        </div>
      </div>
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
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        cvId={id}
        cvTitle={title}
      />
    </>
  );
}
