import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { callBackend } from "@/lib/backend/backend";
import { RequestMethod } from "@/lib/types/backend";

export async function GET() {
  try {
    let cookieStore = await cookies();
    let accessToken = cookieStore.get("accessToken")?.value;

    // If no access token, try to refresh
    if (!accessToken) {
      const refreshToken = cookieStore.get("refreshToken")?.value;
      if (refreshToken) {
        try {
          const { status } = await callBackend({
            endpoint: "/api/v1/auth/refresh",
            method: RequestMethod.POST,
            baseUrl: process.env.BACKEND_AUTH_URL,
          });

          if (status === 200) {
            // Re-fetch cookies after refresh to get the updated access token
            cookieStore = await cookies();
            accessToken = cookieStore.get("accessToken")?.value;
          }
        } catch (error) {
          console.error("Failed to refresh token for WebSocket:", error);
        }
      }
    }

    // Build WebSocket URL from environment
    const backendCoreUrl = process.env.BACKEND_CORE_URL || "http://localhost:8081";
    
    // Convert HTTP URL to WebSocket URL
    // http://... -> ws://...
    // https://... -> wss://...
    const wsUrl = backendCoreUrl
      .replace(/^https:\/\//, "wss://")
      .replace(/^http:\/\//, "ws://");

    const trackerWsUrl = `${wsUrl}/api/v1/core/ws/tracker`;

    return NextResponse.json({
      wsUrl: trackerWsUrl,
      accessToken: accessToken || null,
    });
  } catch (error) {
    console.error("WS config error:", error);
    return NextResponse.json(
      { message: "Failed to get WebSocket configuration" },
      { status: 500 }
    );
  }
}
