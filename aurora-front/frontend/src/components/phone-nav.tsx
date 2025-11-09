import Button from "@/components/button";
import Link from "next/link";

export default function PhoneNav({isLogged} : { isLogged: boolean }) {
    return (
        <aside className="flex flex-col m-4 rounded-2xl p-4 shadow-xl transition-all md:hidden bg-main-dark text-text-dark">
            <nav className="flex flex-col gap-2 text-center">
                <ul className="flex flex-col gap-2">
                    <li>
                        <Link href="#" className="w-full">Home</Link>
                    </li>
                    <li>
                        <Link href="#" className="w-full">Create</Link>
                    </li>
                    <li>
                        <Link href="#" className="w-full">Edit</Link>
                    </li>
                </ul>
            </nav>

            <div className="flex flex-col gap-2 mt-2">
                {!isLogged ? (
                    <>
                        <Button
                            text="Log in"
                            className="text-heading-dark"
                        />
                        <Button
                            text="Sign in"
                            className="text-heading-dark"
                        />
                    </>
                ) : (
                    <Button
                        text="Log out"
                        className="text-heading-dark"
                    />
                )}
            </div>
        </aside>
    )
}