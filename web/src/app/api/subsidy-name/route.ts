import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address");
    if (!address) {
      return NextResponse.json({ error: "Missing address" }, { status: 400 });
    }
    console.log("Fetching subsidy name for:", address);
    const subsidy = await db.subsidy.findFirst({
      where: {
        contractAddress: address,
      },
    });
    return NextResponse.json({ name: subsidy?.name || "Unknown Subsidy" });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 400 }
    );
  }
};
