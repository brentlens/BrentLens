/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, after } from "next/server";
import { EmailService } from "@/lib/email/email.service";
import { insertWaitListEmail } from "@/services/waitList.service";
import { ApiError } from "@/utils/ApiError";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawEmail = body?.email || body?.user_email;
    const isOAuth = body?.authMethod === 'google';

    if (!rawEmail || typeof rawEmail !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Valid email is required.', code: 'INVALID_EMAIL' },
        { status: 400 }
      );
    }

    const sanitizedEmail = rawEmail.trim().toLowerCase();
    const fullName = (body.fullName || body.user_name || '').trim();

    // 1. Check existence in both tables simultaneously
    const [profileCheck, waitlistCheck] = await Promise.all([
      supabaseAdmin
        .from('users_profile')
        .select('id')
        .eq('email', sanitizedEmail)
        .maybeSingle(),
      supabaseAdmin
        .from('brent_waitlistUsers')
        .select('id')
        .eq('user_email', sanitizedEmail)
        .maybeSingle(),
    ]);

    if (profileCheck.error) {
      console.error('Profile check error:', profileCheck.error);
      throw new ApiError('Database check failed', 500, 'DATABASE_ERROR');
    }

    if (waitlistCheck.error) {
      console.error('Waitlist check error:', waitlistCheck.error);
      throw new ApiError('Database check failed', 500, 'DATABASE_ERROR');
    }

    // Reject if already registered as a subscribed user
    if (profileCheck.data) {
      return NextResponse.json(
        {
          success: false,
          error: 'This email is already registered as an active member.',
          code: 'USER_ALREADY_REGISTERED',
        },
        { status: 409 }
      );
    }

    // Reject if already present in the waitlist
    if (waitlistCheck.data) {
      return NextResponse.json(
        {
          success: false,
          error: 'This email is already on the waitlist.',
          code: 'WAITLIST_USER_EXISTS',
        },
        { status: 409 }
      );
    }

    // 2. Perform DB insertion with exact expected keys
    const resp = await insertWaitListEmail({
      email: sanitizedEmail,
      user_email: sanitizedEmail,
      fullName: fullName,
      user_name: fullName,
      password: isOAuth ? '': body.password,
      authMethod: isOAuth ? 'google' : 'email',
    } as any);

    // 3. Dispatch background welcome email safely using after()
    if (resp?.id) {
      const waitlistUserId = resp.id;
      const targetEmail = sanitizedEmail;
      const targetName = fullName || resp.user_name || '';

      after(async () => {
        try {
          await EmailService.handleWaitlistUserOnboarding({
            waitlistUserId,
            email: targetEmail,
            name: targetName,
          });
        } catch (emailErr) {
          console.error('[WAITLIST_EMAIL_BACKGROUND_ERROR]', emailErr);
        }
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'User added to waitlist successfully',
        data: resp,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Waitlist API error:', error);

    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          code: error.code,
        },
        { status: error.status }
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request body',
          code: 'INVALID_REQUEST',
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Something went wrong. Please try again later.',
        code: 'INTERNAL_SERVER_ERROR',
      },
      { status: 500 }
    );
  }
}