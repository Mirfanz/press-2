import { Role } from "@prisma/client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

import { decodeAccessToken, hasRole } from "@/lib/utils/auth";
import prisma from "@/lib/utils/prisma";
import { supabase } from "@/lib/utils/supabase";
import { InformationT } from "@/types";

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
    const limit = 20;

    const result = await prisma.information.findMany({
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { created_at: "desc" },
      include: {
        author: {
          select: {
            nik: true,
            active: true,
            name: true,
            image_url: true,
            role: true,
            created_at: true,
          },
        },
      },
    });
    const totalPages = Math.ceil((await prisma.information.count()) / limit);

    const data: InformationT[] = result.map((item) => ({
      id: item.id,
      title: item.title,
      note: item.note,
      images: item.images,
      created_at: item.created_at,
      author: item.author,
    }));

    return NextResponse.json({
      success: true,
      message: "Information Data",
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
    const accessToken = (await cookies()).get("access_token")?.value || "";

    const user = await decodeAccessToken(accessToken);

    if (!user || !hasRole(user, [Role.Admin, Role.Leader, Role.Subleader]))
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );

    const schema = z.object({
      title: z.string().min(3, "Judul minimal 3 karakter"),
      note: z.string().optional(),
      images: z.array(z.url()).optional(),
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

    const result = await prisma.information.create({
      data: {
        title: parse.data.title,
        note: parse.data.note,
        images: parse.data.images,
        author_nik: user.nik,
      },
      select: {
        id: true,
        title: true,
        note: true,
        images: true,
        created_at: true,
        author: {
          select: {
            nik: true,
            active: true,
            name: true,
            image_url: true,
            role: true,
            created_at: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Success upload new information",
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message:
          process.env.NODE_ENV == "development"
            ? error.message
            : "Terjadi kesalahan",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const accessToken = (await cookies()).get("access_token")?.value || "";

    const user = await decodeAccessToken(accessToken);

    if (!user || !hasRole(user, [Role.Admin, Role.Leader, Role.Subleader]))
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );

    const { information_id } = await req.json();

    if (!information_id)
      return NextResponse.json(
        { success: false, message: "information_id is needed" },
        { status: 400 },
      );

    const result = await prisma.information.delete({
      where: { id: information_id },
      select: {
        id: true,
        title: true,
        note: true,
        images: true,
        created_at: true,
        author: {
          select: {
            nik: true,
            active: true,
            name: true,
            image_url: true,
            role: true,
            created_at: true,
          },
        },
      },
    });

    const imagesPath = result.images.map((i) => i.split("information/")[1]);
    const deleted = await supabase.storage
      .from("information")
      .remove(imagesPath);

    console.log("deleted", deleted);

    return NextResponse.json({
      success: true,
      message: "Information has been deleted",
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message:
          process.env.NODE_ENV == "development"
            ? error.message
            : "Terjadi kesalahan",
      },
      { status: 500 },
    );
  }
}
