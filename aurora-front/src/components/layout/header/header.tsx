import Button from "@/components/button";
import MobileMenuWrapper from "@/components/layout/header/mobile-menu-wrapper";
import Link from "next/link";
import { isLoggedInServer } from "@/lib/backend/auth";
import Image from "next/image";
import logo from "@/../public/aurora.png";
import { ButtonType } from "@/lib/types/button";
import { logout } from "@/lib/backend/logout";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Header() {
  const isLogged = await isLoggedInServer();

  return (
    <div className="sticky top-2 z-50">
      <header className="flex flex-row items-center justify-between m-2 rounded-2xl bg-main-dark text-text-dark p-3 shadow-md pointer-events-auto relative z-50">
        <Link
          href="/"
          className="flex flex-row items-center gap-2 hover:opacity-80 active:scale-95 transition-all"
          aria-label="Aurora logo"
        >
          <div className="flex flex-row items-center gap-2">
            <Image
              src={logo}
              alt="Aurora logo"
              width={40}
              height={40}
              priority
              className="w-8 h-8 sm:w-10 sm:h-10"
            />{" "}
            <h1 className="text-heading-dark font-semibold text-base sm:text-lg">Aurora</h1>
          </div>
        </Link>

        {/* Mobile menu */}
        <MobileMenuWrapper isLogged={isLogged} />

        <nav className="hidden md:flex text-text-dark text-center justify-center">
          <ul className="flex flex-row gap-6">
            <li>
              <Link
                href="/"
                className="py-1 px-2 rounded-md hover:text-aurora-blue-dark hover:bg-white/5 active:bg-white/10 transition-all"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/cv"
                className="py-1 px-2 rounded-md hover:text-aurora-blue-dark hover:bg-white/5 active:bg-white/10 transition-all"
              >
                Your Cvs
              </Link>
            </li>
          </ul>
        </nav>

        <div className="hidden md:flex gap-4 items-center">
          {!isLogged ? (
            <>
              <Link
                href="/auth/login"
                className="py-1 px-3 rounded-md hover:text-aurora-blue-dark hover:bg-white/5 active:bg-white/10 transition-all"
              >
                Log in
              </Link>
              <Link
                href="/auth/register"
                className="whitespace-nowrap py-2 px-4 bg-aurora-blue-dark text-white rounded-lg hover:bg-aurora-blue-dark/80 active:scale-95 transition-all font-medium"
              >
                Sign up
              </Link>
            </>
          ) : (
            <form action={logout}>
              <Button
                type={ButtonType.submit}
                text="Log out"
                className="py-2 px-4 hover:text-aurora-blue-dark hover:bg-white/5 active:bg-white/10"
              />
            </form>
          )}
        </div>
      </header>
    </div>
  );
}
