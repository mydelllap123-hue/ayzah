import { NextResponse } from "next/server";

export async function DELETE() {
  return NextResponse.json(
    { error: "Category deletion is permanently disabled." },
    { status: 405 }
  );
}
