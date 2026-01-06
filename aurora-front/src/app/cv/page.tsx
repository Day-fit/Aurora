import Button from "@/components/button";
import Link from "next/link";
import { CvCard } from "@/components/cv-components/cv-card";

export default function Page() {
  const createdCvs = true;

  const dawidData = {
    name: "Dawid",
    surname: "Kowalski",
    age: 29,
    title: "Software Engineer",
    email: "dawid.kowalski@example.com",
    website: "https://dawid.dev",
    linkedIn: "https://linkedin.com/in/dawidkowalski",
    gitHub: "https://github.com/dawidkowalski",
    //profileImage: "https://avatars.githubusercontent.com/u/10055274?v=4",
    profileDescription:
      "Doświadczony inżynier oprogramowania specjalizujący się w Kotlinie i systemach rozproszonych.",
    education: [
      {
        institution: "Politechnika Warszawska",
        major: "Informatyka",
        degree: "MASTER_DEGREE",
        fromYear: 2016,
        toYear: 2021,
      },
      {
        institution: "University of Helsinki",
        major: "Computer Science",
        degree: "BACHELOR_DEGREE",
        fromYear: 2013,
        toYear: 2016,
      },
    ],
    skills: [
      { name: "Kotlin", level: "ADVANCED" },
      { name: "Spring Boot", level: "ADVANCED" },
      { name: "Docker", level: "INTERMEDIATE" },
      { name: "PostgreSQL", level: "INTERMEDIATE" },
    ],
    experiences: [
      {
        company: "DayFit Sp. z o.o.",
        position: "Senior Backend Engineer",
        description:
          "Projektowanie i rozwój mikrousług w Kotlinie z użyciem Spring Boot.",
        startDate: "2022-01-15T00:00:00Z",
        endDate: null,
      },
      {
        company: "AuroraTech",
        position: "Software Developer",
        description:
          "Tworzenie API REST i integracji z systemami zewnętrznymi.",
        startDate: "2019-07-01T00:00:00Z",
        endDate: "2021-12-31T00:00:00Z",
      },
    ],
    achievements: [
      {
        title: "Employee of the Year",
        description: "Nagroda za wyjątkowe wyniki w projektach backendowych.",
        year: 2023,
      },
      {
        title: "Open Source Contributor",
        description:
          "Aktywny udział w projektach open-source w ekosystemie Kotlin.",
        year: null,
      },
    ],
    templateVersion: 1,
    enhanced: true,
  };

  const myCvs = [
    { id: "cv-1", data: dawidData },
    { id: "cv-2", data: dawidData },
  ];

  return (
    <section className="rounded-xl p-10 md:p-16 h-full min-h-[calc(60vh-80px)]">
      <div className="bg-main-dark/80 backdrop-blur-sm rounded-xl p-8 md:p-12 flex flex-col md:flex-row gap-10 text-text-dark shadow-2xl items-center justify-center">
        {!createdCvs ? (
          <div className="flex flex-col items-center text-center md:w-1/2 space-y-6 mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              Create Your{" "}
              <span className="whitespace-nowrap bg-clip-text text-transparent bg-linear-to-r from-aurora-blue-dark via-aurora-green-dark to-aurora-blue-dark">
                First Resume
              </span>
            </h1>
            <p className="text-lg md:text-xl text-text-dark/80 max-w-prose leading-relaxed">
              Create your first professional resume with AuroraResume. Our
              intelligent platform guides you through every step of creating a
              professional, ATS-optimized resume that stands out to employers.
            </p>
            <div className="flex flex-col gap-4 mt-6 w-full max-w-xs">
              <Link
                href="/cv/create"
                className={`flex flex-row items-center justify-center rounded-xl w-full px-6 py-3 bg-aurora-blue-dark text-white hover:scale-105 transform transition-all duration-200 font-semibold shadow-xl text-lg`}
              >
                Create on your own
              </Link>
              <Button
                text="Autogenerate with socials"
                className="w-full px-6 py-3 bg-transparent border-2 border-aurora-green-dark text-text-dark hover:bg-aurora-green-dark hover:text-white hover:scale-105 transition-all duration-200 font-semibold rounded-lg text-lg"
              />
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col w-full gap-10">
              <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full border-b border-white/5 pb-8 gap-6">
                <h1 className="text-4xl md:text-5xl lg:text-3xl font-extrabold leading-tight tracking-tighter">
                  Your{" "}
                  <span className="bg-clip-text text-transparent bg-linear-to-r from-aurora-blue-dark via-aurora-green-dark to-aurora-blue-dark">
                    CVs
                  </span>
                </h1>
                <Link
                  href="/cv/create"
                  className="group flex items-center gap-2 px-6 py-3 bg-aurora-blue-dark text-white hover:scale-105 transform transition-all duration-200 font-semibold shadow-xl rounded-lg text-lg"
                >
                  <span className="transition-transform group-hover:rotate-90">
                    +
                  </span>
                  Create New CV
                </Link>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                {myCvs.map((cv) => (
                  <CvCard key={cv.id} id={cv.id} data={cv.data} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
