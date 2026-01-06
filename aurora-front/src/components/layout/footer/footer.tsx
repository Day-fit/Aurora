import Image from "next/image";
import Link from "next/link";
import logo from "@/../public/aurora.png";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/5 bg-main-dark text-text-dark relative overflow-hidden w-full">
      {/* Background Glow Effect */}
      <div className="pointer-events-none absolute -right-24 -bottom-10 w-64 h-64 rounded-full bg-aurora-blue-dark/10 blur-3xl" />

      <div className="max-w-[1440px] mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 text-center md:text-left">
          {/* Brand Section */}
          <div className="col-span-1 sm:col-span-2 md:col-span-1 flex flex-col items-center md:items-start space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Image
                src={logo}
                alt="Aurora logo"
                width={36}
                height={36}
                className="w-8 h-8 md:w-9 md:h-9"
              />
              <span className="text-heading-dark font-bold text-2xl tracking-tight">
                Aurora
              </span>
            </Link>
            <p className="text-sm md:text-base text-text-dark/60 leading-relaxed max-w-xs">
              Empowering your career journey with AI-driven resume building.
              Professional, ATS-friendly, and uniquely yours.
            </p>
            <div className="flex gap-5 pt-2">
              <a
                href="#"
                className="text-text-dark/60 hover:text-aurora-blue-dark transition-colors transform hover:scale-110"
              >
                <FaGithub size={22} />
              </a>
              <a
                href="#"
                className="text-text-dark/60 hover:text-aurora-blue-dark transition-colors transform hover:scale-110"
              >
                <FaTwitter size={22} />
              </a>
              <a
                href="#"
                className="text-text-dark/60 hover:text-aurora-blue-dark transition-colors transform hover:scale-110"
              >
                <FaLinkedin size={22} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-heading-dark font-semibold mb-6 uppercase tracking-wider text-sm">
              Product
            </h3>
            <ul className="space-y-3 text-sm md:text-base text-text-dark/70">
              <li>
                <Link
                  href="/cv/create"
                  className="hover:text-aurora-green-dark transition-colors"
                >
                  Create Resume
                </Link>
              </li>
              <li>
                <Link
                  href="/cv"
                  className="hover:text-aurora-green-dark transition-colors"
                >
                  Manage CVs
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-aurora-green-dark transition-colors"
                >
                  Templates
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-aurora-green-dark transition-colors"
                >
                  AI Writer
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-heading-dark font-semibold mb-6 uppercase tracking-wider text-sm">
              Support
            </h3>
            <ul className="space-y-3 text-sm md:text-base text-text-dark/70">
              <li>
                <Link
                  href="#"
                  className="hover:text-aurora-blue-dark transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-aurora-blue-dark transition-colors"
                >
                  Career Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-aurora-blue-dark transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-aurora-blue-dark transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs md:text-sm text-text-dark/40">
          <p className="order-2 md:order-1">
            © {new Date().getFullYear()}{" "}
            <span className="text-text-dark/60 font-medium">AuroraResume</span>.
            All rights reserved.
          </p>
          <div className="flex gap-6 order-1 md:order-2">
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
