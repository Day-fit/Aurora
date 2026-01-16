// aurora-front/src/components/cv-components/auto-generate-modal.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaTimes, FaSpinner } from "react-icons/fa";
import { useRouter } from "next/navigation";
import resumeAutogeneration from "@/lib/backend/resume-autogenertion";
import enhanceResume from "@/lib/backend/enhance-resume";
import { useTracker } from "@/context/tracker-context";
import { motion, AnimatePresence } from "framer-motion";

interface AutoGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvId?: string;
}

interface AutoGenerateFormValues {
  source: "GITHUB" | "LINKEDIN";
  name: string;
  title: string;
}

export function AutoGenerateModal({
  isOpen,
  onClose,
  cvId,
}: AutoGenerateModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { startTracking } = useTracker();
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

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
    },
  });

  const onSubmit = async (data: AutoGenerateFormValues) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    try {
      if (cvId) {
        const { status } = await enhanceResume(cvId);
        if (status !== 200 && status !== 201) {
          throw new Error("Failed to enhance resume");
        }
        setSuccess(true);
        setTimeout(() => {
          if (isMountedRef.current) {
            reset();
            onClose();
            router.refresh();
          }
        }, 1500);
      } else {
        startTracking();
        const { status } = await resumeAutogeneration(data);
        if (status !== 200 && status !== 201) {
          throw new Error("Failed to auto-generate resume");
        }
        reset();
        onClose();
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
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
              {cvId ? "Enhance Resume" : "Auto-Generate Resume"}
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
              Resume enhanced successfully!
            </motion.div>
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
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-text-dark focus:outline-none focus:border-aurora-green-dark transition-colors"
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
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-text-dark placeholder-text-dark/40 focus:outline-none focus:border-aurora-green-dark transition-colors"
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
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-text-dark placeholder-text-dark/40 focus:outline-none focus:border-aurora-green-dark transition-colors"
                  />
                  {errors.title && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>
              </div>
            )}

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
                    {cvId ? "Enhancing..." : "Generating..."}
                  </>
                ) : success ? (
                  "Done!"
                ) : cvId ? (
                  "Enhance"
                ) : (
                  "Generate"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
