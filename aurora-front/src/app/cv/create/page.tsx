"use client";

import CvForm from "@/components/cv-components/cv-form";
import TemplatePreview from "@/components/cv-components/cv-preview/template-preview";
import { FormProvider, useForm } from "react-hook-form";
import { TemplateType } from "@/lib/types/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormValues } from "@/lib/types/form";
import { useSearchParams } from "next/navigation";
import getResume from "@/lib/backend/get-resume";
import { useEffect } from "react";

export default function CreatePage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      templateVersion: TemplateType.template1,
      title: "",
      name: "",
      surname: "",
      age: undefined,
      email: "",
      website: "",
      linkedIn: "",
      gitHub: "",
      profileDescription: "",
      profileImage: null,
      workExperience: [],
      achievements: [],
      skills: [],
      education: [],
      personalPortfolio: [],
    },
  });

  useEffect(() => {
    if (!id) return;

    const fetchResume = async () => {
      try {
        const data = await getResume(id);
        if (data) {
          methods.reset(data);
        }
        console.log("Resume fetched:", data);
      } catch (error) {
        console.error("Error fetching resume:", error);
      }
    };

    fetchResume();
  }, [id, methods]);

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="w-full md:w-1/2 min-w-0">
          <CvForm />
        </div>

        <div className="w-full md:w-1/2 min-w-0">
          <TemplatePreview />
        </div>
      </div>
    </FormProvider>
  );
}
