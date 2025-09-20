import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Role } from "@prisma/client";

import prisma from "@/lib/utils/prisma";
import { TransactionT } from "@/types";
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
    const limit = 20;

    const result = await prisma.transaction.findMany({
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { created_at: "desc" },
    });
    const totalPages = Math.ceil((await prisma.transaction.count()) / limit);

    const data: TransactionT[] = result.map((item) => ({
      id: item.id,
      income: item.income,
      title: item.title,
      note: item.note,
      amount: item.amount,
      images: item.images,
      created_at: item.created_at,
    }));

    return NextResponse.json({
      success: true,
      message: "Finance transaction API",
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
    else if (!hasRole(user, [Role.Admin, Role.Bendahara]))
      return NextResponse.json(
        {
          success: false,
          message: "Anda tidak memiliki izin menambahkan transaksi",
        },
        { status: 403 },
      );

    const body = await req.json();
    const { income, title, note, amount, images } = body;

    if (
      typeof income !== "boolean" ||
      typeof title !== "string" ||
      typeof amount !== "number"
    )
      return NextResponse.json(
        { success: false, message: "Invalid input data" },
        { status: 400 },
      );
    else if (amount <= 0)
      return NextResponse.json(
        { success: false, message: "Amount must be greater than zero" },
        { status: 400 },
      );

    const noteValue =
      typeof note === "string" && note.trim() !== "" ? note : undefined;

    const result = await prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({
        data: { income, title, note: noteValue, amount, images },
      });

      await tx.finance.update({
        where: { id: 1 },
        data: {
          total_transaction: { increment: 1 },
          balance: income ? { increment: amount } : { decrement: amount },
        },
      });

      return transaction;
    });

    return NextResponse.json({
      success: true,
      message: "Transaction created",
      data: {
        id: result.id,
        income: result.income,
        title: result.title,
        note: result.note ?? null,
        amount: result.amount,
        images: result.images,
        created_at: result.created_at,
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

export async function DELETE(req: NextRequest) {
  try {
    const accessToken = (await cookies()).get("access_token")?.value;

    const user = await decodeAccessToken(accessToken || "");

    if (!user)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    else if (!hasRole(user, [Role.Admin, Role.Bendahara]))
      return NextResponse.json(
        {
          success: false,
          message: "Anda tidak memiliki izin menghapus transaksi",
        },
        { status: 403 },
      );

    const body = await req.json();
    const { id } = body;

    if (typeof id !== "string")
      return NextResponse.json(
        { success: false, message: "Invalid transaction id" },
        { status: 400 },
      );

    const transaction = await prisma.transaction.findUnique({ where: { id } });

    if (!transaction)
      return NextResponse.json(
        { success: false, message: "Transaction not found" },
        { status: 404 },
      );

    await prisma.$transaction(async (tx) => {
      await tx.transaction.delete({ where: { id } });

      await tx.finance.update({
        where: { id: 1 },
        data: {
          total_transaction: { decrement: 1 },
          balance: transaction.income
            ? { decrement: transaction.amount }
            : { increment: transaction.amount },
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Transaction deleted",
      data: { id },
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
