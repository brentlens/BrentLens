/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { exists: false, error: 'Email parameter is required.' },
        { status: 400 }
      );
    }

    const sanitizedEmail = email.trim().toLowerCase();

    // Query users_profile using email
    const { data, error } = await supabaseAdmin
      .from('users_profile')
      .select('email')
      .eq('email', sanitizedEmail)
      .maybeSingle();

    if (error) {
      console.error('Email verification error:', error);
      return NextResponse.json(
        { exists: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ exists: Boolean(data) });
  } catch (error: any) {
    console.error('Check email route error:', error);
    return NextResponse.json(
      { exists: false, error: error?.message || 'Internal check failure' },
      { status: 500 }
    );
  }
}