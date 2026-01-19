// aurora-front/src/components/cv-components/cv-form.tsx
"use client";

import Button from "@/components/button";
import { ButtonType } from "@/lib/types/button";
import Skills from "@/components/cv-components/skill";
import React from "react";
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

interface CvFormProps {
  originalData?: any;
  cvId?: string;
}

export default function CvForm({ originalData, cvId }: CvFormProps) {
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useFormContext();

  const router = useRouter();

  const onSubmit = async (data: any) => {
    try {
      const payload = { ...data };

      if (data.profileImage instanceof File) {
        payload.profileImage = await fileToBase64(data.profileImage);
      }

      if (cvId && originalData) {
        const changes = await getChangedFields(originalData, payload);
        if (Object.keys(changes).length === 0) {
          console.log("No changes detected");
          return;
        }
        await editResume(cvId, changes);
        console.log("Changes detected:", changes);
      } else {
        await generateResume(payload);
      }

      await revalidateCvList();
      router.back();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An unexpected error occurred.");
    }
  };

  return (
    <section className="relative overflow-hidden rounded-xl p-4 sm:p-6 lg:p-10 min-h-[60vh]">
      <div className="bg-main-dark/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 md:p-12 flex flex-col md:flex-row gap-6 sm:gap-8 items-start text-text-dark shadow-2xl">
        <div className="w-full">
          <header className="mb-4 sm:mb-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight bg-clip-text text-transparent bg-linear-to-r from-aurora-blue-dark to-aurora-green-dark">
              {cvId ? "Edit your CV" : "Create your CV"}
            </h2>
            <p className="text-xs sm:text-sm text-text-dark/70 mt-2 max-w-prose">
              Fill the form below. AI tips and a live preview are on the
              right.
            </p>
          </header>

          <form
            className="w-full flex flex-col gap-3 sm:gap-4"
            onSubmit={handleSubmit(onSubmit, (validationErrors) => {
              console.log("Validation failed:", validationErrors);
            })}
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

            <div className="mt-3 flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                type={ButtonType.submit}
                className="flex-1 bg-aurora-blue-dark text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg shadow-xl hover:scale-102 transition-transform font-semibold text-sm sm:text-base"
                disabled={isSubmitting}
                text={
                  isSubmitting
                    ? cvId
                      ? "Saving..."
                      : "Creating..."
                    : cvId
                      ? "Save CV"
                      : "Create CV"
                }
              />
              <Button
                type={ButtonType.button}
                className="bg-transparent border border-white/8 text-text-dark px-4 py-2.5 sm:py-3 rounded-lg hover:bg-aurora-green-dark hover:text-white transition text-sm sm:text-base"
                text="Reset"
                onClick={() => reset()}
              />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
