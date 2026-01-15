// aurora-front/src/components/cv-components/translate-modal.tsx
"use client";

import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";
import translateResume from "@/lib/backend/get-autogenrated-resume";
import { useTracker } from "@/context/tracker-context";

interface TranslateModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvId: string;
}

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "pl", name: "Polish" },
  { code: "de", name: "German" },
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "it", name: "Italian" },
];

export function TranslateModal({ isOpen, onClose, cvId }: TranslateModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const router = useRouter();
  const { startTracking } = useTracker();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { status, data } = await translateResume(cvId);
      if (status !== 200 && status !== 201) {
        throw new Error("Failed to translate resume");
      }
      if (data?.trackingId) {
        startTracking(data.trackingId);
      }
      onClose();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-main-dark border border-white/10 rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold text-text-dark">
            Translate Resume
          </h2>
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

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-dark/80 mb-2">
              Target Language
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-text-dark focus:outline-none focus:border-aurora-green-dark"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-text-dark font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-aurora-green-dark hover:bg-aurora-green-dark/80 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
            >
              {isLoading ? "Translating..." : "Translate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
