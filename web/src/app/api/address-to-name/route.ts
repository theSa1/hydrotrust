import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// GET /api/address-to-name?address=0x...
export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");
  if (!address) {
    return NextResponse.json({ error: "Missing address" }, { status: 400 });
  }

  // Try to find in Producer
  const producer = await db.producer.findFirst({ where: { address } });
  if (producer)
    return NextResponse.json({ name: producer.name, type: "producer" });

  // Try to find in Oracle
  const oracle = await db.oracle.findFirst({ where: { address } });
  if (oracle) return NextResponse.json({ name: oracle.name, type: "oracle" });

  // Try to find in Government
  const government = await db.government.findFirst({ where: { address } });
  if (government)
    return NextResponse.json({ name: "Government", type: "government" });

  return NextResponse.json({ name: address, type: "unknown" });
};
