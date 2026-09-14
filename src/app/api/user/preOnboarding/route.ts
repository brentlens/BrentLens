/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, after } from 'next/server';
import { EmailService } from '@/lib/email/email.service';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, pass, name, preference, google_linked, role } = body;

    if (!email || !preference) {
      return NextResponse.json(
        { message: 'Malformed request. Missing email or onboarding preferences.' },
        { status: 400 }
      );
    }

    const sanitizedEmail = String(email).trim().toLowerCase();
    const resolvedRole = role || preference.preferredPlan?.label?.toLowerCase() || 'pro';

    // 1. Upsert into users_profile
    const { data: userProfile, error: dbError } = await supabaseAdmin
      .from('users_profile')
      .upsert(
        {
          email: sanitizedEmail,
          name: name || '',
          pass: pass,
          preference: preference,
          pre_register_user: true,
          google_linked: Boolean(google_linked),
          role: resolvedRole,
        },
        { onConflict: 'email' }
      )
      .select()
      .single();

    if (dbError || !userProfile) {
      console.error('Database persistence error:', dbError);
      return NextResponse.json(
        { message: `Database error: ${dbError?.message || 'Failed to save profile'}` },
        { status: 500 }
      );
    }

    // 2. Non-blocking Background Tasks: Status sync & Immediate Welcome Email
    after(async () => {
      try {
        // Sync waitlist table if user existed there
        const { data: existingWaitlistUser } = await supabaseAdmin
          .from('brent_waitlistUsers')
          .select('id')
          .eq('user_email', sanitizedEmail)
          .maybeSingle();

        if (existingWaitlistUser) {
          await supabaseAdmin
            .from('brent_waitlistUsers')
            .update({ isRegistered: true, status: 'migrated' })
            .eq('id', existingWaitlistUser.id);
        }

        // Send Email 1 & schedule sequence for cron
        await EmailService.handleSubscribedUserOnboarding({
          userId: userProfile.id,
          email: userProfile.email,
          name: userProfile.name,
        });
      } catch (err) {
        console.error('[SUBSCRIBER_BACKGROUND_PROCESSING_ERROR]', err);
      }
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Registration and subscription processed successfully.',
        record: userProfile,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Pre-onboarding error:', error);
    return NextResponse.json(
      { message: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}