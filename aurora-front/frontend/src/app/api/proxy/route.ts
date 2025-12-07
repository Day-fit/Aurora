import { NextRequest, NextResponse } from 'next/server';
import { callBackend } from '@/lib/backend/backend';

export async function POST(req: NextRequest) {
    try {
        const { endpoint, body } = await req.json();

        const { status, data } = await callBackend(endpoint, 'POST', body);

        // Example: if backend returns token, set cookie
        if (status === 200 && (data as any).token) {
            const response = NextResponse.json(data);
            response.cookies.set('token', (data as any).token, { httpOnly: true, path: '/' });
            return response;
        }

        return NextResponse.json(data, { status });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
