/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { EmailService } from '@/lib/email/email.service';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// Service role client bypasses all auth/session/cookie checks completely
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
          pre_register_user: true, // Matches your DB schema column name
          google_linked: Boolean(google_linked),
          role: resolvedRole,
        //   updated_at: new Date().toISOString(),
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

    // 2. Update waitlist status if user exists
    const { data: existingWaitlistUser, error: findError } = await supabaseAdmin
      .from('brent_waitlistUsers')
      .select('id')
      .eq('user_email', sanitizedEmail)
      .maybeSingle();

    if (findError) {
      console.error('Error checking waitlist user:', findError);
    } else if (existingWaitlistUser) {
      const { error: waitingListdbError } = await supabaseAdmin
        .from('brent_waitlistUsers')
        .update({
          isRegistered: true,
          status: 'migrated',
        })
        .eq('id', existingWaitlistUser.id);

      if (waitingListdbError) {
        console.error('Error updating waitlist user status:', waitingListdbError);
      }
    }

    // 3. Trigger immediate code-based welcome email & enroll into cron sequence
    // Non-blocking invocation ensures HTTP 200 responds without waiting for SMTP handshake
    if (!dbError && userProfile) {
		// Terminates waitlist track, triggers Email 1 from DB, and sets Email 2 schedule
		EmailService.handleSubscribedUserOnboarding({
			userId: userProfile.id,
			email: userProfile.email,
			name: userProfile.name,
		}).catch((err) => console.error("[SUBSCRIBER_EMAIL_ERROR]", err));
	}

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