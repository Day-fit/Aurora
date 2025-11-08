import Button from "@/components/button";
import heroPicture from "@/../public/hero-picture.png"
import Image from "next/image";

export default function HeroSection() {
    return (
        <section className="bg-main-dark text-text-dark flex flex-col md:flex-row gap-10 p-10 md:p-16 items-center min-h-[calc(100vh-80px)]">
            <div className="md:w-1/2 space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                    Build Your Perfect Resume with <span className="text-aurora-blue-dark">AI-Powered</span> Guidance
                </h1>
                <p className="text-lg md:text-xl text-text-dark/80 leading-relaxed">
                    Transform your career journey with AuroraResume. Our intelligent platform guides you through every step of creating a professional, ATS-optimized resume that stands out to employers.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                    <Button
                        text="Get Started"
                        className="px-6 py-3 bg-aurora-blue-dark text-text-dark hover:bg-opacity-80 hover:scale-105 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl rounded-lg text-lg"
                    />
                    <Button
                        text="Learn More"
                        className="px-6 py-3 bg-transparent border-2 border-aurora-green-dark text-text-dark hover:bg-aurora-green-dark hover:scale-105 transition-all duration-200 font-semibold rounded-lg text-lg"
                    />
                </div>
            </div>
            <div className="flex justify-center items-center md:w-1/2">
                <Image
                    src={heroPicture}
                    alt="Professional resume creation illustration"
                    className="w-full max-w-lg h-auto rounded-lg shadow-2xl"
                    priority
                />
            </div>
        </section>
    )
}