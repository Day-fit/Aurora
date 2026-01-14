import { useFormContext, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import { TemplateType } from "@/lib/types/form";
import Template1 from "@/components/cv-components/cv-preview/template1";
import Template2 from "@/components/cv-components/cv-preview/template2";
import Template3 from "@/components/cv-components/cv-preview/template3";
import Template4 from "@/components/cv-components/cv-preview/template4";
import Template5 from "@/components/cv-components/cv-preview/template5";

export default function TemplatePreview() {
  const [preview, setPreview] = useState<string | undefined>(undefined);

  const { control } = useFormContext();

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
    experience: useWatch({ control, name: "experience" }),
    achievements: useWatch({ control, name: "achievements" }),
    profileImage: useWatch({ control, name: "profileImage" }),
    template: useWatch({ control, name: "template" }),
    personalPortfolio: useWatch({ control, name: "personalPortfolio" }),
  };
  const profileImage = formData.profileImage;

  useEffect(() => {
    if (profileImage instanceof File) {
      const url = URL.createObjectURL(profileImage);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(undefined);
    }
  }, [profileImage]);

  return (
    <section className="relative overflow-hidden rounded-xl p-6 lg:p-10 min-h-[60vh]">
      <div className="w-full max-w-[800px] aspect-[1/1.4142] mx-auto">
        {formData.template == TemplateType.template1 && (
          <Template1 formData={formData} preview={preview} />
        )}
        {formData.template == TemplateType.template2 && (
          <Template2 formData={formData} preview={preview} />
        )}
        {formData.template == TemplateType.template3 && (
          <Template3 formData={formData} preview={preview} />
        )}
        {formData.template == TemplateType.template4 && (
          <Template4 formData={formData} preview={preview} />
        )}
        {formData.template == TemplateType.template5 && (
          <Template5 formData={formData} preview={preview} />
        )}
      </div>
    </section>
  );
}
