"use client";

import Button from "@/components/button";
import { ButtonType } from "@/lib/types/button";
import Skills from "@/components/cv-components/skill";
import React from "react";
import { useFormContext } from "react-hook-form";
import Education from "@/components/cv-components/education";
import Experience from "@/components/cv-components/experience";
import Achievement from "@/components/cv-components/achievement";
import FormSection from "@/components/cv-components/form-section";
import PersonalInfo from "@/components/cv-components/personal-info";
import ProfileLinks from "@/components/cv-components/profile-links";
import FormStyling from "@/components/cv-components/form-styling";
import PersonalPortfolio from "@/components/cv-components/personal-portfolio";
import { generateCv } from "@/lib/backend/resume-generation";

export default function CvForm() {
  //need to add validation, error handling, submit handling via request

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useFormContext();

  const onSubmit = async (data: any) => {
    console.log("Submitting form:", data);

    try {
      const response = await generateCv(data);

      if (response.status >= 200 && response.status < 300) {
        console.log("CV Generated successfully:", response.data);
        // Maybe redirect or show success message
      } else {
        console.error("Failed to generate CV:", response.data);
        alert("Failed to generate CV. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An unexpected error occurred.");
    }
  };

  return (
    <section className="relative overflow-hidden rounded-xl p-6 lg:p-10 min-h-[60vh]">
      <div className="bg-main-dark/80 backdrop-blur-sm rounded-xl p-6 md:p-12 flex flex-col md:flex-row gap-8 items-start text-text-dark shadow-2xl">
        <div className="w-full">
          <header className="mb-6">
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight bg-clip-text text-transparent bg-linear-to-r from-aurora-blue-dark to-aurora-green-dark">
              Create your CV
            </h2>
            <p className="text-sm text-text-dark/70 mt-2 max-w-prose">
              Fill the form on the left. AI tips and a live preview are on the
              right.
            </p>
          </header>

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
              <Experience />
            </FormSection>

            <FormSection title="Your skills">
              <Skills />
            </FormSection>

            <FormSection title="Your achievements">
              <Achievement />
            </FormSection>

            <div className="mt-3 flex gap-3">
              <Button
                type={ButtonType.submit}
                className="flex-1 bg-aurora-blue-dark text-white px-6 py-3 rounded-lg shadow-xl hover:scale-102 transition-transform font-semibold"
                disabled={isSubmitting}
                text={isSubmitting ? "Creating..." : "Create CV"}
              />
              <Button
                className="bg-transparent border border-white/8 text-text-dark px-4 py-3 rounded-lg hover:bg-aurora-green-dark hover:text-white transition"
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
