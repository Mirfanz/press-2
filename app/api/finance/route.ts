import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/utils/prisma";

export async function GET(req: NextRequest) {
  try {
    const finance = await prisma.finance.findUnique({ where: { id: 1 } });

    if (!finance) {
      return NextResponse.json(
        { success: false, message: "Finance data not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Finance balance fetched",
      data: {
        balance: finance.balance,
        total_transaction: finance.total_transaction,
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
