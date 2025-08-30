import { z } from "zod";
import { db } from "@/lib/db";

const bodySchema = z.object({
  name: z.string().min(3).max(100),
  governmentAddress: z.string().min(42).max(42),
  producerAddress: z.string().min(42).max(42),
  oracles: z.array(z.string().min(42).max(42)),
  contractAddress: z.string().min(42).max(42),
});

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const result = bodySchema.safeParse(body);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid input",
          details: result.error.issues,
        }),
        { status: 400 }
      );
    }

    const {
      name,
      governmentAddress,
      producerAddress,
      oracles,
      contractAddress,
    } = result.data;

    // Create or find government
    let government = await db.government.findFirst({
      where: { address: governmentAddress },
    });

    if (!government) {
      government = await db.government.create({
        data: { address: governmentAddress },
      });
    }

    // Create or find producer
    let producer = await db.producer.findFirst({
      where: { address: producerAddress },
    });

    if (!producer) {
      producer = await db.producer.create({
        data: { address: producerAddress },
      });
    }

    // Create or find oracles
    const oracleRecords = await Promise.all(
      oracles.map(async (oracleAddress) => {
        let oracle = await db.oracle.findFirst({
          where: { address: oracleAddress },
        });
        if (!oracle) {
          return;
        }

        return oracle;
      })
    );

    // Create subsidy
    const subsidy = await db.subsidy.create({
      data: {
        name,
        governmentId: government.id,
        producerId: producer.id,
        contractAddress,
        oracles: {
          connect: oracleRecords
            .filter((oracle) => !!oracle)
            .map((oracle) => ({ id: oracle.id })),
        },
      },
      include: {
        government: true,
        producer: true,
        oracles: true,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        subsidy: subsidy,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating subsidy:", error);
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
