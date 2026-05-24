import { NextRequest } from "next/server";
import { POST as mainPOST } from "../route";

export async function POST(request: NextRequest) {
  return mainPOST(request);
}
