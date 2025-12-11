"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { RegisterSchema, RegisterValues } from "@/lib/types/register";
import Input from "@/components/input";
import Button from "@/components/button";
import { ButtonType } from "@/lib/types/button";
import * as Dialog from "@radix-ui/react-dialog";
import {useRouter, useSearchParams} from "next/navigation";
import login from "@/lib/backend/login";
import register from "@/lib/backend/register";

export default function RegisterForm() {
    const method = useForm<RegisterValues>({
        mode: "onSubmit",
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirectTo') || '/';

    const onSubmit = async (data: RegisterValues) => {
        try {
            await register(data.username, data.email, data.password);
            const identifier = data.email;

            await login(identifier, data.password);

            router.push(redirectTo);

        } catch (error: any) {
            const message = error?.message || 'Login failed. Please try again.';
            console.error(message);
            alert(message);
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
                    name="username"
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