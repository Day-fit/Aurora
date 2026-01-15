"use client";

import Link from "next/link";
import { FaFileAlt, FaEdit, FaUserCircle, FaMagic } from "react-icons/fa";
import { useState, useEffect } from "react";
import { base64ToDataUrl } from "@/lib/utils/image";
import { AutoGenerateModal } from "./auto-generate-modal";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (Array.isArray(profileImage) && profileImage[0] instanceof File) {
      const url = URL.createObjectURL(profileImage[0]);
      setBlobUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setBlobUrl(null);
    }
  }, [profileImage]);

  const imageUrl =
    blobUrl ||
    (typeof profileImage === "string" ? base64ToDataUrl(profileImage) : null);

  return (
    <>
      <div className="group bg-main-dark/90 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full">
        <div className="relative h-48 bg-white/5 flex items-center justify-center overflow-hidden border-b border-white/5">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`${name} ${surname}`}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
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
        </div>

        <div className="p-6 grow flex flex-col">
          <h3 className="font-extrabold text-text-dark truncate text-xl leading-tight mb-1 group-hover:text-aurora-green-dark transition-colors">
            {title || "Untitled Resume"}
          </h3>
          <p className="text-sm font-medium text-text-dark/60 mb-6 uppercase tracking-wider">
            {name} {surname}
          </p>

          <div className="mt-auto flex flex-col gap-2">
            <Link
              href={{ pathname: "/cv/create", query: { id } }}
              className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-linear-to-r from-aurora-blue-dark to-aurora-blue-dark/80 hover:from-aurora-green-dark hover:to-aurora-green-dark/80 text-white text-sm font-bold rounded-lg transition-all duration-300 shadow-lg active:scale-95"
            >
              <FaEdit className="w-4 h-4" />
              EDIT RESUME
            </Link>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-linear-to-r from-aurora-green-dark to-aurora-green-dark/80 hover:from-aurora-blue-dark hover:to-aurora-blue-dark/80 text-white text-sm font-bold rounded-lg transition-all duration-300 shadow-lg active:scale-95"
            >
              <FaMagic className="w-4 h-4" />
              ENHANCE CV
            </button>
          </div>
        </div>
      </div>
      <AutoGenerateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        cvId={id}
      />
    </>
  );
}
