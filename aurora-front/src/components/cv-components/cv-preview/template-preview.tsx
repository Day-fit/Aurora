// aurora-front/src/components/cv-components/cv-preview/template-preview.tsx
import { useFormContext, useWatch } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { TemplateType, FormValues } from "@/lib/types/form";
import Template1 from "@/components/cv-components/cv-preview/template1";
import Template2 from "@/components/cv-components/cv-preview/template2";
import Template3 from "@/components/cv-components/cv-preview/template3";
import Template4 from "@/components/cv-components/cv-preview/template4";
import Template5 from "@/components/cv-components/cv-preview/template5";

const TEMPLATE_MAP: Record<number, React.ComponentType<TemplateProps>> = {
  [TemplateType.template1]: Template1,
  [TemplateType.template2]: Template2,
  [TemplateType.template3]: Template3,
  [TemplateType.template4]: Template4,
  [TemplateType.template5]: Template5,
};

interface TemplateProps {
  formData: FormDataType;
  preview: string | undefined;
}

interface FormDataType {
  name: string;
  surname: string;
  title: string;
  profileDescription: string | null;
  email: string;
  website: string;
  linkedIn: string;
  gitHub: string;
  education: FormValues["education"];
  skills: FormValues["skills"];
  experience: FormValues["workExperience"];
  achievements: FormValues["achievements"];
  profileImage: File | string | null;
  templateVersion: number;
  personalPortfolio: FormValues["personalPortfolio"];
}

export default function TemplatePreview() {
  const { control } = useFormContext();
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const prevUrlRef = useRef<string | undefined>(undefined);

  const formData = {
    name: useWatch({ control, name: "name" }),
    surname: useWatch({ control, name: "surname" }),
    title: useWatch({ control, name: "title" }),
    profileDescription: useWatch({ control, name: "profileDescription" }),
    email: useWatch({ control, name: "email" }),
    website: useWatch({ control, name: "website" }),
    linkedIn: useWatch({ control, name: "linkedIn" }),
    gitHub: useWatch({ control, name: "gitHub" }),
    education: useWatch({ control, name: "education" }),
    skills: useWatch({ control, name: "skills" }),
    experience: useWatch({ control, name: "workExperience" }),
    achievements: useWatch({ control, name: "achievements" }),
    profileImage: useWatch({ control, name: "profileImage" }),
    templateVersion: useWatch({ control, name: "templateVersion" }),
    personalPortfolio: useWatch({ control, name: "personalPortfolio" }),
  };

  // Handle profile image URL creation/cleanup in useEffect
  useEffect(() => {
    // Clean up the old URL if it exists
    if (prevUrlRef.current) {
      URL.revokeObjectURL(prevUrlRef.current);
      prevUrlRef.current = undefined;
    }
    
    if (formData.profileImage instanceof File) {
      const url = URL.createObjectURL(formData.profileImage);
      prevUrlRef.current = url;
      setPreview(url);
    } else {
      setPreview(undefined);
    }

    // Cleanup on unmount
    return () => {
      if (prevUrlRef.current) {
        URL.revokeObjectURL(prevUrlRef.current);
      }
    };
  }, [formData.profileImage]);

  const TemplateComponent = TEMPLATE_MAP[formData.templateVersion] || Template1;

  return (
    <section className="relative overflow-hidden rounded-xl p-4 sm:p-6 lg:p-10 min-h-[60vh]">
      <div className="w-full max-w-[800px] aspect-[1/1.4142] mx-auto">
        <TemplateComponent formData={formData} preview={preview} />
      </div>
    </section>
  );
}
