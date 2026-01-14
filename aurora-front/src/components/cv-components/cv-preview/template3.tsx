export default function Template3({ formData, preview }: any) {
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
    <div className="h-full bg-white p-10 box-border overflow-y-auto font-serif text-[#1a1a1a] border border-gray-300 rounded-lg">
      {/* HEADER */}
      <div className="text-center mb-8 pb-5 border-b border-[#1a1a1a]">
        {profileImage && (
          <img
            src={preview}
            alt="Profile"
            className="w-[100px] h-[100px] rounded-full border-2 border-[#1a1a1a] mx-auto mb-4 object-cover"
          />
        )}
        <h1 className="text-[28px] font-normal tracking-[3px] uppercase m-0">
          {name} {surname}
        </h1>
        <h2 className="text-[14px] font-light text-[#666] tracking-[1px] mt-1 mb-4 italic">
          {title}
        </h2>

        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[10px] text-[#666]">
          {email && <span>{email}</span>}
          {website && (
            <span>
              <a
                href={website}
                target="_blank"
                className="text-[#1a1a1a] border-b border-[#ccc] hover:border-[#1a1a1a]"
              >
                Portfolio
              </a>
            </span>
          )}
          {linkedIn && (
            <span>
              <a
                href={linkedIn}
                target="_blank"
                className="text-[#1a1a1a] border-b border-[#ccc] hover:border-[#1a1a1a]"
              >
                LinkedIn
              </a>
            </span>
          )}
          {gitHub && (
            <span>
              <a
                href={gitHub}
                target="_blank"
                className="text-[#1a1a1a] border-b border-[#ccc] hover:border-[#1a1a1a]"
              >
                GitHub
              </a>
            </span>
          )}
        </div>
      </div>

      {/* ABOUT */}
      {profileDescription && (
        <div className="mb-[30px]">
          <div className="text-[12px] font-bold uppercase tracking-[2px] mb-[15px]">
            About
          </div>
          <p className="text-[11px] leading-[1.8] text-[#333] text-justify italic">
            {profileDescription}
          </p>
        </div>
      )}

      {/* EXPERIENCE */}
      {experience?.length > 0 && (
        <div className="mb-[30px]">
          <div className="text-[12px] font-bold uppercase tracking-[2px] mb-[15px]">
            Experience
          </div>
          {experience.map((exp: any, index: number) => (
            <div key={index} className="mb-5 pl-5 border-l-2 border-text-dark">
              <div className="flex justify-between items-baseline mb-1">
                <div className="text-[12px] font-bold">{exp.position}</div>
                <div className="text-[9px] text-[#999] italic whitespace-nowrap ml-2">
                  {exp.fromYear} - {exp.toYear ? exp.toYear : "Present"}
                </div>
              </div>
              <div className="text-[11px] text-[#666] mb-1">{exp.company}</div>
              {exp.description && (
                <p className="text-[10px] text-[#444] leading-[1.7] text-justify mt-2">
                  {exp.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* PROJECTS */}
      {personalPortfolio?.length > 0 && (
        <div className="mb-[30px]">
          <div className="text-[12px] font-bold uppercase tracking-[2px] mb-[15px]">
            Projects
          </div>
          {personalPortfolio.map((project: any, index: number) => (
            <div key={index} className="mb-5 pl-5 border-l-2 border-text-dark">
              <div className="text-[12px] font-bold">{project.name}</div>
              <p className="text-[10px] text-[#444] leading-[1.7] text-justify mt-2">
                {project.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* SKILLS */}
      {skills?.length > 0 && (
        <div className="mb-[30px]">
          <div className="text-[12px] font-bold uppercase tracking-[2px] mb-[15px]">
            Skills
          </div>
          <div className="flex flex-wrap gap-2.5">
            {skills.map((skill: any, index: number) => (
              <div
                key={index}
                className="text-[10px] p-[6px_12px] border border-[#1a1a1a] text-[#1a1a1a]"
              >
                {skill.name}
                {skill.level && (
                  <span className="text-[8px] text-[#666] ml-1.5 uppercase font-sans">
                    {skill.level}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EDUCATION */}
      {education?.length > 0 && (
        <div className="mb-[30px]">
          <div className="text-[12px] font-bold uppercase tracking-[2px] mb-[15px]">
            Education
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {education.map((edu: any, index: number) => (
              <div key={index} className="pl-5 border-l-2 border-text-dark">
                <div className="text-[12px] font-bold">{edu.institution}</div>
                <div className="text-[10px] text-[#666] mb-1">
                  {edu.degree}
                  {edu.major ? ` in ${edu.major}` : ""}
                </div>
                <div className="text-[9px] text-[#999] italic">
                  {edu.fromYear} - {edu.toYear ? edu.toYear : "Present"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ACHIEVEMENTS */}
      {achievements?.length > 0 && (
        <div className="mb-[30px]">
          <div className="text-[12px] font-bold uppercase tracking-[2px] mb-[15px]">
            Achievements
          </div>
          <ul className="pl-5 list-disc">
            {achievements.map((ach: any, index: number) => (
              <li
                key={index}
                className="text-[10px] text-[#444] leading-[1.7] mb-2"
              >
                <strong className="text-[#1a1a1a]">{ach.title}</strong>
                {ach.year && ` (${ach.year})`} - {ach.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
