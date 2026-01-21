export default function Template4({ formData }: any) {
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
    <div className="h-full bg-linear-to-br from-[#667eea] to-[#764ba2] p-2.5 box-border overflow-y-auto font-sans">
      <div className="bg-white p-[30px] min-h-full rounded-sm">
        {/* HEADER */}
        <div className="flex items-center mb-[30px] pb-5 border-b-[3px] border-[#667eea]">
          {profileImage && (
            <img
              src={profileImage}
              alt="Profile"
              className="w-[120px] h-[120px] rounded-[10px] border-4 border-[#667eea] object-cover mr-[25px] shrink-0"
            />
          )}
          <div className="flex-1">
            <h1 className="text-[30px] font-extrabold text-[#667eea] m-0 tracking-[1px] leading-tight">
              {name} {surname}
            </h1>
            <h2 className="text-[16px] font-normal text-[#764ba2] mt-2 mb-3">
              {title}
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {email && (
                <div className="text-[9px] px-2.5 py-1.5 bg-[#f0f0ff] rounded-[15px] text-[#667eea] border border-[#667eea]">
                  📧 {email}
                </div>
              )}
              {website && (
                <div className="text-[9px] px-2.5 py-1.5 bg-[#f0f0ff] rounded-[15px] text-[#667eea] border border-[#667eea]">
                  🌐{" "}
                  <a href={website} target="_blank" className="hover:underline">
                    Website
                  </a>
                </div>
              )}
              {linkedIn && (
                <div className="text-[9px] px-2.5 py-1.5 bg-[#f0f0ff] rounded-[15px] text-[#667eea] border border-[#667eea]">
                  🔗{" "}
                  <a
                    href={linkedIn}
                    target="_blank"
                    className="hover:underline"
                  >
                    LinkedIn
                  </a>
                </div>
              )}
              {gitHub && (
                <div className="text-[9px] px-2.5 py-1.5 bg-[#f0f0ff] rounded-[15px] text-[#667eea] border border-[#667eea]">
                  🐱{" "}
                  <a href={gitHub} target="_blank" className="hover:underline">
                    GitHub
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ABOUT */}
        {profileDescription && (
          <div className="mb-[25px]">
            <div className="text-[14px] font-extrabold text-white bg-linear-to-r from-[#667eea] to-[#764ba2] px-[15px] py-2 mb-[15px] rounded-[5px] uppercase tracking-[1.5px]">
              About Me
            </div>
            <p className="text-[11px] leading-[1.7] text-[#555] text-justify bg-[#f9f9f9] p-[15px] rounded-lg border-l-4 border-[#667eea]">
              {profileDescription}
            </p>
          </div>
        )}

        <div className="flex gap-[25px]">
          {/* MAIN COLUMN */}
          <div className="flex-[1.5]">
            {experience?.length > 0 && (
              <div className="mb-[25px]">
                <div className="text-[14px] font-extrabold text-white bg-linear-to-r from-[#667eea] to-[#764ba2] px-[15px] py-2 mb-[15px] rounded-[5px] uppercase tracking-[1.5px]">
                  Work Experience
                </div>
                {experience.map((exp: any, index: number) => (
                  <div
                    key={index}
                    className="mb-[18px] p-[15px] bg-[#f9f9f9] rounded-lg border-l-4 border-[#764ba2]"
                  >
                    <div className="text-[12px] font-bold text-[#667eea] mb-1">
                      {exp.position}
                    </div>
                    <div className="text-[11px] font-semibold text-[#764ba2] mb-1">
                      {exp.company}
                    </div>
                    <div className="text-[9px] italic text-[#999] mb-2">
                      {exp.fromYear} - {exp.toYear ? exp.toYear : "Present"}
                    </div>
                    {exp.description && (
                      <p className="text-[10px] leading-[1.6] text-[#555] text-justify">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {personalPortfolio?.length > 0 && (
              <div className="mb-[25px]">
                <div className="text-[14px] font-extrabold text-white bg-linear-to-r from-[#667eea] to-[#764ba2] px-[15px] py-2 mb-[15px] rounded-[5px] uppercase tracking-[1.5px]">
                  Featured Projects
                </div>
                {personalPortfolio.map((project: any, index: number) => (
                  <div
                    key={index}
                    className="mb-[18px] p-[15px] bg-[#f9f9f9] rounded-lg border-l-4 border-[#764ba2]"
                  >
                    <div className="text-[12px] font-bold text-[#667eea] mb-1">
                      {project.name}
                    </div>
                    <p className="text-[10px] leading-[1.6] text-[#555] text-justify">
                      {project.description}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {achievements?.length > 0 && (
              <div className="mb-[25px]">
                <div className="text-[14px] font-extrabold text-white bg-linear-to-r from-[#667eea] to-[#764ba2] px-[15px] py-2 mb-[15px] rounded-[5px] uppercase tracking-[1.5px]">
                  Achievements
                </div>
                <ul className="list-disc pl-5">
                  {achievements.map((ach: any, index: number) => (
                    <li
                      key={index}
                      className="text-[10px] leading-[1.6] mb-2.5 text-[#555]"
                    >
                      <strong className="text-[#667eea] font-bold">
                        {ach.title}
                      </strong>
                      {ach.year && ` (${ach.year})`} - {ach.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* SIDE COLUMN */}
          <div className="flex-1">
            {skills?.length > 0 && (
              <div className="mb-[25px]">
                <div className="text-[14px] font-extrabold text-white bg-linear-to-r from-[#667eea] to-[#764ba2] px-[15px] py-2 mb-[15px] rounded-[5px] uppercase tracking-[1.5px]">
                  Skills
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill: any, index: number) => (
                    <div
                      key={index}
                      className="text-[9px] px-3 py-1.5 bg-linear-to-br from-[#667eea] to-[#764ba2] text-white rounded-[20px] font-semibold"
                    >
                      {skill.name}
                      {skill.level && (
                        <span className="text-[8px] opacity-90 ml-1 italic">
                          {skill.level}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {education?.length > 0 && (
              <div className="mb-[25px]">
                <div className="text-[14px] font-extrabold text-white bg-linear-to-r from-[#667eea] to-[#764ba2] px-[15px] py-2 mb-[15px] rounded-[5px] uppercase tracking-[1.5px]">
                  Education
                </div>
                {education.map((edu: any, index: number) => (
                  <div
                    key={index}
                    className="mb-[15px] p-3 bg-[#f0f0ff] rounded-lg border border-[#667eea]"
                  >
                    <div className="text-[11px] font-bold text-[#667eea] mb-1">
                      {edu.institution}
                    </div>
                    <div className="text-[10px] font-semibold text-[#764ba2] mb-1">
                      {edu.degree}
                      {edu.major ? ` in ${edu.major}` : ""}
                    </div>
                    <div className="text-[9px] text-[#999] italic">
                      {edu.fromYear} - {edu.toYear ? edu.toYear : "Present"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
