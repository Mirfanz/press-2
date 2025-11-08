import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { decodeAccessToken } from "@/lib/utils/auth";
import prisma from "@/lib/utils/prisma";
import { TaxT } from "@/types";

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
    const result = await prisma.tax.findMany({
      where: { unpaid_users: { some: { nik } } },
      orderBy: { created_at: "desc" },
      include: {
        _count: {
          select: { unpaid_users: true, paid_users: true },
        },
      },
    });

    const data: TaxT[] = result.map((tax) => ({
      id: tax.id,
      month: tax.month,
      year: tax.year,
      amount: tax.amount,
      unpaid_count: tax._count.unpaid_users,
      paid_count: tax._count.paid_users,
      created_at: tax.created_at,
    }));

    return Response.json({
      success: true,
      message: "Success get user's taxes",
      data,
      total: data.length,
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
