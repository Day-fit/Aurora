"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { RegisterSchema, RegisterValues } from "@/lib/types/register";
import Input from "@/components/input";
import Button from "@/components/button";
import { ButtonType } from "@/lib/types/button";
import * as Dialog from "@radix-ui/react-dialog";
import { useRouter, useSearchParams } from "next/navigation";
import login from "@/lib/backend/login";
import register from "@/lib/backend/register";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { revalidateHeader } from "@/lib/backend/revalidate";

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
  const redirectTo = searchParams.get("redirectTo") || "/";
  const errorParam = searchParams.get("error");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "OAuthFailed":
        return "Social login failed. Please try again.";
      case "ConnectionError":
        return "Could not connect to the auth server.";
      case "session_invalid":
        return "Your session has expired. Please log in again.";
      default:
        return null;
    }
  };

  const errorMessage = getErrorMessage(errorParam);

  const onSubmit = async (data: RegisterValues) => {
    try {
      await register(data.email, data.username, data.password);
      const identifier = data.email;

      await login(identifier, data.password);

      await revalidateHeader();

      router.push(redirectTo);
    } catch (error: any) {
      const message = error?.message || "Login failed. Please try again.";
      console.error(message);
      alert(message);
    }
  };

  const handleOAuthLogin = (provider: string) => {
    // We tell the backend: "After you finish with Google/GitHub, send the user here"
    const callbackUrl = `${window.location.origin}/auth/callback`;

    // Most Spring Boot / OAuth2 backends use 'redirect_uri'
    window.location.href = `${process.env.NODE_ENV == "production" ? "https" : "http"}://${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/oauth2/authorization/${provider}?redirect_uri=${callbackUrl}`;
  };

  return (
    <FormProvider {...method}>
      <form
        onSubmit={method.handleSubmit(onSubmit)}
        className="flex flex-col gap-3"
      >
        {errorMessage && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg text-sm">
            {errorMessage}
          </div>
        )}
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

        <Input label="Password" name="password" type="password" />

        <Button
          type={ButtonType.submit}
          className="mt-1 bg-aurora-blue-dark text-white px-6 py-2.5 rounded-lg hover:bg-aurora-green-dark transition font-semibold"
          disabled={method.formState.isSubmitting}
          text={method.formState.isSubmitting ? "Registering..." : "Register"}
        />

        <div className="relative my-3">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-700"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-main-dark px-2 text-text-dark/50">
              Or continue with
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => handleOAuthLogin("google")}
            className="flex items-center justify-center gap-3 px-6 py-2.5 border border-gray-700 rounded-lg bg-gray-800/30 hover:bg-gray-800 hover:border-gray-600 transition-all text-sm font-semibold"
          >
            <FaGoogle className="text-lg" />
            <span>Sign in with Google</span>
          </button>
          <button
            type="button"
            onClick={() => handleOAuthLogin("github")}
            className="flex items-center justify-center gap-3 px-6 py-2.5 border border-gray-700 rounded-lg bg-gray-800/30 hover:bg-gray-800 hover:border-gray-600 transition-all text-sm font-semibold"
          >
            <FaGithub className="text-lg" />
            <span>Sign in with GitHub</span>
          </button>
        </div>

        <Dialog.Close asChild>
          <Button
            type={ButtonType.button}
            className="mt-1 bg-gray-600 text-white px-6 py-2.5 rounded-lg hover:bg-gray-700 transition font-semibold"
            text="Cancel"
          />
        </Dialog.Close>
      </form>
    </FormProvider>
  );
}
