import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  address: z.string().min(5).max(100),
  name: z.string().min(2).max(100),
});

export const POST = async (req: Request) => {
  try {
    const data = bodySchema.parse(await req.json());
    const producer = await db.producer.create({
      data: {
        address: data.address,
        name: data.name,
      },
    });
    return NextResponse.json({ producer });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add producer." },
      { status: 500 }
    );
  }
};
