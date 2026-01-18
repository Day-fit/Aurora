// aurora-front/src/components/cv-components/auto-generate-modal.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaTimes } from "react-icons/fa";
import resumeAutogeneration from "@/lib/backend/resume-autogenertion";
import enhanceResume from "@/lib/backend/enhance-resume";
import { useTracker } from "@/context/tracker-context";
import { LanguageType, LANGUAGE_LABELS } from "@/lib/types/language";

interface AutoGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvId?: string;
}

interface AutoGenerateFormValues {
  source: "GITHUB" | "LINKEDIN";
  name: string;
  title: string;
  language: LanguageType;
}

// Common languages for auto-generation (subset of all supported languages)
const AUTOGEN_LANGUAGES: { code: LanguageType; name: string }[] = [
  { code: "ENGLISH", name: LANGUAGE_LABELS.ENGLISH },
  { code: "POLISH", name: LANGUAGE_LABELS.POLISH },
  { code: "GERMAN", name: LANGUAGE_LABELS.GERMAN },
  { code: "FRENCH", name: LANGUAGE_LABELS.FRENCH },
  { code: "SPANISH", name: LANGUAGE_LABELS.SPANISH },
  { code: "ITALIAN", name: LANGUAGE_LABELS.ITALIAN },
  { code: "PORTUGUESE", name: LANGUAGE_LABELS.PORTUGUESE },
  { code: "DUTCH", name: LANGUAGE_LABELS.DUTCH },
  { code: "RUSSIAN", name: LANGUAGE_LABELS.RUSSIAN },
  { code: "CHINESE", name: LANGUAGE_LABELS.CHINESE },
  { code: "JAPANESE", name: LANGUAGE_LABELS.JAPANESE },
  { code: "KOREAN", name: LANGUAGE_LABELS.KOREAN },
  { code: "ARABIC", name: LANGUAGE_LABELS.ARABIC },
  { code: "HINDI", name: LANGUAGE_LABELS.HINDI },
  { code: "TURKISH", name: LANGUAGE_LABELS.TURKISH },
  { code: "SWEDISH", name: LANGUAGE_LABELS.SWEDISH },
  { code: "NORWEGIAN", name: LANGUAGE_LABELS.NORWEGIAN },
  { code: "DANISH", name: LANGUAGE_LABELS.DANISH },
  { code: "FINNISH", name: LANGUAGE_LABELS.FINNISH },
  { code: "CZECH", name: LANGUAGE_LABELS.CZECH },
  { code: "UKRAINIAN", name: LANGUAGE_LABELS.UKRAINIAN },
];

export function AutoGenerateModal({
  isOpen,
  onClose,
  cvId,
}: AutoGenerateModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { startTracking } = useTracker();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AutoGenerateFormValues>({
    defaultValues: {
      source: "GITHUB",
      name: "",
      title: "",
      language: "ENGLISH",
    },
  });

  const onSubmit = async (data: AutoGenerateFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      if (cvId) {
        const { status } = await enhanceResume(cvId);
        if (status !== 200 && status !== 201) {
          throw new Error("Failed to enhance resume");
        }
      } else {
        const { status } = await resumeAutogeneration(data);
        if (status !== 200 && status !== 201) {
          throw new Error("Failed to auto-generate resume");
        }
      }
      // Start tracking the operation via WebSocket
      await startTracking();
      reset();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-main-dark border border-white/10 rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold text-text-dark">
            {cvId ? "Enhance Resume" : "Auto-Generate Resume"}
          </h2>
          <button
            onClick={handleClose}
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

        <form onSubmit={handleSubmit(onSubmit)}>
          {cvId ? (
            <p className="text-text-dark/80 mb-6">
              Enhance your existing resume with AI-powered suggestions.
            </p>
          ) : (
            <div className="space-y-4 mb-6">
              <p className="text-text-dark/80">
                Create a new resume by auto-generating content from your social
                profiles.
              </p>
              <div>
                <label className="block text-sm font-medium text-text-dark/80 mb-2">
                  Source
                </label>
                <select
                  {...register("source", { required: "Source is required" })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-text-dark focus:outline-none focus:border-aurora-green-dark"
                >
                  <option value="GITHUB">GitHub</option>
                  <option value="LINKEDIN">LinkedIn</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dark/80 mb-2">
                  Username / Profile Name
                </label>
                <input
                  type="text"
                  {...register("name", { required: "Username is required" })}
                  placeholder="e.g., day-fit"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-text-dark placeholder-text-dark/40 focus:outline-none focus:border-aurora-green-dark"
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dark/80 mb-2">
                  Desired Job Title
                </label>
                <input
                  type="text"
                  {...register("title", { required: "Job title is required" })}
                  placeholder="e.g., Java&Kotlin Backend Developer"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-text-dark placeholder-text-dark/40 focus:outline-none focus:border-aurora-green-dark"
                />
                {errors.title && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dark/80 mb-2">
                  Resume Language
                </label>
                <select
                  {...register("language", { required: "Language is required" })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-text-dark focus:outline-none focus:border-aurora-green-dark"
                >
                  {AUTOGEN_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
                {errors.language && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.language.message}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-text-dark font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-aurora-green-dark hover:bg-aurora-green-dark/80 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
            >
              {isLoading ? "Generating..." : cvId ? "Enhance" : "Generate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
