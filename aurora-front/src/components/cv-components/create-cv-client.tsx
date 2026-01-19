"use client";

import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { TemplateType, formSchema, FormValues } from "@/lib/types/form";
import { zodResolver } from "@hookform/resolvers/zod";
import CvForm from "@/components/cv-components/cv-form";
import TemplatePreview from "@/components/cv-components/cv-preview/template-preview";
import { base64ToFile } from "@/lib/utils/image";
import getAutoGenerationData, {
  AutoGenerationData,
} from "@/lib/backend/get-autogeneration-data";

function safeBase64ToFile(base64: string): File | null {
  try {
    return base64ToFile(base64);
  } catch (error) {
    console.error("Failed to convert base64 to file:", error);
    return null;
  }
}

function transformAutoGenDataToFormValues(
  data: AutoGenerationData,
): Partial<FormValues> {
  return {
    templateVersion: TemplateType.template1,
    language: "ENGLISH",
    title: data.title ?? "",
    name: "",
    surname: "",
    email: data.email ?? "",
    website: data.website ?? "",
    linkedIn: data.linkedIn ?? "",
    gitHub: data.gitHub ?? "",
    profileDescription: data.profileDescription ?? "",
    profileImage: data.profileImage
      ? safeBase64ToFile(data.profileImage)
      : null,
    workExperience:
      data.workExperiences?.map((exp) => ({
        company: exp.company,
        position: exp.position,
        description: exp.description ?? null,
        startDate: exp.startDate,
        endDate: exp.endDate ?? null,
      })) ?? [],
    education:
      data.education?.map((edu) => ({
        institution: edu.institution,
        major: edu.major ?? null,
        degree: edu.degree,
        fromYear: edu.fromYear,
        toYear: edu.toYear ?? new Date().getFullYear(),
      })) ?? [],
    skills: data.skills ?? [],
    achievements:
      data.achievements?.map((ach) => ({
        title: ach.title,
        description: ach.description,
        year: ach.year ?? null,
      })) ?? [],
    personalPortfolio: data.personalPortfolios ?? [],
  };
}

export default function CreateCvClient({
  initialData,
  id,
  isAutoGen,
}: {
  initialData: any;
  id?: string;
  isAutoGen?: boolean;
}) {
  const [isLoadingAutoGen, setIsLoadingAutoGen] = useState(isAutoGen ?? false);
  const [autoGenError, setAutoGenError] = useState<string | null>(null);
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
      language: "ENGLISH",
      title: "",
      name: "",
      surname: "",
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

  // Fetch auto-generation data when component mounts with isAutoGen
  useEffect(() => {
    async function fetchAutoGenData() {
      if (!isAutoGen) return;

      const trackingId = sessionStorage.getItem("autoGenerationTrackingId");
      if (!trackingId) {
        setIsLoadingAutoGen(false);
        setAutoGenError(
          "Auto-generation session expired or not found. Please try generating again.",
        );
        return;
      }

      try {
        const { data, status } = await getAutoGenerationData(trackingId);
        if (status === 200 && data) {
          const formData = transformAutoGenDataToFormValues(data);
          methods.reset({
            ...methods.getValues(),
            ...formData,
          });
          // Clear the tracking ID from sessionStorage after successful fetch
          sessionStorage.removeItem("autoGenerationTrackingId");
        } else {
          setAutoGenError("Failed to fetch auto-generation data");
        }
      } catch (error) {
        console.error("Error fetching auto-generation data:", error);
        setAutoGenError("An error occurred while fetching data");
      } finally {
        setIsLoadingAutoGen(false);
      }
    }

    fetchAutoGenData();
  }, [isAutoGen, methods]);

  if (isLoadingAutoGen) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aurora-green-dark mx-auto mb-4"></div>
          <p className="text-text-dark">Loading auto-generated data...</p>
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      {autoGenError && (
        <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-400 text-sm">
          {autoGenError}. You can still create your resume manually.
        </div>
      )}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="w-full md:w-1/2 min-w-0">
          <CvForm originalData={originalDataForComparison} cvId={id} />
        </div>
        <div className="w-full md:w-1/2 min-w-0">
          <TemplatePreview />
        </div>
      </div>
    </FormProvider>
  );
}
