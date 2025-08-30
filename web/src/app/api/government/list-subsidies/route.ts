import { z } from "zod";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const querySchema = z.object({
  address: z.string().min(42).max(42).optional(),
  role: z.enum(["Government", "Applicant", "Oracle"]),
});

export const GET = async (req: Request) => {
  try {
    const url = new URL(req.url);
    const address = url.searchParams.get("address");
    const role = url.searchParams.get("role");

    if (!role) {
      return new Response(
        JSON.stringify({
          error: "Missing role parameter",
        }),
        { status: 400 }
      );
    }

    const result = querySchema.safeParse({ address, role });

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid query parameters",
          details: result.error.issues,
        }),
        { status: 400 }
      );
    }

    let subsidies;

    if (!address)
      return NextResponse.json(
        {
          error: "Missing address parameter",
        },
        { status: 400 }
      );

    if (role === "Government") {
      subsidies = await db.subsidy.findMany({
        where: { government: { address } },
        include: {
          government: true,
          producer: true,
          oracles: true,
        },
        orderBy: { id: "desc" },
      });
    } else if (role === "Applicant") {
      // Get all subsidies (for admin view)
      subsidies = await db.subsidy.findMany({
        include: {
          government: true,
          producer: true,
          oracles: true,
        },
        orderBy: { id: "desc" },
        where: { producer: { address } },
      });
    } else if (role === "Oracle") {
      subsidies = await db.subsidy.findMany({
        include: {
          government: true,
          producer: true,
          oracles: true,
        },
        orderBy: { id: "desc" },
        where: { oracles: { some: { address } } },
      });
    }

    return NextResponse.json({
      success: true,
      subsidies: subsidies,
    });
  } catch (error) {
    console.error("Error fetching subsidies:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
