// app/api/login/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SignJWT } from 'jose';

// Get your secret from .env
const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(request: Request) {
    try {
        // const body = await request.json();
        // const { username, password } = body;
        const username = "admin"
        const password = "password123"

        if (username !== 'admin' || password !== 'password123') {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const token = await new SignJWT({
            sub: 'user_123',
            username: username,
            role: 'user'
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('7d') // Token expires in 7 days
            .sign(SECRET_KEY);

        const cookieStore = await cookies();
        cookieStore.set({
            name: 'auth-token',
            value: token,
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'lax', // Protects against CSRF attacks
            path: '/', // Makes the cookie available across the whole site
            maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
        });

        return NextResponse.json({ success: true, message: 'Logged in successfully' });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}


export async function get() {
    return NextResponse.json({ success: true, message: 'api working...' });

}