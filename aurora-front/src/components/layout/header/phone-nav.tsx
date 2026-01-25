"use client";

import Button from "@/components/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/backend/logout";
import { ButtonType } from "@/lib/types/button";
import { FiX } from "react-icons/fi";

interface PhoneNavProps {
  isLogged: boolean;
  onClose?: () => void;
}

export default function PhoneNav({ isLogged, onClose }: PhoneNavProps) {
  const pathname = usePathname();

  const handleLinkClick = () => {
    onClose?.();
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="flex flex-col m-2 rounded-2xl p-4 shadow-xl transition-all duration-300 md:hidden bg-main-dark text-text-dark animate-[slideDown_0.3s_ease-out]">
      {/* Close button */}
      <button
        onClick={onClose}
        className="self-end p-2 rounded-lg hover:bg-white/5 active:bg-white/10 transition-colors mb-2"
        aria-label="Close menu"
      >
        <FiX className="w-5 h-5" />
      </button>

      <nav className="flex flex-col gap-2 text-center">
        <ul className="flex flex-col gap-2">
          <li>
            <Link
              href="/"
              onClick={handleLinkClick}
              className={`block w-full py-3 px-4 rounded-lg transition-colors ${
                isActive("/")
                  ? "bg-aurora-blue-dark/20 text-aurora-blue-dark font-medium"
                  : "hover:bg-white/5 active:bg-white/10"
              }`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/cv"
              onClick={handleLinkClick}
              className={`block w-full py-3 px-4 rounded-lg transition-colors ${
                isActive("/cv") && !pathname.includes("/create")
                  ? "bg-aurora-blue-dark/20 text-aurora-blue-dark font-medium"
                  : "hover:bg-white/5 active:bg-white/10"
              }`}
            >
              Your CVs
            </Link>
          </li>
          <li>
            <Link
              href="/cv/create"
              onClick={handleLinkClick}
              className={`block w-full py-3 px-4 rounded-lg transition-colors ${
                isActive("/cv/create")
                  ? "bg-aurora-blue-dark/20 text-aurora-blue-dark font-medium"
                  : "hover:bg-white/5 active:bg-white/10"
              }`}
            >
              Create CV
            </Link>
          </li>
        </ul>
      </nav>

      <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/10">
        {!isLogged ? (
          <>
            <Link
              href="/auth/login"
              onClick={handleLinkClick}
              className="block w-full py-3 px-4 text-center rounded-lg hover:bg-white/5 active:bg-white/10 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/auth/register"
              onClick={handleLinkClick}
              className="block w-full py-3 px-4 text-center rounded-lg bg-aurora-blue-dark text-white hover:bg-aurora-blue-dark/80 active:scale-95 transition-all font-medium"
            >
              Sign up
            </Link>
          </>
        ) : (
          <form action={logout}>
            <Button
              type={ButtonType.submit}
              text="Log out"
              className="w-full py-3 px-4 text-heading-dark hover:bg-white/5 active:bg-white/10"
            />
          </form>
        )}
      </div>
    </aside>
  );
}
