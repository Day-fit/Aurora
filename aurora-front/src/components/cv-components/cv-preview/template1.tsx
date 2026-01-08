export default function Template1({ formData, preview }: any) {
  const {
    name,
    surname,
    title,
    profileDescription,
    email,
    website,
    linkedIn,
    gitHub,
    education,
    skills,
    experience,
    achievements,
    personalPortfolio,
    profileImage,
  } = formData;

  return (
    <div className="flex h-full border border-gray-300 rounded-lg overflow-hidden bg-white text-[#333] font-sans">
      {/* LEFT SIDE */}
      <div className="w-[35%] bg-[#1c7c74] text-white p-[25px] box-border">
        {profileImage && (
          <img
            src={preview}
            alt="Profile"
            className="w-full rounded-md mb-[25px] border-[3px] border-white object-cover aspect-square"
          />
        )}

        {(email || website || linkedIn || gitHub) && (
          <>
            <div className="text-[12px] font-bold border-b-2 border-white pb-[5px] mt-5 uppercase tracking-[1px] mb-2.5">
              Contact
            </div>

            {email && (
              <div className="flex items-center mb-2 text-[10px] break-all">
                📧<span className="ml-1.5 text-white">{email}</span>
              </div>
            )}

            {website && (
              <div className="flex items-center mb-2 text-[10px] break-all">
                🌐
                <span className="ml-1.5 text-white">
                  <a href={website} target="_blank" className="hover:underline">
                    Portfolio
                  </a>
                </span>
              </div>
            )}

            {linkedIn && (
              <div className="flex items-center mb-2 text-[10px] break-all">
                🔗
                <span className="ml-1.5 text-white">
                  <a
                    href={linkedIn}
                    target="_blank"
                    className="hover:underline"
                  >
                    LinkedIn
                  </a>
                </span>
              </div>
            )}

            {gitHub && (
              <div className="flex items-center mb-2 text-[10px] break-all">
                🐱
                <span className="ml-1.5 text-white">
                  <a href={gitHub} target="_blank" className="hover:underline">
                    GitHub
                  </a>
                </span>
              </div>
            )}
          </>
        )}

        {education?.length > 0 && (
          <>
            <div className="text-[12px] font-bold border-b-2 border-white pb-[5px] mt-5 uppercase tracking-[1px] mb-2.5">
              Education
            </div>

            {education.map((edu: any, index: number) => (
              <div key={index} className="mb-[15px]">
                <div className="font-bold text-[10px] mt-3">
                  {edu.institution}
                </div>
                <div className="text-[10px] mt-1">
                  {edu.degree}
                  {edu.major ? ` in ${edu.major}` : ""}
                </div>
                <div className="text-[10px] italic text-[#e0f7f7]">
                  {edu.fromYear} - {edu.toYear ? edu.toYear : "Present"}
                </div>
              </div>
            ))}
          </>
        )}

        {skills?.length > 0 && (
          <>
            <div className="text-[12px] font-bold border-b-2 border-white pb-[5px] mt-5 uppercase tracking-[1px] mb-2.5">
              Skills
            </div>
            <ul className="pl-[15px] mt-[5px] list-disc">
              {skills.map((skill: any, index: number) => (
                <li key={index} className="mb-[5px] text-[10px] leading-[1.4]">
                  {skill.name}
                  {skill.level && (
                    <span className="text-[9px] text-[#e0f7f7] ml-[5px]">
                      ({skill.level})
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="w-[65%] p-[25px] box-border bg-white overflow-y-auto">
        {/* NAME + TITLE */}
        {(name || surname) && (
          <h1 className="text-[28px] tracking-[1px] m-0 font-bold">
            {name} {surname}
          </h1>
        )}

        {title && (
          <h2 className="text-[16px] tracking-[1px] mt-[5px] mb-5 font-normal text-[#1c7c74]">
            {title}
          </h2>
        )}

        {/* PROFILE */}
        {profileDescription && (
          <>
            <div className="text-[12px] font-bold border-b-2 pb-[5px] mt-5 uppercase tracking-[1px] text-[#1c7c74] border-[#1c7c74] mb-2.5">
              Profile
            </div>
            <p className="text-[11px] leading-[1.6] my-[5px] text-justify">
              {profileDescription}
            </p>
          </>
        )}

        {/* WORK EXPERIENCE */}
        {experience?.length > 0 && (
          <>
            <div className="text-[12px] font-bold border-b-2 pb-[5px] mt-5 uppercase tracking-[1px] text-[#1c7c74] border-[#1c7c74] mb-2.5">
              Work Experience
            </div>

            {experience.map((exp: any, index: number) => (
              <div key={index} className="mb-[15px]">
                <div className="font-bold text-[11px]">{exp.position}</div>
                <div className="text-[10px] mt-1">{exp.company}</div>
                <div className="text-[10px] italic text-[#666]">
                  {exp.fromYear} - {exp.toYear ? exp.toYear : "Present"}
                </div>
                {exp.description && (
                  <p className="text-[10px] leading-normal text-[#555] mt-1.5 text-justify">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </>
        )}

        {/* PROJECTS */}
        {personalPortfolio?.length > 0 && (
          <>
            <div className="text-[12px] font-bold border-b-2 pb-[5px] mt-5 uppercase tracking-[1px] text-[#1c7c74] border-[#1c7c74] mb-2.5">
              Projects
            </div>

            {personalPortfolio.map((project: any, index: number) => (
              <div key={index} className="mb-[15px]">
                <div className="font-bold text-[11px]">{project.name}</div>
                {project.description && (
                  <p className="text-[10px] leading-normal text-[#555] mt-1 text-justify">
                    {project.description}
                  </p>
                )}
              </div>
            ))}
          </>
        )}

        {/* ACHIEVEMENTS */}
        {achievements?.length > 0 && (
          <>
            <div className="text-[12px] font-bold border-b-2 pb-[5px] mt-5 uppercase tracking-[1px] text-[#1c7c74] border-[#1c7c74] mb-2.5">
              Achievements
            </div>

            <ul className="pl-[15px] mt-[5px] list-disc">
              {achievements.map((ach: any, index: number) => (
                <li key={index} className="mt-3 text-[10px] leading-[1.4]">
                  <span className="font-bold">{ach.title}</span>
                  {ach.year && ` (${ach.year})`} - {ach.description}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
