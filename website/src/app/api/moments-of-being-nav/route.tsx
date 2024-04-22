import { NextRequest } from "next/server";
import postgres from "postgres";

export function GET(request: NextRequest) {
  const sql = postgres(process.env.DB_URI || "", {
    password: process.env.DB_PASSWORD,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  return Response.json({}, { status: 200 });
}
