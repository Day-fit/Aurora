export default function Template5({ formData, preview }: any) {
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

  const contactInfo = [
    email && email,
    website && (
      <a
        key="web"
        href={website}
        target="_blank"
        className="text-black no-underline border-b border-black"
      >
        {website}
      </a>
    ),
    linkedIn && (
      <a
        key="li"
        href={linkedIn}
        target="_blank"
        className="text-black no-underline border-b border-black"
      >
        LinkedIn
      </a>
    ),
    gitHub && (
      <a
        key="gh"
        href={gitHub}
        target="_blank"
        className="text-black no-underline border-b border-black"
      >
        GitHub
      </a>
    ),
  ].filter(Boolean);

  return (
    <div className="h-full bg-white p-[40px_50px] box-border overflow-y-auto font-serif text-black border border-gray-300 rounded-lg">
      {/* HEADER */}
      <div className="text-center mb-6 pb-4 border-b-2 border-black">
        {profileImage && (
          <img
            src={preview}
            alt="Profile"
            className="w-[90px] h-[90px] border-2 border-black mx-auto mb-4 object-cover"
          />
        )}
        <h1 className="text-[24px] font-bold uppercase tracking-[2px] m-0">
          {name} {surname}
        </h1>
        <h2 className="text-[14px] font-normal italic mt-1.5 mb-2.5">
          {title}
        </h2>
        <div className="text-[10px] text-[#333] leading-normal">
          {contactInfo.map((item, index) => (
            <span key={index}>
              {item}
              {index < contactInfo.length - 1 && " • "}
            </span>
          ))}
        </div>
      </div>

      {/* SUMMARY */}
      {profileDescription && (
        <div className="mb-5">
          <div className="text-[12px] font-bold uppercase tracking-[1.5px] mb-2.5 pb-1 border-b-2 border-black">
            Professional Summary
          </div>
          <p className="text-[11px] leading-[1.7] text-justify">
            {profileDescription}
          </p>
        </div>
      )}

      {/* EXPERIENCE */}
      {experience?.length > 0 && (
        <div className="mb-5">
          <div className="text-[12px] font-bold uppercase tracking-[1.5px] mb-2.5 pb-1 border-b-2 border-black">
            Professional Experience
          </div>
          {experience.map((exp: any, index: number) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-[3px]">
                <div className="flex-1">
                  <div className="text-[11px] font-bold">{exp.position}</div>
                  <div className="text-[11px] italic">{exp.company}</div>
                </div>
                <div className="text-[10px] text-[#333] ml-4 whitespace-nowrap">
                  {exp.fromYear} - {exp.toYear ? exp.toYear : "Present"}
                </div>
              </div>
              {exp.description && (
                <p className="text-[10px] leading-[1.6] text-justify mt-1">
                  {exp.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* EDUCATION */}
      {education?.length > 0 && (
        <div className="mb-5">
          <div className="text-[12px] font-bold uppercase tracking-[1.5px] mb-2.5 pb-1 border-b-2 border-black">
            Education
          </div>
          {education.map((edu: any, index: number) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-[3px]">
                <div className="flex-1">
                  <div className="text-[11px] font-bold">{edu.institution}</div>
                  <div className="text-[10px] italic">
                    {edu.degree}
                    {edu.major ? ` in ${edu.major}` : ""}
                  </div>
                </div>
                <div className="text-[10px] text-[#333] ml-4 whitespace-nowrap">
                  {edu.fromYear} - {edu.toYear ? edu.toYear : "Present"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SKILLS */}
      {skills?.length > 0 && (
        <div className="mb-5">
          <div className="text-[12px] font-bold uppercase tracking-[1.5px] mb-2.5 pb-1 border-b-2 border-black">
            Skills & Competencies
          </div>
          <div className="columns-2 gap-5">
            {skills.map((skill: any, index: number) => (
              <div
                key={index}
                className="text-[10px] mb-1.5 break-inside-avoid"
              >
                • {skill.name}
                {skill.level && (
                  <span className="text-[9px] text-[#333] ml-1.5 italic">
                    ({skill.level})
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PROJECTS */}
      {personalPortfolio?.length > 0 && (
        <div className="mb-5">
          <div className="text-[12px] font-bold uppercase tracking-[1.5px] mb-2.5 pb-1 border-b-2 border-black">
            Projects & Portfolio
          </div>
          {personalPortfolio.map((project: any, index: number) => (
            <div key={index} className="mb-4">
              <div className="text-[11px] font-bold">{project.name}</div>
              <p className="text-[10px] leading-[1.6] text-justify mt-1">
                {project.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ACHIEVEMENTS */}
      {achievements?.length > 0 && (
        <div className="mb-5">
          <div className="text-[12px] font-bold uppercase tracking-[1.5px] mb-2.5 pb-1 border-b-2 border-black">
            Honors & Achievements
          </div>
          <ul className="pl-6 list-disc">
            {achievements.map((ach: any, index: number) => (
              <li key={index} className="text-[10px] leading-[1.6] mb-1.5">
                <strong className="font-bold">{ach.title}</strong>
                {ach.year && `, ${ach.year}`}: {ach.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
