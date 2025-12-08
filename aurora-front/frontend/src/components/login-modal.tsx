"use client";

import LoginForm from "@/components/login-form";
import * as Dialog from "@radix-ui/react-dialog";

export default function LoginDialog() {

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <button className="px-4 py-2 bg-aurora-blue-dark text-white rounded hover:bg-aurora-green-dark transition">
                    Log in
                </button>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-main-dark text-text-dark rounded-lg p-8 shadow-2xl max-w-md w-[90vw] max-h-[85vh] overflow-y-auto">
                    <Dialog.Close asChild>
                        <button
                            className="absolute right-4 top-4 text-text-dark/70 hover:text-text-dark text-xl transition"
                            aria-label="Close"
                        >
                            ✕
                        </button>
                    </Dialog.Close>

                    <Dialog.Title className="text-2xl font-bold mb-6 text-heading-dark">
                        Login
                    </Dialog.Title>

                    <LoginForm />
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
