import { useFormContext, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";

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
        <div className="flex h-full border border-gray-300 rounded-lg overflow-hidden">
          {/* LEFT SIDE */}
          <div className="w-[35%] bg-[#1c7c74] text-white p-[25px] box-border">
            {profileImage && (
              <img
                src={preview}
                alt=""
                className="w-full rounded-md mb-[25px] border-[3px] border-white"
              />
            )}

            {(email || website || linkedIn || gitHub) && (
              <>
                <div className="text-[12px] font-bold border-b-2 border-white pb-[5px] mt-5 uppercase tracking-[1px]">
                  Contact
                </div>

                {email && (
                  <div className="flex items-center mb-2 text-[11px]">
                    📧<span className="ml-1.5 text-white">{email}</span>
                  </div>
                )}

                {website && (
                  <div className="flex items-center mb-2 text-[11px]">
                    🌐
                    <span className="ml-1.5 text-white">
                      <a href={website} target="_blank">
                        Portfolio
                      </a>
                    </span>
                  </div>
                )}

                {linkedIn && (
                  <div className="flex items-center mb-2 text-[11px]">
                    🔗
                    <span className="ml-1.5 text-white">
                      <a href={linkedIn} target="_blank">
                        LinkedIn
                      </a>
                    </span>
                  </div>
                )}

                {gitHub && (
                  <div className="flex items-center mb-2 text-[11px]">
                    🐱
                    <span className="ml-1.5 text-white">
                      <a href={gitHub} target="_blank">
                        GitHub
                      </a>
                    </span>
                  </div>
                )}
              </>
            )}

            {education?.length > 0 && (
              <>
                <div className="text-[12px] font-bold border-b-2 border-white pb-[5px] mt-5 uppercase tracking-[1px]">
                  Education
                </div>

                {education.map((edu: any, index: number) => (
                  <div key={index} className="mb-[15px]">
                    <div className="font-bold mt-2">{edu.institution}</div>
                    <div>
                      {edu.degree
                        ?.split("_")
                        .map(
                          (w: string) => w.charAt(0) + w.slice(1).toLowerCase(),
                        )
                        .join(" ")}
                      {edu.major ? `, ${edu.major}` : ""}
                    </div>
                    <div>
                      {edu.fromYear} - {edu.toYear ? edu.toYear : "Present"}
                    </div>
                  </div>
                ))}
              </>
            )}

            {skills?.length > 0 && (
              <>
                <div className="text-[12px] font-bold border-b-2 border-white pb-[5px] mt-5 uppercase tracking-[1px]">
                  Skills
                </div>
                <ul className="pl-[15px] mt-[5px]">
                  {skills.map((skill: any, index: number) => (
                    <li key={index} className="mb-[5px] text-[12px]">
                      {skill.name}
                      {skill.level && (
                        <span className="text-[10px] text-gray-300 ml-[5px]">
                          (
                          {skill.level.charAt(0).toUpperCase() +
                            skill.level.slice(1).toLowerCase()}
                          )
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          {/* RIGHT SIDE */}
          <div className="w-[65%] p-[25px] box-border bg-white">
            {/* NAME + TITLE */}
            {(name || surname) && (
              <h1 className="text-[24px] tracking-[1px] m-0">
                {name} {surname}
              </h1>
            )}

            {title && (
              <h2 className="text-[14px] tracking-[1px] mt-[5px] mb-5 font-normal text-[#1c7c74]">
                {title}
              </h2>
            )}

            {/* PROFILE */}
            {profileDescription && (
              <>
                <div className="text-[12px] font-bold border-b-2 pb-[5px] mt-5 uppercase tracking-[1px] text-[#1c7c74] border-[#1c7c74]">
                  Profile
                </div>
                <p className="text-[12px] leading-normal my-[5px]">
                  {profileDescription}
                </p>
              </>
            )}

            {/* WORK EXPERIENCE */}
            {experience?.length > 0 && (
              <>
                <div className="text-[12px] font-bold border-b-2 pb-[5px] mt-5 uppercase tracking-[1px] text-[#1c7c74] border-[#1c7c74]">
                  Work Experience
                </div>

                {experience.map((exp: any, index: number) => (
                  <div key={index} className="mt-2">
                    <div className="font-bold">
                      {exp.position} at {exp.company} | {exp.fromYear} -{" "}
                      {exp.toYear ? exp.toYear : "Present"}
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* ACHIEVEMENTS */}
            {achievements?.length > 0 && (
              <>
                <div className="text-[12px] font-bold border-b-2 pb-[5px] mt-5 uppercase tracking-[1px] text-[#1c7c74] border-[#1c7c74]">
                  Achievements
                </div>

                <ul className="pl-[15px] mt-[5px]">
                  {achievements.map((ach: any, index: number) => (
                    <li key={index} className="mt-2 text-[12px]">
                      <span className="font-bold">{ach.title}</span>
                      {ach.year && ` (${ach.year})`} - {ach.description}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
