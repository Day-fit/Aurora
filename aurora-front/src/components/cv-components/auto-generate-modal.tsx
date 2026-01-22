// aurora-front/src/components/cv-components/auto-generate-modal.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import resumeAutogeneration from "@/lib/backend/resume-autogenertion";
import enhanceResume from "@/lib/backend/enhance-resume";
import { useTracker } from "@/context/tracker-context";
import { LanguageType, LANGUAGE_LABELS, ALL_LANGUAGES } from "@/lib/types/language";
import { Modal, ModalButtons } from "@/components/modal";

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={cvId ? "Enhance Resume" : "Auto-Generate Resume"}
      error={error}
      footer={
        <ModalButtons
          onCancel={handleClose}
          isLoading={isLoading}
          submitText={cvId ? "Enhance" : "Generate"}
          loadingText="Generating..."
        />
      }
    >
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
                {ALL_LANGUAGES.map((lang: LanguageType) => (
                  <option key={lang} value={lang}>
                    {LANGUAGE_LABELS[lang]}
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
      </form>
    </Modal>
  );
}
