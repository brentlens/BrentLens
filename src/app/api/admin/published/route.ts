import { getPublishedIncidentsList } from "@/services/incident.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page")) || 1;
  const size = Number(searchParams.get("size")) || 6;
  const incidents = await getPublishedIncidentsList(page, size);

  return NextResponse.json({
    success: true,
    data: incidents,
    timestamp: new Date().toISOString(),
  });
}