import {BackendResponse, RequestMethod, RequestType} from "@/lib/types/backend";

export async function callBackend<T = any>({method = RequestMethod.POST, endpoint, token = null, body = null}: RequestType):
    Promise<BackendResponse<T>> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(endpoint, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
    });

    const data: T = await res.json();
    return { status: res.status, data };
}
