import { NextRequest, NextResponse } from "next/server";
import superjson from "superjson";
import { appRouter } from "@/server/routers/_app";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function handler(req: NextRequest) {
  const { searchParams, pathname } = req.nextUrl;
  const paths = pathname.split("/api/trpc/");
  const path = paths[1];

  if (!path) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }

  const input = searchParams.get("input");
  const isBatched = searchParams.get("batch") === "1";
  const caller = appRouter.createCaller({});

  // Handle batched requests with multiple procedures (e.g. "proc1,proc2")
  const procedures = path.split(",");

  const parsedInputs: Record<string, any> = {};
  if (input) {
    const parsed = JSON.parse(input);
    for (const key of Object.keys(parsed)) {
      parsedInputs[key] = superjson.deserialize(parsed[key]);
    }
  }

  try {
    const responses = await Promise.all(
      procedures.map(async (procedurePath, index) => {
        const procedureInput =
          parsedInputs[String(index)] ?? parsedInputs["0"] ?? undefined;

        const result = await caller.query(
          procedurePath as any,
          procedureInput,
        );
        const serializedResult = superjson.serialize(result);

        return {
          id: null,
          result: {
            type: "data",
            data: serializedResult,
          },
        };
      }),
    );

    return NextResponse.json(isBatched ? responses : responses[0]);
  } catch (error) {
    console.error("tRPC error:", error);
    const errorResponse = {
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
      },
    };
    return NextResponse.json(errorResponse, {
      status: 500,
    });
  }
}

export { handler as GET, handler as POST };
