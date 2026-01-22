import { useFormContext, useWatch } from "react-hook-form";
import { useEffect, useState, useMemo } from "react";
import { generateTemplateHtml } from "@/components/cv-components/cv-preview/freemarker-templates";

export default function TemplatePreview() {
  const [profileImageBase64, setProfileImageBase64] = useState<
    string | undefined
  >(undefined);
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
    workExperience: useWatch({ control, name: "workExperience" }),
    achievements: useWatch({ control, name: "achievements" }),
    profileImageList: useWatch({ control, name: "profileImage" }),
    templateVersion: useWatch({ control, name: "templateVersion" }),
    personalPortfolio: useWatch({ control, name: "personalPortfolio" }),
    language: useWatch({ control, name: "language" }),
  };

  const profileImageFile = formData.profileImageList?.[0];

  useEffect(() => {
    if (!profileImageFile) {
      setProfileImageBase64(undefined);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setProfileImageBase64(reader.result as string);
    };
    reader.readAsDataURL(profileImageFile);
  }, [profileImageFile]);

  const templateHtml = useMemo(() => {
    return generateTemplateHtml(formData.templateVersion || 1, {
      name: formData.name,
      surname: formData.surname,
      title: formData.title,
      profileDescription: formData.profileDescription,
      email: formData.email,
      website: formData.website,
      linkedIn: formData.linkedIn,
      gitHub: formData.gitHub,
      education: formData.education,
      skills: formData.skills,
      workExperience: formData.workExperience,
      achievements: formData.achievements,
      personalPortfolio: formData.personalPortfolio,
      profileImage: profileImageBase64,
      language: formData.language,
    });
  }, [
    formData.name,
    formData.surname,
    formData.title,
    formData.profileDescription,
    formData.email,
    formData.website,
    formData.linkedIn,
    formData.gitHub,
    formData.education,
    formData.skills,
    formData.workExperience,
    formData.achievements,
    formData.personalPortfolio,
    formData.templateVersion,
    formData.language,
    profileImageBase64,
  ]);

  return (
    <section className="relative overflow-hidden rounded-xl p-6 lg:p-10 min-h-[60vh]">
      <div className="w-full max-w-[800px] aspect-[1/1.4142] mx-auto">
        <iframe
          srcDoc={templateHtml}
          className="w-full h-full border border-gray-300 rounded-lg bg-white"
          title="Resume Preview"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </section>
  );
}
