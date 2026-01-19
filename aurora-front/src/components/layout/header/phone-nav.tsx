import Button from "@/components/button";
import Link from "next/link";
import { logout } from "@/lib/backend/logout";
import { ButtonType } from "@/lib/types/button";

export default function PhoneNav({ isLogged }: { isLogged: boolean }) {
  return (
    <aside className="flex flex-col m-2 rounded-2xl p-4 shadow-xl transition-all duration-300 md:hidden bg-main-dark text-text-dark animate-[slideDown_0.3s_ease-out]">
      <nav className="flex flex-col gap-2 text-center">
        <ul className="flex flex-col gap-2">
          <li>
            <Link
              href="/"
              className="block w-full py-2 px-4 rounded-lg hover:bg-white/5 active:bg-white/10 transition-colors"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/cv/create"
              className="block w-full py-2 px-4 rounded-lg hover:bg-white/5 active:bg-white/10 transition-colors"
            >
              Create
            </Link>
          </li>
          <li>
            <Link
              href="/cv"
              className="block w-full py-2 px-4 rounded-lg hover:bg-white/5 active:bg-white/10 transition-colors"
            >
              Edit
            </Link>
          </li>
        </ul>
      </nav>

      <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/10">
        {!isLogged ? (
          <>
            <Link
              href="/auth/login"
              className="block w-full py-2 px-4 text-center rounded-lg hover:bg-white/5 active:bg-white/10 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/auth/register"
              className="block w-full py-2 px-4 text-center rounded-lg bg-aurora-blue-dark text-white hover:bg-aurora-blue-dark/80 active:scale-95 transition-all"
            >
              Sign up
            </Link>
          </>
        ) : (
          <form action={logout}>
            <Button
              type={ButtonType.submit}
              text="Log out"
              className="w-full py-2 px-4 text-heading-dark hover:bg-white/5 active:bg-white/10"
            />
          </form>
        )}
      </div>
    </aside>
  );
}
