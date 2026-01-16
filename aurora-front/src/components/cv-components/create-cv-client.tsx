"use client";

import { FormProvider, useForm } from "react-hook-form";
import { TemplateType, formSchema, FormValues } from "@/lib/types/form";
import { zodResolver } from "@hookform/resolvers/zod";
import CvForm from "@/components/cv-components/cv-form";
import TemplatePreview from "@/components/cv-components/cv-preview/template-preview";
import { base64ToFile } from "@/lib/utils/image";

export default function CreateCvClient({
  initialData,
  id,
}: {
  initialData: FormValues | null;
  id?: string;
}) {
  const originalDataForComparison = initialData;

  const processedData = (() => {
    if (typeof window === "undefined" || !initialData?.profileImage) {
      return initialData;
    }

    // Convert Base64 string to File object
    if (typeof initialData.profileImage === "string") {
      const file = base64ToFile(initialData.profileImage);
      return {
        ...initialData,
        profileImage: file, // Now it's a File object, not a string
      };
    }

    return initialData;
  })();

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: processedData || {
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

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-start p-2 sm:p-4">
        <div className="w-full lg:w-1/2 min-w-0 order-2 lg:order-1">
          <CvForm originalData={originalDataForComparison} cvId={id} />
        </div>
        <div className="w-full lg:w-1/2 min-w-0 order-1 lg:order-2 lg:sticky lg:top-20">
          <TemplatePreview />
        </div>
      </div>
    </FormProvider>
  );
}
