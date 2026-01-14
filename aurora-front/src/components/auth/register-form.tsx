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

  const onSubmit = async (data: RegisterValues) => {
    try {
      await register(data.email, data.username, data.password);
      const identifier = data.email;

      await login(identifier, data.password);

      router.push(redirectTo);
    } catch (error: any) {
      const message = error?.message || "Login failed. Please try again.";
      console.error(message);
      alert(message);
    }
  };

  const handleOAuthLogin = (provider: string) => {
    window.location.href = `${process.env.BACKEND_AUTH_URL}/oauth/authorization/${provider}`;
    console.log(`Logging in with ${provider}`);
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

        <Input label="Password" name="password" type="password" />

        <Button
          type={ButtonType.submit}
          className="mt-2 bg-aurora-blue-dark text-white px-6 py-3 rounded-lg hover:bg-aurora-green-dark transition font-semibold"
          disabled={method.formState.isSubmitting}
          text={method.formState.isSubmitting ? "Registering..." : "Register"}
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
