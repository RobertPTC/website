import {
  Session,
  handleAuth,
  handleCallback,
  handleLogin,
} from "@auth0/nextjs-auth0";
import { NextApiRequest } from "next";
import { NextRequest } from "next/server";
import postgres from "postgres";

async function afterCallback(
  req: NextRequest,
  session: Session,
  state: { [key: string]: any } | undefined
): Promise<Session | undefined> {
  const sql = postgres(process.env.DB_URI || "", {
    password: process.env.DB_PASSWORD,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  const journalist =
    await sql`SELECT count(1) > 0 FROM journalist WHERE email = ${session.user.email};`;
  if (journalist[0]["?column?"]) {
    return session;
  }
  await sql`INSERT INTO journalist ${sql({ email: session.user.email })};`;
  return session;
}

function loginCallback(req: NextRequest | NextApiRequest) {
  console.log("req headers", req.headers);
  let referer: string;
  if (req.headers instanceof Headers) {
    console.log("get referer ", req.headers.get("referer"));
  } else {
    console.log("mapped referer ", req.headers["referer"]);
  }
  return {};
}

export const GET = handleAuth({
  login: handleLogin(loginCallback),
  callback: handleCallback({ afterCallback }),
});
