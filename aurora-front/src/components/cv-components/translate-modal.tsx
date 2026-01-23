// aurora-front/src/components/cv-components/translate-modal.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import translateResume, {
  TranslateLanguage,
} from "@/lib/backend/translate-resume";
import { useTracker } from "@/context/tracker-context";
import { Modal, ModalButtons } from "@/components/modal";

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
  const [selectedLanguage, setSelectedLanguage] =
    useState<TranslateLanguage>("ENGLISH");
  const router = useRouter();
  const { startTracking } = useTracker();

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { status } = await translateResume(cvId, selectedLanguage);
      if (status !== 200 && status !== 201) {
        throw new Error("Failed to translate resume");
      }

      // Start tracking the translation via WebSocket
      await startTracking();
      onClose();
      router.refresh();
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
      title="Translate Resume"
      error={error}
      footer={
        <ModalButtons
          onCancel={onClose}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitText="Translate"
          loadingText="Translating..."
          type="button"
        />
      }
    >
      <div className="mb-6">
        <label className="block text-sm font-medium text-text-dark/80 mb-2">
          Target Language
        </label>
        <select
          value={selectedLanguage}
          onChange={(e) =>
            setSelectedLanguage(e.target.value as TranslateLanguage)
          }
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-text-dark focus:outline-none focus:border-aurora-green-dark"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
    </Modal>
  );
}
