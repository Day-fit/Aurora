"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React from "react";
import { AuthModalProps, AuthMode } from "@/lib/types/auth";

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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-40 pointer-events-none"
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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-main-dark text-text-dark rounded-xl p-8 shadow-2xl max-w-lg w-[90vw] max-h-[85vh] overflow-y-auto border border-gray-700"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <Dialog.Title className="text-3xl font-bold mb-2 text-heading-dark text-center">
              Welcome Back
            </Dialog.Title>
            <p className="text-text-dark/60 text-center mb-6">
              Log in to continue your journey
            </p>

            <div className="space-y-4">{children}</div>

            {/* Footer: Login button and Register text */}
            <div className="mt-6 flex flex-col items-center gap-2 text-center">
              <p className="text-sm text-text-dark/70">
                {mode == AuthMode.register ? "You have " : "Don't have "}an
                account?{" "}
                <span
                  className="text-aurora-blue-dark hover:text-aurora-green-dark cursor-pointer underline"
                  onClick={() =>
                    router.push(
                      `/auth/${mode == AuthMode.login ? AuthMode.register : AuthMode.login}`,
                    )
                  }
                >
                  {/*later change to have a first letter in uppercase*/}
                  {mode == AuthMode.login
                    ? AuthMode.register
                    : AuthMode.login}{" "}
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
