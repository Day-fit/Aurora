"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { RegisterSchema, RegisterValues } from "@/lib/types/register";
import Input from "@/components/input";
import Button from "@/components/button";
import { ButtonType } from "@/lib/types/button";
import * as Dialog from "@radix-ui/react-dialog";

export default function RegisterForm() {
    const method = useForm<RegisterValues>({
        mode: "onSubmit",
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            identifier: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: RegisterValues) => {
        try {
            const result = await registerUser({
                identifier: data.identifier,
                email: data.email,
                password: data.password,
            });

            console.log("Registration successful:", result);
            // Handle success (auto-login, redirect, modal close, etc.)
        } catch (error) {
            console.error("Registration failed:", error);
            // Display error UI
        }
    };

    return (
        <FormProvider {...method}>
            <form
                onSubmit={method.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
            >
                <Input
                    label="Username"
                    name="identifier"
                    type="text"
                    className="focus:ring-2 focus:ring-aurora-green-dark transition"
                />

                <Input
                    label="Email"
                    name="email"
                    type="email"
                    className="focus:ring-2 focus:ring-aurora-blue-dark transition"
                />

                <Input
                    label="Password"
                    name="password"
                    type="password"
                />

                {/* Register button */}
                <Button
                    type={ButtonType.submit}
                    className="mt-2 bg-aurora-blue-dark text-white px-6 py-3 rounded-lg hover:bg-aurora-green-dark transition font-semibold"
                    disabled={method.formState.isSubmitting}
                    text={
                        method.formState.isSubmitting
                            ? "Registering..."
                            : "Register"
                    }
                />

                {/* Cancel button */}
                <Dialog.Close asChild>
                    <Button
                        type={ButtonType.button}
                        className="mt-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition font-semibold"
                        text="Cancel"
                    />
                </Dialog.Close>
            </form>
        </FormProvider>
    );
}

async function registerUser({
                                identifier,
                                email,
                                password,
                            }: {
    identifier: string;
    email: string;
    password: string;
}) {
    const res = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            endpoint: "/api/v1/auth/register",
            body: {
                identifier,
                email,
                password,
                provider: "LOCAL",
            },
        }),
    });

    if (!res.ok) {
        throw new Error("Registration failed");
    }

    return res.json();
}
