import * as jose from "jose";
import { Role } from "@prisma/client";

import { UserT } from "@/types";

export const createAccessToken = (user: UserT) => {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  const token = new jose.SignJWT({ user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(secret);

  return token;
};

export const decodeAccessToken = async (token: string) => {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const { payload } = await jose.jwtVerify(token, secret, {
    algorithms: ["HS256"],
  });

  if (!payload.user) return null;

  return payload.user as UserT;
};

export const hasRole = (user: UserT, roles: Role[]) => {
  return roles.includes(user.role);
};
