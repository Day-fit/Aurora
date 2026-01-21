export default function Template2({ formData }: any) {
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
    <div className="flex flex-col h-full bg-white border border-gray-300 rounded-lg overflow-hidden font-sans text-[#2c3e50]">
      {/* HEADER */}
      <div className="bg-linear-to-br from-[#667eea] to-[#764ba2] text-white p-10 text-center">
        {profileImage && (
          <img
            src={profileImage}
            alt="Profile"
            className="w-[120px] h-[120px] rounded-full border-[5px] border-white mx-auto mb-4 object-cover"
          />
        )}
        <h1 className="text-[32px] font-bold m-0 tracking-[2px] uppercase">
          {name} {surname}
        </h1>
        <h2 className="text-[18px] font-light mt-2 opacity-95">{title}</h2>
      </div>

      {/* CONTACT BAR */}
      <div className="bg-[#f8f9fa] py-4 px-[30px] flex justify-center flex-wrap gap-5 border-b-2 border-[#667eea]">
        {email && (
          <div className="text-[10px] text-[#555]">
            📧 <span className="ml-1">{email}</span>
          </div>
        )}
        {website && (
          <div className="text-[10px] text-[#555]">
            🌐{" "}
            <a href={website} target="_blank" className="ml-1 hover:underline">
              Portfolio
            </a>
          </div>
        )}
        {linkedIn && (
          <div className="text-[10px] text-[#555]">
            🔗{" "}
            <a href={linkedIn} target="_blank" className="ml-1 hover:underline">
              LinkedIn
            </a>
          </div>
        )}
        {gitHub && (
          <div className="text-[10px] text-[#555]">
            🐱{" "}
            <a href={gitHub} target="_blank" className="ml-1 hover:underline">
              GitHub
            </a>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-[30px] flex gap-[30px]">
        {/* MAIN COLUMN */}
        <div className="flex-2">
          {profileDescription && (
            <div className="mb-6">
              <div className="text-[14px] font-bold text-[#667eea] uppercase tracking-[1.5px] mb-[15px] pb-2 border-b-3 border-[#667eea]">
                Professional Summary
              </div>
              <p className="text-[11px] leading-[1.7] text-[#555] text-justify">
                {profileDescription}
              </p>
            </div>
          )}

          {experience?.length > 0 && (
            <div className="mb-6">
              <div className="text-[14px] font-bold text-[#667eea] uppercase tracking-[1.5px] mb-[15px] pb-2 border-b-3 border-[#667eea]">
                Work Experience
              </div>
              {experience.map((exp: any, index: number) => (
                <div key={index} className="mb-[18px]">
                  <div className="text-[12px] font-bold text-[#2c3e50] mb-[3px]">
                    {exp.position}
                  </div>
                  <div className="text-[11px] font-semibold text-[#667eea] mb-[3px]">
                    {exp.company}
                  </div>
                  <div className="text-[9px] italic text-[#7f8c8d] mb-[5px]">
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
            <div className="mb-6">
              <div className="text-[14px] font-bold text-[#667eea] uppercase tracking-[1.5px] mb-[15px] pb-2 border-b-3 border-[#667eea]">
                Featured Projects
              </div>
              {personalPortfolio.map((project: any, index: number) => (
                <div key={index} className="mb-[18px]">
                  <div className="text-[12px] font-bold text-[#2c3e50] mb-[3px]">
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
            <div className="mb-6">
              <div className="text-[14px] font-bold text-[#667eea] uppercase tracking-[1.5px] mb-[15px] pb-2 border-b-3 border-[#667eea]">
                Achievements & Awards
              </div>
              <ul className="list-disc pl-[18px]">
                {achievements.map((ach: any, index: number) => (
                  <li
                    key={index}
                    className="text-[10px] leading-normal mb-1.5 text-[#555]"
                  >
                    <span className="font-bold">{ach.title}</span>
                    {ach.year && ` (${ach.year})`} - {ach.description}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* SIDE COLUMN */}
        <div className="flex-1 bg-[#f8f9fa] p-5 rounded-lg h-fit">
          {skills?.length > 0 && (
            <div className="mb-6">
              <div className="text-[12px] font-bold text-[#764ba2] uppercase tracking-[1.5px] mb-[15px] pb-2 border-b-2 border-[#764ba2]">
                Skills
              </div>
              {skills.map((skill: any, index: number) => (
                <div
                  key={index}
                  className="bg-white p-[8px_12px] mb-2 rounded border-l-3 border-[#764ba2] text-[10px]"
                >
                  {skill.name}
                  {skill.level && (
                    <span className="text-[9px] text-[#7f8c8d] font-semibold ml-2">
                      {skill.level.charAt(0).toUpperCase() +
                        skill.level.slice(1).toLowerCase()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {education?.length > 0 && (
            <div className="mb-6">
              <div className="text-[12px] font-bold text-[#764ba2] uppercase tracking-[1.5px] mb-[15px] pb-2 border-b-2 border-[#764ba2]">
                Education
              </div>
              {education.map((edu: any, index: number) => (
                <div key={index} className="mb-[18px]">
                  <div className="text-[12px] font-bold text-[#2c3e50] mb-[3px]">
                    {edu.institution}
                  </div>
                  <div className="text-[10px] font-semibold text-[#2c3e50]">
                    {edu.degree}
                    {edu.major ? ` in ${edu.major}` : ""}
                  </div>
                  <div className="text-[9px] italic text-[#7f8c8d] mb-[5px]">
                    {edu.fromYear} - {edu.toYear ? edu.toYear : "Present"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
