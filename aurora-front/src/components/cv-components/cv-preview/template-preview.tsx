import { useFormContext, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import { TemplateType } from "@/lib/types/form";
import Template1 from "@/components/cv-components/cv-preview/template1";

export default function TemplatePreview() {
  const [preview, setPreview] = useState<string | undefined>(undefined);

  const { control } = useFormContext();

  const name = useWatch({ control, name: "name" });
  const surname = useWatch({ control, name: "surname" });
  const title = useWatch({ control, name: "title" });
  const profileDescription = useWatch({ control, name: "profileDescription" });
  const email = useWatch({ control, name: "email" });
  const website = useWatch({ control, name: "website" });
  const linkedIn = useWatch({ control, name: "linkedIn" });
  const gitHub = useWatch({ control, name: "gitHub" });
  const education = useWatch({ control, name: "education" });
  const skills = useWatch({ control, name: "skills" });
  const experience = useWatch({ control, name: "experience" });
  const achievements = useWatch({ control, name: "achievements" });
  const profileImage = useWatch({ control, name: "profileImage" });
  const template = useWatch({ control, name: "template" });

  useEffect(() => {
    if (!profileImage?.length) {
      return undefined;
    }

    const url = URL.createObjectURL(profileImage[0]);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [profileImage]);

  return (
    <section className="relative overflow-hidden rounded-xl p-6 lg:p-10 min-h-[60vh]">
      <div className="w-full max-w-[800px] aspect-[1/1.4142] mx-auto">
        {template === TemplateType.template1 && (
          <Template1
            name={name}
            preview={preview}
            surname={surname}
            title={title}
            profileDescription={profileDescription}
            email={email}
            website={website}
            linkedIn={linkedIn}
            gitHub={gitHub}
            education={education}
            skills={skills}
            experience={experience}
            achievements={achievements}
            profileImage={profileImage}
          />
        )}
        {template === TemplateType.template2 && <></>}
        {template === TemplateType.template3 && <></>}
        {template === TemplateType.template4 && <></>}
        {template === TemplateType.template5 && <></>}
      </div>
    </section>
  );
}
