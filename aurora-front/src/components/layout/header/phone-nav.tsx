import Button from "@/components/button";
import Link from "next/link";
import { ButtonType } from "@/lib/types/button";
import { logout } from "@/lib/backend/logout";

export default function PhoneNav({ isLogged }: { isLogged: boolean }) {
  return (
    <aside className="flex flex-col m-2 rounded-2xl p-4 shadow-xl transition-all md:hidden bg-main-dark text-text-dark">
      <nav className="flex flex-col gap-2 text-center">
        <ul className="flex flex-col gap-2">
          <li>
            <Link href="/" className="w-full block py-2 hover:text-aurora-green-dark transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link href="/cv/create" className="w-full block py-2 hover:text-aurora-green-dark transition-colors">
              Create
            </Link>
          </li>
          <li>
            <Link href="/cv" className="w-full block py-2 hover:text-aurora-green-dark transition-colors">
              Edit
            </Link>
          </li>
        </ul>
      </nav>

      <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/10">
        {!isLogged ? (
          <>
            <Link href="/auth/login" className="w-full text-center py-2 hover:text-aurora-blue-dark transition-colors">
              Log in
            </Link>
            <Link href="/auth/register" className="w-full text-center py-2 hover:text-aurora-blue-dark transition-colors">
              Sign up
            </Link>
          </>
        ) : (
          <form action={logout}>
            <Button 
              type={ButtonType.submit} 
              text="Log out" 
              className="w-full text-heading-dark py-2 px-4 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-all" 
            />
          </form>
        )}
      </div>
    </aside>
  );
}
