import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  address: z.string().length(42),
});

export const POST = async (req: Request) => {
  try {
    const { address } = bodySchema.parse(await req.json());

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
      return NextResponse.json(
        { error: "Address not registered" },
        { status: 401 }
      );
    }

    return NextResponse.json({ address, role });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};
