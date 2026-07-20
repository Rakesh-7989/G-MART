import { NextRequest, NextResponse } from "next/server";
import { isAdminFromRequest } from "@/lib/admin";

export async function GET(request: NextRequest) {
  try {
    const admin = await isAdminFromRequest(request);
    return NextResponse.json({ admin });
  } catch {
    return NextResponse.json({ admin: false });
  }
}
