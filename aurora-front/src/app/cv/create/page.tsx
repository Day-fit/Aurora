// aurora-front/src/app/cv/create/page.tsx
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
        title: data.title ?? "",
        name: data.name ?? "",
        surname: data.surname ?? "",
        age: data.age ?? undefined,
        email: data.email ?? "",
        website: data.website ?? "",
        linkedIn: data.linkedIn ?? "",
        gitHub: data.gitHub ?? "",
        profileDescription: data.profileDescription ?? "",
        profileImage: data.profileImage ?? null,
        workExperience: data.workExperience ?? [],
        achievements: data.achievements ?? [],
        skills: data.skills ?? [],
        education: data.education ?? [],
        personalPortfolio: data.personalPortfolio ?? [],
        templateVersion: data.templateVersion ?? TemplateType.template1,
      };
    }
  }

  return <CreateCvClient initialData={initialData} id={id} />;
}
