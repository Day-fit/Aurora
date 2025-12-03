"use client";

import Button from "@/components/button";
import { ButtonType } from "@/lib/types/button";
import Skills from "@/components/skill";
import React from "react";
import { useFormContext } from "react-hook-form";
import Education from "@/components/education";
import Experience from "@/components/experience";
import Achievement from "@/components/achievement";
import FormSection from "@/components/form-section";
import PersonalInfo from "@/components/personal-info";
import ProfileLinks from "@/components/profile-links";
import FormStyling from "@/components/form-styling";

export default function CvForm() {
    //need to add validation, error handling, submit handling via request

    const { handleSubmit, reset } = useFormContext();

    const onSubmit = (data: any) => console.log(data);

    console.log("CvForm render");

    return (
        <section className="relative overflow-hidden rounded-xl p-6 lg:p-10 min-h-[60vh]">
            <div className="bg-main-dark/80 backdrop-blur-sm rounded-xl p-6 md:p-12 flex flex-col md:flex-row gap-8 items-start text-text-dark shadow-2xl">
                {/* Left: form (takes left half on md+) */}
                <div className="w-full">
                    <header className="mb-6">
                        <h2 className="text-3xl md:text-4xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-aurora-blue-dark to-aurora-green-dark">
                            Create your CV
                        </h2>
                        <p className="text-sm text-text-dark/70 mt-2 max-w-prose">
                            Fill the form on the left. AI tips and a live preview are on the right.
                        </p>
                    </header>

                    <form
                        className="w-full flex flex-col gap-4"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <FormSection title="Personal information">
                            <PersonalInfo />
                        </FormSection>

                        <FormSection title="Your online profiles">
                            <ProfileLinks />
                        </FormSection>

                        <FormSection title="Your education">
                            <Education />
                        </FormSection>

                        <FormSection title="Your experience">
                            <Experience />
                        </FormSection>

                        <FormSection title="Your skills">
                            <Skills />
                        </FormSection>

                        <FormSection title="Your achievements">
                            <Achievement />
                        </FormSection>

                        <FormSection title="Styling options">
                            <FormStyling />
                        </FormSection>

                        <div className="mt-3 flex gap-3">
                            <Button
                                type={ButtonType.submit}
                                className="flex-1 bg-aurora-blue-dark text-white px-6 py-3 rounded-lg shadow-xl hover:scale-102 transition-transform font-semibold"
                                text="Create CV"
                            />
                            <Button
                                className="bg-transparent border border-white/8 text-text-dark px-4 py-3 rounded-lg hover:bg-aurora-green-dark hover:text-white transition"
                                text="Reset"
                                onClick={() => reset()}
                            />
                        </div>

                    </form>
                </div>

                {/* Right: illustrative card (hidden on small screens) */}
            </div>
        </section>
    );
}
