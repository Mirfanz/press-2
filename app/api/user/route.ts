import { Role } from "@prisma/client";
import { hashSync } from "bcrypt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

import { UserT } from "@/types";
import prisma from "@/lib/utils/prisma";
import { decodeAccessToken, hasRole } from "@/lib/utils/auth";

export async function GET(req: NextRequest) {
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

    const params = req.nextUrl.searchParams;
    const page: number = parseInt(params.get("page") || "1") || 1;
    const limit = 5;

    const result = await prisma.user.findMany({
      take: limit,
      skip: (page - 1) * limit,
      orderBy: [{ active: "desc" }, { role: "asc" }, { created_at: "asc" }],
      omit: { password: true, updated_at: true },
    });
    const totalPages = Math.ceil((await prisma.user.count()) / limit);

    const data: UserT[] = result.map((item) => ({
      nik: item.nik,
      name: item.name,
      role: item.role,
      image_url: item.image_url,
      active: item.active,
      created_at: item.created_at,
    }));

    return NextResponse.json({
      success: true,
      message: "Users",
      data,
      meta: {
        total: data.length,
        limit,
        page,
        totalPages,
      },
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
export async function POST(req: NextRequest) {
  try {
    const accessToken = (await cookies()).get("access_token")?.value;

    const user = await decodeAccessToken(accessToken || "");

    if (!user)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    if (!hasRole(user, [Role.Admin, Role.Leader]))
      return NextResponse.json(
        { success: false, message: "Tidak memiliki akses menambahkan anggota" },
        { status: 401 },
      );

    const schema = z.object({
      name: z.string().min(1, "Name is required"),
      nik: z.string().min(1, "NIK is required"),
      role: z.enum(Role),
    });

    const body = await req.json();
    const parse = schema.safeParse(body);

    if (!parse.success)
      return NextResponse.json(
        {
          success: false,
          message: z.prettifyError(parse.error),
          error: z.treeifyError(parse.error),
        },
        { status: 400 },
      );

    const password = hashSync(
      process.env.DEFAULT_PASSWORD,
      parseInt(process.env.SALT_ROUNDS),
    );

    const result = await prisma.user.create({
      data: {
        name: parse.data.name,
        nik: parse.data.nik,
        password: password,
        role: parse.data.role,
      },
      omit: { password: true, updated_at: true },
    });

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
      message: "User created",
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
