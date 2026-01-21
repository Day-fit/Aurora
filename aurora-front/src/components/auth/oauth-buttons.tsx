"use client";

import { FaGithub, FaGoogle } from "react-icons/fa";
import { handleOAuthLogin } from "@/lib/utils/auth-helpers";

interface OAuthButtonsProps {
  action?: "sign in" | "sign up";
}

export default function OAuthButtons({ action = "sign in" }: OAuthButtonsProps) {
  const buttonClass =
    "flex items-center justify-center gap-3 px-6 py-2.5 border border-gray-700 rounded-lg bg-gray-800/30 hover:bg-gray-800 hover:border-gray-600 transition-all text-sm font-semibold";

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => handleOAuthLogin("google")}
        className={buttonClass}
      >
        <FaGoogle className="text-lg" />
        <span>Sign {action === "sign up" ? "up" : "in"} with Google</span>
      </button>
      <button
        type="button"
        onClick={() => handleOAuthLogin("github")}
        className={buttonClass}
      >
        <FaGithub className="text-lg" />
        <span>Sign {action === "sign up" ? "up" : "in"} with GitHub</span>
      </button>
    </div>
  );
}

export function FormDivider() {
  return (
    <div className="relative my-3">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-gray-700"></span>
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-main-dark px-2 text-text-dark/50">
          Or continue with
        </span>
      </div>
    </div>
  );
}

export function ErrorAlert({ message }: { message: string }) {
  return (
    <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg text-sm">
      {message}
    </div>
  );
}
