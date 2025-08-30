import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const oracles = await db.oracle.findMany({});
  return NextResponse.json({ oracles });
};
