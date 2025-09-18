import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { decodeAccessToken } from "@/lib/utils/auth";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken)
    return NextResponse.json(
      { success: false, message: "Not logged in yet" },
      { status: 401 },
    );
  const user = await decodeAccessToken(accessToken);

  if (!user)
    return NextResponse.json(
      { success: false, message: "Your token invalid" },
      { status: 401 },
    );

  return NextResponse.json(
    {
      success: true,
      message: "Hii " + user?.name,
      data: {
        user,
        accessToken,
      },
    },
    { status: 200 },
  );
}
