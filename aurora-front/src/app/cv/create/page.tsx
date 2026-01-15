import getResume from "@/lib/backend/get-resume";
import CreateCvClient from "@/components/cv-components/create-cv-client";
import { TemplateType } from "@/lib/types/form";

export default async function CreatePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  let initialData = null;

  if (id) {
    const data = await getResume(id);
    if (data) {
      initialData = {
        // Basic fields with fallbacks
        title: data.title || "",
        name: data.name || "",
        surname: data.surname || "",
        age: data.age || undefined,
        email: data.email || "",
        website: data.website || "",
        linkedIn: data.linkedIn || "",
        gitHub: data.gitHub || "",
        profileDescription: data.profileDescription || "",
        profileImage: data.profileImage || null,

        // Arrays with fallbacks to empty arrays
        workExperience: Array.isArray(data.workExperience)
          ? data.workExperience
          : [],
        achievements: Array.isArray(data.achievements) ? data.achievements : [],
        skills: Array.isArray(data.skills) ? data.skills : [],
        education: Array.isArray(data.education) ? data.education : [],
        personalPortfolio: Array.isArray(data.personalPortfolio)
          ? data.personalPortfolio
          : [],

        // Template version with proper enum mapping
        templateVersion: mapTemplateVersion(data.templateVersion),
      };
    }
    console.log("Processed initialData:", initialData);
  }

  return <CreateCvClient initialData={initialData} id={id} />;
}

// Helper function to map template version from API to your enum
function mapTemplateVersion(apiVersion: any): TemplateType {
  // If it's already the correct enum value, return it
  if (Object.values(TemplateType).includes(apiVersion)) {
    return apiVersion;
  }

  // Map numeric values to enum
  switch (apiVersion) {
    case 1:
      return TemplateType.template1;
    case 2:
      return TemplateType.template2;
    case 3:
      return TemplateType.template3;
    case 4:
      return TemplateType.template4;
    case 5:
      return TemplateType.template5;
    default:
      return TemplateType.template1; // Default fallback
  }
}
