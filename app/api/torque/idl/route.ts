import { NextRequest, NextResponse } from "next/server";
import { parseIdl, createIdl, listIdls } from "@/lib/torque/idl";

export async function GET() {
  try {
    const idls = await listIdls();
    return NextResponse.json({ idls });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, idl, displayName, description, programAddress, selectedInstructions } = body;

    if (action === "parse") {
      const result = await parseIdl({ idl });
      return NextResponse.json(result);
    }

    if (action === "create") {
      const result = await createIdl({ idl, displayName, description, programAddress, selectedInstructions });
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
