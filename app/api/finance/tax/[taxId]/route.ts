import { Role } from "@prisma/client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { decodeAccessToken, hasRole } from "@/lib/utils/auth";
import prisma from "@/lib/utils/prisma";
import { TaxT } from "@/types";

export async function GET(req: NextRequest, { params }: { params: Promise<{ taxId: string }> }) {
  try {
    const accessToken = (await cookies()).get("access_token")?.value;

    if (!accessToken) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const user = await decodeAccessToken(accessToken);

    if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { taxId } = await params;

    console.log("taxId", taxId);

    const result = await prisma.tax.findUnique({
      where: { id: taxId },
      include: {
        unpaid_users: true,
        paid_users: true,
      },
    });

    if (!result) return NextResponse.json({ success: false, message: "Data tidak ditemukan" }, { status: 404 });

    const data: TaxT<true> = {
      id: result.id,
      month: result.month,
      year: result.year,
      amount: result.amount,
      created_at: result.created_at,
      paid_count: result.paid_users.length,
      unpaid_count: result.unpaid_users.length,
      paid_users: result.paid_users.map((u) => ({
        nik: u.nik,
        name: u.name,
        image_url: u.image_url,
        role: u.role,
        active: u.active,
        created_at: u.created_at,
      })),
      unpaid_users: result.unpaid_users.map((u) => ({
        nik: u.nik,
        name: u.name,
        image_url: u.image_url,
        role: u.role,
        active: u.active,
        created_at: u.created_at,
      })),
    };

    return NextResponse.json({ success: true, message: "Tax", data });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: process.env.NODE_ENV === "development" ? error.message : "Terjadi Kesalahan",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ taxId: string }> }) {
  try {
    const accessToken = (await cookies()).get("access_token")?.value;

    if (!accessToken) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const user = await decodeAccessToken(accessToken);

    if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    if (!hasRole(user, [Role.Admin, Role.Bendahara]))
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

    const { taxId } = await params;
    const body = await req.json();
    const { nik } = body;

    if (!nik || typeof nik !== "string") {
      return NextResponse.json({ success: false, message: "Invalid user nik" }, { status: 400 });
    }

    const tax = await prisma.tax.findUnique({
      where: { id: taxId },
      include: { unpaid_users: true },
    });

    if (!tax) return NextResponse.json({ success: false, message: "Tax not found" }, { status: 404 });

    const userUnpaid = tax.unpaid_users.find((u) => u.nik === nik);

    if (!userUnpaid) return NextResponse.json({ success: false, message: "User not in unpaid list" }, { status: 404 });

    await prisma.tax.update({
      where: { id: taxId },
      data: {
        unpaid_users: { disconnect: { nik } },
        paid_users: { connect: { nik } },
      },
    });

    return NextResponse.json({
      success: true,
      message: "User status updated to paid",
      data: { nik, taxId },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: process.env.NODE_ENV === "development" ? error.message : "Terjadi Kesalahan",
      },
      { status: 500 }
    );
  }
}
