// aurora-front/src/app/cv/create/page.tsx
import getResume from "@/lib/backend/get-resume";
import CreateCvClient from "@/components/cv-components/create-cv-client";
import { TemplateType } from "@/lib/types/form";
import { isoToDateInput } from "@/lib/utils/date";

export default async function CreatePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; autogen?: string }>;
}) {
  const { id, autogen } = await searchParams;
  const isAutoGen = autogen === "true";
  let initialData = null;

  if (id) {
    const data = await getResume(id);
    if (data) {
      initialData = {
        title: data.title ?? "",
        name: data.name ?? "",
        surname: data.surname ?? "",
        email: data.email ?? "",
        website: data.website ?? "",
        linkedIn: data.linkedIn ?? "",
        gitHub: data.gitHub ?? "",
        profileDescription: data.profileDescription ?? "",
        profileImage: data.profileImage ?? null,
        workExperience: (data.workExperience ?? []).map((exp: { company?: string; position?: string; description?: string | null; startDate?: string; endDate?: string | null }) => ({
          ...exp,
          startDate: isoToDateInput(exp.startDate),
          endDate: isoToDateInput(exp.endDate),
        })),
        achievements: data.achievements ?? [],
        skills: data.skills ?? [],
        education: data.education ?? [],
        personalPortfolio: data.personalPortfolio ?? [],
        templateVersion: data.templateVersion ?? TemplateType.template1,
        language: data.language ?? "ENGLISH",
      };
    }
  }

  return <CreateCvClient initialData={initialData} id={id} isAutoGen={isAutoGen} />;
}
