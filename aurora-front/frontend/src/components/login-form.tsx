'use client';

import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {LoginSchema, LoginValues} from "@/lib/types/login";
import Input from "@/components/input";
import Button from "@/components/button";
import {ButtonType} from "@/lib/types/button";

export default function LoginForm() {
    const {
        handleSubmit,
        formState: { isSubmitting }
    } = useForm<LoginValues>({
        mode: 'onSubmit',
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            identifier: "",
            password: ""
        }
    });

    const onSubmit = async (data: LoginValues) => {
        try {
            const result = await login(data.identifier, data.password);
            console.log('Login successful:', result);
            // Handle successful login (store token, redirect, etc.)
        } catch (error) {
            console.error('Login failed:', error);
            // Handle error (show error message to user)
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input 
                label="Email" 
                name="identifier" 
                type="email"
            />
            <Input 
                label="Password" 
                name="password" 
                type="password"
            />
            
            <Button
                type={ButtonType.submit}
                className="mt-2 bg-aurora-blue-dark text-white px-6 py-3 rounded-lg hover:bg-aurora-green-dark transition font-semibold"
                disabled={isSubmitting}
                text={isSubmitting ? "Logging in..." : "Login"}
            />
        </form>
    );
}

async function login(identifier: string, password: string) {
    const res = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            endpoint: '/api/v1/auth/login',
            body: {
                identifier,
                password,
                provider: "LOCAL"
            }
        })
    });

    if (!res.ok) {
        throw new Error('Login failed');
    }

    return res.json();
}
