export default async function login(identifier: string, password: string) {
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
