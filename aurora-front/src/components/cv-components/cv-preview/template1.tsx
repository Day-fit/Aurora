export default function Template1({
  experience,
  profileImage,
  preview,
  name,
  surname,
  title,
  profileDescription,
  achievements,
  email,
  website,
  linkedIn,
  gitHub,
  education,
  skills,
}: any) {
  return (
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
                    .map((w: string) => w.charAt(0) + w.slice(1).toLowerCase())
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
  );
}
