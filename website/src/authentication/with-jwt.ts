import { jwtSession } from "@app/cookies";
import { NextRequest, NextResponse } from "next/server";
import verifyJWT from "./verify-jwt";

export default function withJWT(
  callback: (req?: NextRequest) => Promise<NextResponse>
) {
  return async function (request: NextRequest) {
    try {
      const jwt = request.cookies.get(jwtSession);
      if (!jwt) {
        throw new Error("no jwt");
      }
      const isValidJWT = verifyJWT(jwt.value);
      if (!isValidJWT) {
        throw new Error("invalid JWT");
      }
      return callback(request);
    } catch (error) {
      console.error("error ", error);
      return callback();
    }
  };
}
