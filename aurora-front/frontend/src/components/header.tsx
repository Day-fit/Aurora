'use client';
import {useState} from "react";
import Button from "@/components/button";
import {FiMenu} from "react-icons/fi";
import PhoneNav from "@/components/phone-nav";
import Link from "next/link";


export default function Header({isLogged}: {isLogged: boolean}) {
    const [menu, setMenu] = useState(false);

    const toggleMenu = () => setMenu(!menu);

    return (
        <div className="sticky top-2 z-50">
            <header className="flex flex-row items-center justify-between m-2 rounded-2xl bg-main-dark text-text-dark p-3 shadow-md">
                <div className="flex flex-row items-center gap-2">
                    <img src="/logo.png" alt="logo" className="w-8 h-8" /> {/* Replace with actual logo and use next.js image*/}
                    <h1 className="text-heading-dark font-semibold text-lg">Aurora</h1>
                </div>

                {/* Hamburger menu - only visible on small screens */}
                <Button
                    className="md:hidden text-heading-dark bg-frame-dark p-2 rounded-md hover:bg-aurora-blue-dark transition-colors"
                    onClick={toggleMenu}
                    icon={<FiMenu />}
                />

                {/* Navigation - hidden on small screens, visible on md and up */}
                <nav className="hidden md:flex text-text-dark text-center justify-center">
                    <ul className="flex flex-row gap-6">
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

                {/* Auth buttons - hidden on small screens, visible on md and up */}
                <div className="hidden md:flex gap-4">
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
                            className="bg-frame-dark text-heading-dark hover:bg-aurora-green-dark transition-colors"
                        />
                    )}
                </div>
            </header>

            {/* Mobile menu - only shown when menu state is true, appears below header */}
            {menu && (<PhoneNav isLogged={isLogged}/>)}
        </div>
    );
}