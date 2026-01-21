import { authProxy } from "@/lib/backend/auth-proxy";

export default async function login(identifier: string, password: string) {
  return authProxy({
    endpoint: "/api/v1/auth/login",
    body: { identifier, password },
    errorMessage: "Login failed",
  });
}
