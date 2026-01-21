interface AuthProxyRequest {
  endpoint: string;
  body: Record<string, string>;
  errorMessage: string;
}

export async function authProxy<T = unknown>({
  endpoint,
  body,
  errorMessage,
}: AuthProxyRequest): Promise<T> {
  const res = await fetch("/api/proxy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      endpoint,
      body: {
        ...body,
        provider: "LOCAL",
      },
    }),
  });

  if (!res.ok) {
    throw new Error(errorMessage);
  }

  return res.json();
}
