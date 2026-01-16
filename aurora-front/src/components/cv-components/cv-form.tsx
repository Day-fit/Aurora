// aurora-front/src/components/cv-components/cv-form.tsx
"use client";

import Button from "@/components/button";
import { ButtonType } from "@/lib/types/button";
import Skills from "@/components/cv-components/skill";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import Education from "@/components/cv-components/education";
import WorkExperience from "@/components/cv-components/workExperience";
import Achievement from "@/components/cv-components/achievement";
import FormSection from "@/components/cv-components/form-section";
import PersonalInfo from "@/components/cv-components/personal-info";
import ProfileLinks from "@/components/cv-components/profile-links";
import FormStyling from "@/components/cv-components/form-styling";
import PersonalPortfolio from "@/components/cv-components/personal-portfolio";
import { generateResume } from "@/lib/backend/resume-generation";
import { useRouter } from "next/navigation";
import { revalidateCvList } from "@/lib/backend/revalidate";
import { fileToBase64 } from "@/lib/utils/image";
import { getChangedFields } from "@/components/cv-components/get-changed-fields";
import { editResume } from "@/lib/backend/edit-resume";
import { motion, AnimatePresence } from "framer-motion";
import { FaSpinner, FaCheck, FaExclamationTriangle } from "react-icons/fa";
import { FormValues } from "@/lib/types/form";

interface CvFormProps {
  originalData?: FormValues | null;
  cvId?: string;
}

export default function CvForm({ originalData, cvId }: CvFormProps) {
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useFormContext<FormValues>();

  const router = useRouter();
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'no-changes'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (data: FormValues) => {
    setSubmitStatus('idle');
    setErrorMessage(null);
    
    try {
      const payload = { ...data };

      if (data.profileImage instanceof File) {
        payload.profileImage = await fileToBase64(data.profileImage);
      }

      if (cvId && originalData) {
        const changes = await getChangedFields(originalData, payload);
        if (Object.keys(changes).length === 0) {
          setSubmitStatus('no-changes');
          setTimeout(() => setSubmitStatus('idle'), 3000);
          return;
        }
        const { status } = await editResume(cvId, changes);
        if (status !== 200 && status !== 201) {
          throw new Error("Failed to save changes");
        }
      } else {
        const { status } = await generateResume(payload);
        if (status !== 200 && status !== 201) {
          throw new Error("Failed to create resume");
        }
      }

      setSubmitStatus('success');
      await revalidateCvList();
      
      setTimeout(() => {
        router.push('/cv');
      }, 1000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred");
    }
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <section className="relative overflow-hidden rounded-xl p-4 sm:p-6 lg:p-10 min-h-[60vh]">
      <div className="bg-main-dark/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 md:p-12 flex flex-col md:flex-row gap-8 items-start text-text-dark shadow-2xl">
        <div className="w-full">
          <header className="mb-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight bg-clip-text text-transparent bg-linear-to-r from-aurora-blue-dark to-aurora-green-dark">
              {cvId ? "Edit your CV" : "Create your CV"}
            </h2>
            <p className="text-sm text-text-dark/70 mt-2 max-w-prose">
              Fill in the form below. A live preview is shown on the right.
            </p>
          </header>

          {/* Status messages */}
          <AnimatePresence mode="wait">
            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-sm flex items-center gap-2"
              >
                <FaCheck /> {cvId ? "Changes saved successfully!" : "Resume created successfully!"}
              </motion.div>
            )}
            {submitStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm flex items-center gap-2"
              >
                <FaExclamationTriangle /> {errorMessage || "An error occurred"}
              </motion.div>
            )}
            {submitStatus === 'no-changes' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-400 text-sm flex items-center gap-2"
              >
                <FaExclamationTriangle /> No changes detected
              </motion.div>
            )}
            {hasErrors && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm flex items-center gap-2"
              >
                <FaExclamationTriangle /> Please fix the errors in the form before submitting
              </motion.div>
            )}
          </AnimatePresence>

          <form
            className="w-full flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormSection title="Styling options">
              <FormStyling />
            </FormSection>

            <FormSection title="Personal information">
              <PersonalInfo />
            </FormSection>

            <FormSection title="Your portfolio">
              <PersonalPortfolio />
            </FormSection>

            <FormSection title="Your online profiles">
              <ProfileLinks />
            </FormSection>

            <FormSection title="Your education">
              <Education />
            </FormSection>

            <FormSection title="Your work experience">
              <WorkExperience />
            </FormSection>

            <FormSection title="Your skills">
              <Skills />
            </FormSection>

            <FormSection title="Your achievements">
              <Achievement />
            </FormSection>

            <div className="mt-3 flex flex-col sm:flex-row gap-3">
              <Button
                type={ButtonType.submit}
                className="flex-1 bg-aurora-blue-dark text-white px-6 py-3 rounded-lg shadow-xl hover:bg-aurora-blue-dark/80 transition-all font-semibold active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                disabled={isSubmitting || submitStatus === 'success'}
                icon={isSubmitting ? <FaSpinner className="animate-spin" /> : submitStatus === 'success' ? <FaCheck /> : undefined}
                text={
                  isSubmitting
                    ? cvId
                      ? "Saving..."
                      : "Creating..."
                    : submitStatus === 'success'
                      ? "Done!"
                      : cvId
                        ? "Save CV"
                        : "Create CV"
                }
              />
              <Button
                type={ButtonType.button}
                className="bg-transparent border border-white/10 text-text-dark px-4 py-3 rounded-lg hover:bg-white/5 transition-all active:scale-95"
                text="Reset"
                onClick={() => {
                  reset();
                  setSubmitStatus('idle');
                  setErrorMessage(null);
                }}
              />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
