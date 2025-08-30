import { z } from "zod";
import { db } from "@/lib/db";

const querySchema = z.object({
  governmentAddress: z.string().min(42).max(42).optional(),
});

export const GET = async (req: Request) => {
  try {
    const url = new URL(req.url);
    const governmentAddress = url.searchParams.get("governmentAddress");

    const result = querySchema.safeParse({ governmentAddress });

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

    if (governmentAddress) {
      // Get subsidies for a specific government
      const government = await db.government.findFirst({
        where: { address: governmentAddress },
      });

      if (!government) {
        return new Response(
          JSON.stringify({
            success: true,
            subsidies: [],
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      subsidies = await db.subsidy.findMany({
        where: { governmentId: government.id },
        include: {
          government: true,
          producer: true,
          oracles: true,
        },
        orderBy: { id: "desc" },
      });
    } else {
      // Get all subsidies (for admin view)
      subsidies = await db.subsidy.findMany({
        include: {
          government: true,
          producer: true,
          oracles: true,
        },
        orderBy: { id: "desc" },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        subsidies: subsidies,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
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
