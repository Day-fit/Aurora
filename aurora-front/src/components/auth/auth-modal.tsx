"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React from "react";
import { AuthModalProps, AuthMode } from "@/lib/types/auth";
import Image from "next/image";
import logo from "../../../public/aurora.png";

export default function AuthModal({ mode, children }: AuthModalProps) {
  const router = useRouter();

  return (
    <Dialog.Root
      defaultOpen
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          router.push("/");
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full blur-[100px] sm:blur-[120px] opacity-40 pointer-events-none"
            style={{
              background: "radial-gradient(circle at center, #6A5ACD, #000000)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 1.2 }}
          />
        </Dialog.Overlay>

        <Dialog.Content
          asChild
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-main-dark text-text-dark rounded-xl p-6 sm:p-8 shadow-2xl max-w-lg w-[95vw] sm:w-[90vw] max-h-[90vh] overflow-y-auto border border-gray-700"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="flex flex-col items-center mb-4 sm:mb-6">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-3 sm:mb-4 flex items-center justify-center">
                {/* Pulsing Glow Background */}
                <div className="absolute inset-0 bg-aurora-blue-dark/20 rounded-full animate-pulse blur-md" />

                {/* The Logo Container */}
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center overflow-hidden shadow-inner">
                  <Image
                    src={logo}
                    alt="Aurora Logo"
                    width={48}
                    height={48}
                    className="object-contain w-10 h-10 sm:w-12 sm:h-12"
                  />
                </div>
              </div>
              <Dialog.Title className="text-2xl sm:text-3xl font-bold text-heading-dark text-center">
                {mode === AuthMode.login ? "Welcome Back" : "Join Aurora"}
              </Dialog.Title>
              <p className="text-text-dark/60 text-center mt-2 text-sm sm:text-base">
                {mode === AuthMode.login
                  ? "Log in to continue your journey"
                  : "Create an account to get started"}
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">{children}</div>

            {/* Footer: Login button and Register text */}
            <div className="mt-4 sm:mt-6 flex flex-col items-center gap-2 text-center">
              <p className="text-xs sm:text-sm text-text-dark/70">
                {mode == AuthMode.register ? "You have " : "Don't have "}an
                account?{" "}
                <span
                  className="text-aurora-blue-dark hover:text-aurora-green-dark active:text-aurora-green-dark/70 cursor-pointer underline transition-colors"
                  onClick={() =>
                    router.push(
                      `/auth/${mode == AuthMode.login ? AuthMode.register : AuthMode.login}`,
                    )
                  }
                >
                  {/*later change to have a first letter in uppercase*/}
                  {mode == AuthMode.login ? "Sign up " : "Log in "}
                  here
                </span>
              </p>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
