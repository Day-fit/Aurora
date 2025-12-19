import Button from "@/components/button";
import { FiMenu } from "react-icons/fi";
import PhoneNav from "@/components/layout/header/phone-nav";
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

  console.log(isLogged);

  return (
    <div className="sticky top-2 z-50">
      <input type="checkbox" id="mobile-menu-toggle" className="peer hidden" />

      <header className="flex flex-row items-center justify-between m-2 rounded-2xl bg-main-dark text-text-dark p-3 shadow-md pointer-events-auto relative z-50">
        <Link
          href="/"
          className="flex flex-row items-center gap-2"
          aria-label="Aurora logo"
        >
          <div className="flex flex-row items-center gap-2">
            <Image
              src={logo}
              alt="Aurora logo"
              width={40}
              height={40}
              priority
            />{" "}
            <h1 className="text-heading-dark font-semibold text-lg">Aurora</h1>
          </div>
        </Link>

        {/* Hamburger menu - acting as label for the checkbox */}
        <label
          htmlFor="mobile-menu-toggle"
          className="md:hidden text-heading-dark bg-frame-dark p-2 rounded-md hover:bg-aurora-blue-dark transition-colors cursor-pointer flex items-center justify-center"
        >
          <FiMenu />
        </label>

        <nav className="hidden md:flex text-text-dark text-center justify-center">
          <ul className="flex flex-row gap-6">
            <li>
              <Link href="/" className="w-full">
                Home
              </Link>
            </li>
            <li>
              <Link href="/cv/create" className="w-full">
                Create
              </Link>
            </li>
            <li>
              <Link href="/cv" className="w-full">
                Edit
              </Link>
            </li>
          </ul>
        </nav>

        <div className="hidden md:flex gap-4">
          {!isLogged ? (
            <>
              <Link href="/auth/login" className="w-full">
                Log in
              </Link>
              <Link href="/auth/register" className="w-full">
                Sign in
              </Link>
            </>
          ) : (
            <form action={logout}>
              <Button type={ButtonType.submit} text="Log out" />
            </form>
          )}
        </div>
      </header>

      <div className="hidden peer-checked:block">
        <PhoneNav isLogged={isLogged} />
      </div>
    </div>
  );
}
