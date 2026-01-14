"use client";

import { usePathname } from "next/navigation";
import Footer from "./footer";

export default function FooterWrapper() {
  const pathname = usePathname();

  const hiddenPaths = ["/auth/login", "/auth/register", "/cv/create"];

  if (hiddenPaths.includes(pathname)) {
    return null;
  }

  return <Footer />;
}
