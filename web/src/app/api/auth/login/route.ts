import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// POST /api/auth/login
// Body: { address: string }
export const POST = async (req: Request) => {
  try {
    const { address } = await req.json();
    if (!address || typeof address !== "string" || address.length !== 42) {
      return NextResponse.json({ error: "Invalid address" }, { status: 400 });
    }

    console.log("Authenticating address:", address);
    const [government, producer, oracle] = await Promise.all([
      db.government.findFirst({ where: { address } }),
      db.producer.findFirst({ where: { address } }),
      db.oracle.findFirst({ where: { address } }),
    ]);

    let role = null;
    if (government) role = "Government";
    else if (producer) role = "Applicant";
    else if (oracle) role = "Oracle";

    if (!role) {
      await db.producer.create({ data: { address } });
      role = "Applicant";
    }

    return NextResponse.json({ address, role });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};
