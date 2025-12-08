"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { LoginSchema, LoginValues } from "@/lib/types/login";
import Input from "@/components/input";
import Button from "@/components/button";
import { ButtonType } from "@/lib/types/button";
import * as Dialog from "@radix-ui/react-dialog";

export default function LoginForm() {
    const method = useForm<LoginValues>({
        mode: "onSubmit",
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            identifier: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginValues) => {
        try {
            const result = await login(data.identifier, data.password);
            console.log("Login successful:", result);
            // Handle successful login (store token, redirect, etc.)
        } catch (error) {
            console.error("Login failed:", error);
            // Handle error (show error message to user)
        }
    };

    return (
        <FormProvider {...method}>
            <form
                onSubmit={method.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
            >
                <Input
                    label="Email"
                    name="identifier"
                    type="email"
                    className="focus:ring-2 focus:ring-aurora-green-dark transition"
                />
                <Input label="Password" name="password" type="password" />

                {/* Login button */}
                <Button
                    type={ButtonType.submit}
                    className="mt-2 bg-aurora-blue-dark text-white px-6 py-3 rounded-lg hover:bg-aurora-green-dark transition font-semibold"
                    disabled={method.formState.isSubmitting}
                    text={
                        method.formState.isSubmitting ? "Logging in..." : "Login"
                    }
                />

                {/* Cancel button wrapped in Dialog.Close to close modal */}
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

async function login(identifier: string, password: string) {
    const res = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            endpoint: "/api/v1/auth/login",
            body: {
                identifier,
                password,
                provider: "LOCAL",
            },
        }),
    });

    if (!res.ok) {
        throw new Error("Login failed");
    }

    return res.json();
}
