import { UserRole } from "@/types/enums";
import { jwtVerify } from "jose";

export interface AccessTokenPayload {
  sub: number;
  email: string;
  role: UserRole;
}

export async function getPayloadFromToken(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify<AccessTokenPayload>(token, secret);
    return payload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
