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

  // tRPC v9 batched format: { "0": { actualInput } }
  let parsedInput: any;
  if (input) {
    const parsed = JSON.parse(input);
    // Extract from batched format - input is directly under "0", not "0".json
    const rawInput = parsed?.["0"] ?? parsed;
    // Deserialize with superjson to handle Date and other complex types
    parsedInput = superjson.deserialize(rawInput);
    console.log("Parsed input:", parsedInput);
  }

  try {
    const caller = appRouter.createCaller({});

    // tRPC v9 createCaller uses caller.query(path, input) pattern
    const result = await caller.query(path as any, parsedInput);

    // Serialize with superjson to handle Date and other complex types
    const serializedResult = superjson.serialize(result);

    // tRPC v9 expects: { id: null, result: { type: "data", data: ... } }
    const response = {
      id: null,
      result: {
        type: "data",
        data: serializedResult,
      },
    };

    console.log("tRPC result:", result);
    console.log("Response to be sent:", response);

    // Batched requests (batch=1) expect an array response
    const isBatched = searchParams.get("batch") === "1";
    return NextResponse.json(isBatched ? [response] : response);
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
