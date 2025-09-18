import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { compareSync } from "bcrypt";

import { createAccessToken } from "@/lib/utils/auth";
import prisma from "@/lib/utils/prisma";
import { UserT } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { nik, password } = await req.json();
    const cookieStore = cookies();

    const result = await prisma.user.findUnique({
      where: {
        nik: nik.toLowerCase(),
      },
    });

    if (!result || !compareSync(password, result.password))
      return NextResponse.json(
        { success: false, message: "Authentication Failed" },
        { status: 400 },
      );

    const user: UserT = {
      nik: result.nik,
      active: result.active,
      name: result.name,
      role: result.role,
      image_url: result.image_url,
      created_at: result.created_at,
    };

    const accessToken = await createAccessToken(user);

    (await cookieStore).set("access_token", accessToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Login success",
        data: { user: user, accessToken },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Somethig is wrong." },
      { status: 500 },
    );
  }
}
