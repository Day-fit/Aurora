export function ResumeRoadmapElement({
  text,
  image,
  description,
}: {
  text: string;
  image?: string;
  description: string;
}) {
  return (
    <section className="flex flex-col md:flex-row items-center gap-8 p-8">
      <div className="flex justify-center items-center w-full md:w-1/2">
        {/* Replace this div with Next.js Image component */}
        <div className="w-full max-w-[400px] h-[200px] bg-gradient-to-br from-aurora-blue-dark to-aurora-green-dark rounded-xl flex items-center justify-center text-6xl shadow-lg">
          {image}
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full md:w-1/2">
        <h3 className="text-2xl font-bold text-aurora-green-dark">{text}</h3>
        <p className="text-text-dark text-opacity-90 leading-relaxed">
          {description}
        </p>
      </div>
    </section>
  );
}

export default function ResumeRoadmap() {
  const resumeSteps = [
    {
      id: 1,
      title: "Create Your Profile",
      description:
        "Set up your professional profile with basic information, contact details, and career objectives.",
      icon: "📝",
    },
    {
      id: 2,
      title: "Add Experience & Skills",
      description:
        "Input your work history, education, and showcase your technical and soft skills.",
      icon: "💼",
    },
    {
      id: 3,
      title: "Generate & Download",
      description:
        "Choose from professional templates and download your polished resume in PDF format.",
      icon: "⬇️",
    },
  ];

  return (
    <section id="how-it-works" className="text-text-dark py-16 px-6 md:px-10 scroll-mt-20">
      <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-aurora-blue-dark to-aurora-green-dark bg-clip-text text-transparent">
        How It Works
      </h2>
      <div className="flex flex-col gap-8 justify-center max-w-6xl mx-auto">
        {resumeSteps.map((step) => (
          <ResumeRoadmapElement
            key={step.id}
            text={step.title}
            description={step.description}
            image={step.icon}
          />
        ))}
      </div>
    </section>
  );
}
