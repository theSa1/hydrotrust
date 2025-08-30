import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { name, address } = await req.json();
    if (!name || !address) {
      return NextResponse.json(
        { error: "Name and address are required." },
        { status: 400 }
      );
    }
    const oracle = await db.oracle.create({ data: { name, address } });
    return NextResponse.json({ oracle });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add oracle." },
      { status: 500 }
    );
  }
};
