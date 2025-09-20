import { Role } from "@prisma/client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { decodeAccessToken, hasRole } from "@/lib/utils/auth";
import prisma from "@/lib/utils/prisma";
import { TaxT } from "@/types";

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

    const result = await prisma.tax.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { created_at: "desc" },
      include: {
        _count: {
          select: { unpaid_users: true, paid_users: true },
        },
      },
    });

    const totalPages = Math.ceil((await prisma.tax.count()) / limit);

    const data: TaxT[] = result.map((tax) => ({
      id: tax.id,
      month: tax.month,
      year: tax.year,
      amount: tax.amount,
      unpaid_count: tax._count.unpaid_users,
      paid_count: tax._count.paid_users,
      created_at: tax.created_at,
    }));

    return NextResponse.json({
      success: true,
      message: "",
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
            : "Terjadi Kesalahan",
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const accessToken = (await cookies()).get("access_token")?.value;

    if (!accessToken)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );

    const user = await decodeAccessToken(accessToken);

    if (!user)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    else if (hasRole(user, [Role.Admin, Role.Bendahara]))
      return NextResponse.json(
        { success: false, message: "Anda tidak memiliki izin" },
        { status: 401 },
      );

    const body = await req.json();
    const { month, year, amount } = body;

    if (
      typeof month !== "number" ||
      typeof year !== "number" ||
      typeof amount !== "number" ||
      amount <= 0
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid input data" },
        { status: 400 },
      );
    }

    const tax = await prisma.tax.create({
      data: {
        month,
        year,
        amount,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Tax created",
      data: {
        id: tax.id,
        month: tax.month,
        year: tax.year,
        amount: tax.amount,
        created_at: tax.created_at,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Terjadi Kesalahan",
      },
      { status: 500 },
    );
  }
}
