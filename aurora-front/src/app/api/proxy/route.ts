import { NextRequest, NextResponse } from "next/server";
import { callBackend } from "@/lib/backend/backend";

export async function POST(req: NextRequest) {
  try {
    const { endpoint, body, baseUrl, method } = await req.json();

    // callBackend already handles sending current cookies to the backend
    // and refreshing the token if needed.
    const { status, data } = await callBackend({
      endpoint,
      body,
      baseUrl,
      method,
    });

    // We return the data. Since callBackend uses 'cookies()' from next/headers,
    // any 'cookieStore.set' calls made inside callBackend will automatically
    // be applied to the outgoing response in Next.js.
    return NextResponse.json(data, { status });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
