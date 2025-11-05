import { compareSync, hashSync } from "bcrypt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

import { UserT } from "@/types";
import prisma from "@/lib/utils/prisma";
import { decodeAccessToken } from "@/lib/utils/auth";

export async function PATCH(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    const decodedToken = await decodeAccessToken(accessToken || "");

    if (!decodedToken)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );

    const user = await prisma.user.findUnique({
      where: { nik: decodedToken.nik },
    });

    if (!user) {
      cookieStore.delete("access_token");

      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const schema = z.object({
      password: z.string().min(1, "Password is required"),
      new_password: z.string().min(1, "New password is required"),
    });

    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success)
      return NextResponse.json(
        {
          success: false,
          message: z.prettifyError(parsed.error),
          error: z.treeifyError(parsed.error),
        },
        { status: 400 },
      );

    if (!compareSync(parsed.data.password, user.password))
      return NextResponse.json(
        { success: false, message: "Password anda salah" },
        { status: 403 },
      );

    const result = await prisma.user.update({
      where: { nik: user.nik },
      data: {
        password: hashSync(
          parsed.data.new_password,
          parseInt(process.env.SALT_ROUNDS),
        ),
      },
      omit: { password: true, updated_at: true },
    });

    cookieStore.delete("access_token");

    const data: UserT = {
      nik: result.nik,
      name: result.name,
      role: result.role,
      image_url: result.image_url,
      active: result.active,
      created_at: result.created_at,
    };

    return NextResponse.json({
      success: true,
      message: "Password diubah",
      data,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Something went wrong",
      },
      { status: 500 },
    );
  }
}
