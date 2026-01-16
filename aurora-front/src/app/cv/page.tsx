import Link from "next/link";
import { CvCard } from "@/components/cv-components/cv-card";
import { CvHeader } from "@/components/cv-components/cv-header";
import getAllResumes from "@/lib/backend/get-all-resumes";
import { AutogenerateButton } from "@/components/cv-components/autogenerate-button";

export const dynamic = "force-dynamic";

interface ResumeData {
  id: string;
  title: string;
  name: string;
  surname: string;
  profileImage?: string | null;
}

export default async function Page() {
  const myCvs = await getAllResumes();
  const createdCvs = myCvs.length > 0;

  return (
    <section className="rounded-xl p-4 sm:p-10 md:p-16 h-full min-h-[calc(60vh-80px)]">
      <div className="bg-main-dark/80 backdrop-blur-sm rounded-xl p-4 sm:p-8 md:p-12 flex flex-col md:flex-row gap-10 text-text-dark shadow-2xl items-center justify-center">
        {!createdCvs ? (
          <div className="flex flex-col items-center text-center md:w-1/2 space-y-6 mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              Create Your{" "}
              <span className="whitespace-nowrap bg-clip-text text-transparent bg-linear-to-r from-aurora-blue-dark via-aurora-green-dark to-aurora-blue-dark">
                First Resume
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-text-dark/80 max-w-prose leading-relaxed">
              Create your first professional resume with AuroraResume.
            </p>
            <div className="flex flex-col gap-4 mt-6 w-full max-w-xs">
              <Link
                href="/cv/create"
                className="flex flex-row items-center justify-center rounded-xl w-full px-6 py-3 bg-aurora-blue-dark text-white hover:scale-105 transform transition-all duration-200 font-semibold shadow-xl text-lg active:scale-95"
              >
                Create on your own
              </Link>
              <AutogenerateButton
                className="w-full px-6 py-3 bg-transparent border-2 border-aurora-green-dark text-text-dark hover:bg-aurora-green-dark hover:text-white hover:scale-105 transition-all duration-200 font-semibold rounded-lg text-lg active:scale-95"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col w-full gap-10">
            <CvHeader />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
              {myCvs.map((cv: ResumeData) => (
                <CvCard key={cv.id} id={cv.id} data={cv} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
