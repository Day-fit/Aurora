"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { revalidateHeader } from "@/lib/backend/revalidate";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get the mode (login or register) and the original redirect destination
  const mode = searchParams.get("mode") || "login";
  const redirectTo = searchParams.get("redirectTo") || "/";

  useEffect(() => {
    let isMounted = true;

    const checkStatus = async () => {
      try {
        const response = await fetch("/api/proxy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            endpoint: "/api/v1/auth/refresh",
            method: "POST",
          }),
        });

        if (!isMounted) return;

        if (response.ok) {
          await revalidateHeader();
          router.push(redirectTo);
        } else {
          // Send them back to either /auth/login or /auth/register
          router.push(`/auth/${mode}?error=OAuthFailed`);
        }
      } catch (error) {
        if (!isMounted) return;
        console.error("Auth callback failed", error);
        router.push(`/auth/${mode}?error=ConnectionError`);
      }
    };

    // void is used to explicitly mark the promise as ignored/handled
    void checkStatus();

    return () => {
      isMounted = false;
    };
  }, [router, mode, redirectTo]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-aurora-green-dark"></div>
      <p className="text-lg font-medium text-white">
        {mode === "register"
          ? "Creating your account..."
          : "Completing login..."}
      </p>
    </div>
  );
}
