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
import { revalidateHeader } from "@/lib/backend/revalidate";
import { getAuthErrorMessage } from "@/lib/utils/auth-helpers";
import OAuthButtons, { FormDivider, ErrorAlert } from "@/components/auth/oauth-buttons";

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
  const errorMessage = getAuthErrorMessage(errorParam);

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

  return (
    <FormProvider {...method}>
      <form
        onSubmit={method.handleSubmit(onSubmit)}
        className="flex flex-col gap-3"
      >
        {errorMessage && <ErrorAlert message={errorMessage} />}
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

        <FormDivider />

        <OAuthButtons action="sign up" />

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
