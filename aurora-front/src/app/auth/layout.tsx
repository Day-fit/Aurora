"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AuthModal from "@/components/auth/auth-modal";
import { AuthMode } from "@/lib/types/auth";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mode, setMode] = useState<AuthMode>(AuthMode.login);

  useEffect(() => {
    if (pathname.includes("register")) {
      setMode(AuthMode.register);
    } else {
      setMode(AuthMode.login);
    }
  }, [pathname]);

  return <AuthModal mode={mode}>{children}</AuthModal>;
}
