import { authProxy } from "@/lib/backend/auth-proxy";

export default async function register(
  email: string,
  username: string,
  password: string,
) {
  return authProxy({
    endpoint: "/api/v1/auth/register",
    body: { username, email, password },
    errorMessage: "Register failed",
  });
}
