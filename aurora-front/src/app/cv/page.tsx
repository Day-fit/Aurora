import { CvCard } from "@/components/cv-components/cv-card";
import { CvHeader } from "@/components/cv-components/cv-header";
import { CvEmptyState } from "@/components/cv-components/cv-empty-state";
import getAllResumes from "@/lib/backend/get-all-resumes";

export const dynamic = "force-dynamic";

export default async function Page() {
  const myCvs = await getAllResumes();
  const createdCvs = myCvs.length > 0;

  return (
    <section className="rounded-xl p-4 sm:p-10 md:p-16 h-full min-h-[calc(60vh-80px)]">
      <div className="bg-main-dark/80 backdrop-blur-sm rounded-xl p-6 sm:p-8 md:p-12 flex flex-col md:flex-row gap-10 text-text-dark shadow-2xl items-center justify-center">
        {!createdCvs ? (
          <CvEmptyState />
        ) : (
          <div className="flex flex-col w-full gap-6 sm:gap-10">
            <CvHeader />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full">
              {myCvs.map((cv: any) => (
                <CvCard key={cv.id} id={cv.id} data={cv} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
