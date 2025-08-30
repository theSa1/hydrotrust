import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const producers = await db.producer.findMany({});
  return NextResponse.json({ producers });
};
