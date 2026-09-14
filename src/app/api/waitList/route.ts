import { EmailService } from "@/lib/email/email.service";
import { insertWaitListEmail } from "@/services/waitList.service";
import { ApiError } from "@/utils/ApiError";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const resp = await insertWaitListEmail(body);

    // Trigger immediate database-driven welcome email and queue Sequence 2
    if (resp?.id && (resp?.user_email || body?.email || body?.user_email)) {
      const waitlistUserId = resp.id;
      const targetEmail = resp.user_email || body.email || body.user_email;
      const targetName = resp.user_name || body.name || body.user_name || "";

      EmailService.handleWaitlistUserOnboarding({
        waitlistUserId,
        email: targetEmail,
        name: targetName,
      }).catch((emailErr) => {
        console.error("[WAITLIST_EMAIL_DISPATCH_ERROR]", emailErr);
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "User added to waitlist successfully",
        data: resp,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Waitlist API error:", error);

    // Errors we intentionally created
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

    // Invalid JSON
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request body",
          code: "INVALID_REQUEST",
        },
        { status: 400 }
      );
    }

    // Unexpected errors
    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong. Please try again later.",
        code: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}