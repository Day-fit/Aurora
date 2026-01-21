import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { callBackend } from "@/lib/backend/backend";
import { ApiService } from "@/lib/backend/api-config";

export async function POST(req: NextRequest) {
  try {
    const { endpoint, body, service, method } = await req.json();

    // Determine the service - default to AUTH for backward compatibility
    const apiService: ApiService = service === "CORE" ? ApiService.CORE : ApiService.AUTH;

    // callBackend already handles sending current cookies to the backend
    // and refreshing the token if needed.
    const { status, data } = await callBackend({
      endpoint,
      body,
      service: apiService,
      method,
    });

    // We return the data. Since callBackend uses 'cookies()' from next/headers,
    // any 'cookieStore.set' calls made inside callBackend will automatically
    // be applied to the outgoing response in Next.js.
    const response = NextResponse.json(data, { status });
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const shouldExposeToken =
      typeof endpoint === "string" && endpoint.startsWith("/api/v1/auth/");
    if (accessToken && shouldExposeToken) {
      response.headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return response;
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
