"use client";
import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import AuthModal from "@/components/auth/auth-modal";
import { AuthMode } from "@/lib/types/auth";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  const mode = useMemo(() => {
    return pathname.includes("register") ? AuthMode.register : AuthMode.login;
  }, [pathname]);

  return <AuthModal mode={mode}>{children}</AuthModal>;
}
