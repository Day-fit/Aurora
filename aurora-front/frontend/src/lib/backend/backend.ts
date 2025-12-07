export interface BackendResponse<T = any> {
    status: number;
    data: T;
}

export async function callBackend<T = any>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'POST',
    body: any = null,
    token: string | null = null
): Promise<BackendResponse<T>> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`http://localhost:8080/${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
    });

    const data: T = await res.json();
    return { status: res.status, data };
}
