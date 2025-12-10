export default async function register(email: string, username: string, password: string) {
    const res = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            endpoint: "/api/v1/auth/register",
            body: {
                email,
                username,
                password,
                provider: "LOCAL",
            },
        }),
    });

    if (!res.ok) {
        throw new Error("Register failed");
    }

    return res.json();
}