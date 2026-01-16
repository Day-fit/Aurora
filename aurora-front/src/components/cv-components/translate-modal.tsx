// aurora-front/src/components/cv-components/translate-modal.tsx
"use client";

import { useState } from "react";
import { FaTimes, FaSpinner } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import translateResume, {
  TranslateLanguage,
} from "@/lib/backend/translate-resume";

interface TranslateModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvId: string;
}

const LANGUAGES: { code: TranslateLanguage; name: string }[] = [
  { code: "ENGLISH", name: "English" },
  { code: "POLISH", name: "Polish" },
  { code: "GERMAN", name: "German" },
  { code: "FRENCH", name: "French" },
  { code: "SPANISH", name: "Spanish" },
  { code: "ITALIAN", name: "Italian" },
  { code: "PORTUGUESE", name: "Portuguese" },
  { code: "DUTCH", name: "Dutch" },
  { code: "RUSSIAN", name: "Russian" },
  { code: "CHINESE", name: "Chinese" },
  { code: "JAPANESE", name: "Japanese" },
  { code: "KOREAN", name: "Korean" },
  { code: "ARABIC", name: "Arabic" },
  { code: "HINDI", name: "Hindi" },
  { code: "TURKISH", name: "Turkish" },
  { code: "SWEDISH", name: "Swedish" },
  { code: "NORWEGIAN", name: "Norwegian" },
  { code: "DANISH", name: "Danish" },
  { code: "FINNISH", name: "Finnish" },
  { code: "CZECH", name: "Czech" },
  { code: "UKRAINIAN", name: "Ukrainian" },
];

export function TranslateModal({ isOpen, onClose, cvId }: TranslateModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedLanguage, setSelectedLanguage] =
    useState<TranslateLanguage>("ENGLISH");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { status } = await translateResume(cvId, selectedLanguage);
      if (status !== 200 && status !== 201) {
        throw new Error("Failed to translate resume");
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        router.refresh();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-main-dark border border-white/10 rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold text-text-dark">
              Translate Resume
            </h2>
            <button
              onClick={handleClose}
              className="text-text-dark/60 hover:text-text-dark transition-colors hover:rotate-90 transform duration-200"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-sm"
            >
              Resume translated successfully!
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-text-dark/80 mb-2">
                Target Language
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) =>
                  setSelectedLanguage(e.target.value as TranslateLanguage)
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-text-dark focus:outline-none focus:border-aurora-green-dark transition-colors"
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
                onClick={handleClose}
                className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-text-dark font-semibold rounded-lg transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || success}
                className="flex-1 px-4 py-3 bg-aurora-green-dark hover:bg-aurora-green-dark/80 disabled:opacity-50 text-white font-semibold rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Translating...
                  </>
                ) : success ? (
                  "Done!"
                ) : (
                  "Translate"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
