import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = await cookies();

    cookieStore.delete("access_token");

    return NextResponse.json(
      { success: true, message: "Logout Success" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Logout Failed" },
      { status: 500 },
    );
  }
}
