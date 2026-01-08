import { NextRequest, NextResponse } from "next/server";
import { callBackend } from "@/lib/backend/backend";

export async function POST(req: NextRequest) {
  try {
    const { endpoint, body, baseUrl } = await req.json();

    const { status, data } = await callBackend({ endpoint, body, baseUrl });

    if ((data as any).accessToken) {
      const response = NextResponse.json(data);
      response.cookies.set("accessToken", (data as any).accessToken, {
        httpOnly: true,
        path: "/",
      });
      response.cookies.set("refreshToken", (data as any).refreshToken, {
        httpOnly: true,
        path: "/",
      });
      return response;
    }

    return NextResponse.json(data, { status });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
