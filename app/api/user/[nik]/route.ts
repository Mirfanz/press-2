import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { decodeAccessToken } from "@/lib/utils/auth";
import prisma from "@/lib/utils/prisma";
import { UserT } from "@/types";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ nik: string }> },
) {
  try {
    const accessToken = (await cookies()).get("access_token")?.value;

    if (!accessToken)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    if (!(await decodeAccessToken(accessToken)))
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );

    const { nik } = await params;
    const result = await prisma.user.findUnique({
      where: { nik },
      select: {
        nik: true,
        name: true,
        role: true,
        image_url: true,
        active: true,
        created_at: true,
      },
    });

    if (!result)
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );

    const data: UserT = {
      nik: result.nik,
      name: result.name,
      role: result.role,
      image_url: result.image_url,
      active: result.active,
      created_at: result.created_at,
    };

    return Response.json({
      success: true,
      message: "Success get user",
      data,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Internal server error",
        error: error,
      },
      { status: 500 },
    );
  }
}
