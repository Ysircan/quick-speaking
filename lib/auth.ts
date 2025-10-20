// D:\quick\lib\auth.ts
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

const SECRET: Secret = process.env.JWT_SECRET as string;

export type JwtPayload = {
  uid: string;
  admin: boolean;
  ver: boolean;
  pwdv?: number | null;
};

// ✅ 用数字秒数，避免 StringValue 类型冲突
export function signJwt(payload: JwtPayload, expiresInSeconds = 7 * 24 * 60 * 60) {
  const opts: SignOptions = { expiresIn: expiresInSeconds };
  return jwt.sign(payload, SECRET, opts);
}

export function verifyJwt<T = JwtPayload>(token: string): T | null {
  try {
    return jwt.verify(token, SECRET) as T;
  } catch {
    return null;
  }
}

export function normEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function getUserForLogin(emailRaw: string) {
  const email = normEmail(emailRaw);
  return prisma.user.findUnique({ where: { email } });
}
