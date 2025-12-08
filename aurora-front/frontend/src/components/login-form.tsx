'use client';

import {zodResolver} from "@hookform/resolvers/zod";
import {FormProvider, useForm} from "react-hook-form";
import {LoginSchema, LoginValues} from "@/lib/types/login";

export default function LoginForm() {
    const methods = useForm<LoginValues>({
        mode: 'onSubmit',
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            identifier: "",
            password: ""
        }
    });

    return (
        <FormProvider {...methods}>
            <dialog>
                <form>

                </form>
            </dialog>
        </FormProvider>
    );
}

async function login(identifier: string, password: string) {
    const res = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            endpoint: 'http://localhost:8083/api/v1/auth/login',
            body: {
                identifier,
                password,
                provider: "LOCAL"
            }
        })
    });

    return res.json();
}
