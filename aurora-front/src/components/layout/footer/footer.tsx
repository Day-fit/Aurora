import Image from "next/image";
import Link from "next/link";
import logo from "@/../public/aurora.png";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mt-12 sm:mt-20 border-t border-white/5 bg-main-dark text-text-dark relative overflow-hidden w-full">
      {/* Background Glow Effect */}
      <div className="pointer-events-none absolute -right-24 -bottom-10 w-64 h-64 rounded-full bg-aurora-blue-dark/10 blur-3xl" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-10 sm:py-12 md:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 text-center md:text-left">
          {/* Brand Section */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1 flex flex-col items-center md:items-start space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity active:scale-95"
            >
              <Image
                src={logo}
                alt="Aurora logo"
                width={36}
                height={36}
                className="w-8 h-8 md:w-9 md:h-9"
              />
              <span className="text-heading-dark font-bold text-xl sm:text-2xl tracking-tight">
                Aurora
              </span>
            </Link>
            <p className="text-xs sm:text-sm md:text-base text-text-dark/60 leading-relaxed max-w-xs">
              Empowering your career journey with AI-driven resume building.
              Professional, ATS-friendly, and uniquely yours.
            </p>
            <div className="flex gap-4 sm:gap-5 pt-2">
              <a
                href="https://github.com/Day-fit/Aurora"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-dark/60 hover:text-aurora-blue-dark transition-colors transform hover:scale-110 active:scale-95"
                aria-label="GitHub"
              >
                <FaGithub size={20} className="sm:w-[22px] sm:h-[22px]" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-dark/60 hover:text-aurora-blue-dark transition-colors transform hover:scale-110 active:scale-95"
                aria-label="Twitter"
              >
                <FaTwitter size={20} className="sm:w-[22px] sm:h-[22px]" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-dark/60 hover:text-aurora-blue-dark transition-colors transform hover:scale-110 active:scale-95"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={20} className="sm:w-[22px] sm:h-[22px]" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-heading-dark font-semibold mb-4 sm:mb-6 uppercase tracking-wider text-xs sm:text-sm">
              Product
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm md:text-base text-text-dark/70">
              <li>
                <Link
                  href="/cv/create"
                  className="hover:text-aurora-green-dark active:text-aurora-green-dark/70 transition-colors"
                >
                  Create Resume
                </Link>
              </li>
              <li>
                <Link
                  href="/cv"
                  className="hover:text-aurora-green-dark active:text-aurora-green-dark/70 transition-colors"
                >
                  Manage CVs
                </Link>
              </li>
              <li>
                <Link
                  href="/#templates"
                  className="hover:text-aurora-green-dark active:text-aurora-green-dark/70 transition-colors"
                >
                  Templates
                </Link>
              </li>
              <li>
                <Link
                  href="/cv/create"
                  className="hover:text-aurora-green-dark active:text-aurora-green-dark/70 transition-colors"
                >
                  AI Writer
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-heading-dark font-semibold mb-4 sm:mb-6 uppercase tracking-wider text-xs sm:text-sm">
              Support
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm md:text-base text-text-dark/70">
              <li>
                <Link
                  href="https://github.com/Day-fit/Aurora"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-aurora-blue-dark active:text-aurora-blue-dark/70 transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/Day-fit/Aurora"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-aurora-blue-dark active:text-aurora-blue-dark/70 transition-colors"
                >
                  Career Blog
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/Day-fit/Aurora"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-aurora-blue-dark active:text-aurora-blue-dark/70 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/Day-fit/Aurora"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-aurora-blue-dark active:text-aurora-blue-dark/70 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 text-xs md:text-sm text-text-dark/40">
          <p className="order-2 md:order-1 text-center">
            © {new Date().getFullYear()}{" "}
            <span className="text-text-dark/60 font-medium">AuroraResume</span>.
            All rights reserved.
          </p>
          <div className="flex gap-4 sm:gap-6 order-1 md:order-2">
            <span className="hover:text-text-dark/60 cursor-default transition-colors">
              Built with AI Guidance
            </span>
            <span className="hover:text-text-dark/60 cursor-default transition-colors">
              Global Platform
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
