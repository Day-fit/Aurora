"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { LoginSchema, LoginValues } from "@/lib/types/login";
import Input from "@/components/input";
import Button from "@/components/button";
import { ButtonType } from "@/lib/types/button";
import * as Dialog from "@radix-ui/react-dialog";
import login from "@/lib/backend/login";
import { useSearchParams, useRouter } from "next/navigation";
import { FaGithub, FaGoogle } from "react-icons/fa";

export default function LoginForm() {
  const method = useForm<LoginValues>({
    mode: "onSubmit",
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/"; // fallback to home

  const onSubmit = async (data: LoginValues) => {
    try {
      const result = await login(data.identifier, data.password);
      console.log("Login successful:", result);

      router.push(redirectTo);
    } catch (error: any) {
      const message = error?.message || "Login failed. Please try again.";
      console.error(message);
      alert(message);
    }
  };

  const handleOAuthLogin = (provider: string) => {
    // Usually, you'd redirect to your backend's OAuth endpoint
    // For example: window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/oauth/${provider}`;
    console.log(`Logging in with ${provider}`);
    alert(`OAuth with ${provider} is being initiated...`);
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
          className="focus:ring-2 focus:ring-aurora-green-dark transition"
        />
        <Input label="Password" name="password" type="password" />

        {/* Login button */}
        <Button
          type={ButtonType.submit}
          className="mt-2 bg-aurora-blue-dark text-white px-6 py-3 rounded-lg hover:bg-aurora-green-dark transition font-semibold"
          disabled={method.formState.isSubmitting}
          text={method.formState.isSubmitting ? "Logging in..." : "Login"}
        />

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-700"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-main-dark px-2 text-text-dark/50">
              Or continue with
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => handleOAuthLogin("google")}
            className="flex items-center justify-center gap-3 px-6 py-3 border border-gray-700 rounded-lg bg-gray-800/30 hover:bg-gray-800 hover:border-gray-600 transition-all text-sm font-semibold"
          >
            <FaGoogle className="text-lg" />
            <span>Sign in with Google</span>
          </button>
          <button
            type="button"
            onClick={() => handleOAuthLogin("github")}
            className="flex items-center justify-center gap-3 px-6 py-3 border border-gray-700 rounded-lg bg-gray-800/30 hover:bg-gray-800 hover:border-gray-600 transition-all text-sm font-semibold"
          >
            <FaGithub className="text-lg" />
            <span>Sign in with GitHub</span>
          </button>
        </div>

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
