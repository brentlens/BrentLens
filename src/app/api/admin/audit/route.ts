import { auditLog, getAuditLogs } from "@/services/audit.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page")) || 1;
  const size = Number(searchParams.get("size")) || 6;
  const logs = await getAuditLogs(page, size);

  return NextResponse.json({
    success: logs.status,
    data: logs.data,
    totalCount: logs.totalCount,
    totalPages: logs.totalPages,
  });
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // console.log("in audit --- ",body)
    await auditLog(body);

    return NextResponse.json(
      {
        success: true,
        message: "Audit log created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}