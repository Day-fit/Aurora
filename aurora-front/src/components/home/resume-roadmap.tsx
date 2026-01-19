"use client";

import { motion } from "framer-motion";

export function ResumeRoadmapElement({
  text,
  image,
  description,
  index,
}: {
  text: string;
  image?: string;
  description: string;
  index: number;
}) {
  return (
    <motion.section
      className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 p-4 sm:p-8 group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
    >
      <div className="flex justify-center items-center w-full md:w-1/2">
        <motion.div
          className="w-full max-w-[400px] h-[180px] sm:h-[200px] bg-gradient-to-br from-aurora-blue-dark to-aurora-green-dark rounded-xl flex items-center justify-center text-5xl sm:text-6xl shadow-lg group-hover:shadow-aurora-blue-dark/20 transition-shadow duration-300"
          whileHover={{ scale: 1.02, rotate: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {image}
        </motion.div>
      </div>
      <div className="flex flex-col gap-3 sm:gap-4 w-full md:w-1/2 text-center md:text-left">
        <h3 className="text-xl sm:text-2xl font-bold text-aurora-green-dark">{text}</h3>
        <p className="text-text-dark text-opacity-90 leading-relaxed text-sm sm:text-base">
          {description}
        </p>
      </div>
    </motion.section>
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
    <section id="how-it-works" className="text-text-dark py-12 sm:py-16 px-4 sm:px-6 md:px-10">
      <motion.h2
        className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 bg-gradient-to-r from-aurora-blue-dark to-aurora-green-dark bg-clip-text text-transparent"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        How It Works
      </motion.h2>
      <div className="flex flex-col gap-4 sm:gap-8 justify-center max-w-6xl mx-auto">
        {resumeSteps.map((step, index) => (
          <ResumeRoadmapElement
            key={step.id}
            text={step.title}
            description={step.description}
            image={step.icon}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
