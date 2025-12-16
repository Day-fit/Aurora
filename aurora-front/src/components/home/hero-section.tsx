import Button from "@/components/button";
import heroPicture from "../../../public/hero-picture.png";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="rounded-xl p-10 md:p-16 min-h-[calc(100vh-80px)]">
      <div className="bg-main-dark/80 backdrop-blur-sm rounded-xl p-8 md:p-12 flex flex-col md:flex-row gap-10 items-center text-text-dark shadow-2xl">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
            Build Your Perfect Resume with{" "}
            <span className="whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-aurora-blue-dark via-aurora-green-dark to-aurora-blue-dark">
              AI-Powered
            </span>{" "}
            Guidance
          </h1>

          <p className="text-lg md:text-xl text-text-dark/80 max-w-prose leading-relaxed">
            Transform your career journey with AuroraResume. Our intelligent
            platform guides you through every step of creating a professional,
            ATS-optimized resume that stands out to employers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button
              text="Get Started"
              className="px-6 py-3 bg-aurora-blue-dark text-white hover:scale-105 transform transition-all duration-200 font-semibold shadow-xl rounded-lg text-lg"
            />
            <Button
              text="Learn More"
              className="px-6 py-3 bg-transparent border-2 border-aurora-green-dark text-text-dark hover:bg-aurora-green-dark hover:text-white hover:scale-105 transition-all duration-200 font-semibold rounded-lg text-lg"
            />
          </div>
        </div>

        <div className="flex justify-center items-center md:w-1/2">
          <div className="relative w-full max-w-lg rounded-xl shadow-2xl p-4 bg-gradient-to-tr from-white/3 to-white/5 backdrop-blur-sm transform transition-all duration-500 hover:scale-105 hover:-translate-y-2">
            <Image
              src={heroPicture}
              alt="Professional resume creation illustration"
              className="w-full h-auto rounded-lg"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
