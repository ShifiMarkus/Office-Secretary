/**
 * שכבת ההתחברות. כרגע: מצב הדגמה (בחירת משתמש לדוגמה).
 * בהמשך יתווסף כאן חיבור Microsoft Entra ID — בלי לשנות את שאר המערכת.
 */
import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, timingSafeEqual } from "node:crypto";
import { db } from "./db";
import { config } from "./config";

const COOKIE = "os_session";

function sign(value: string): string {
  const mac = createHmac("sha256", config.sessionSecret).update(value).digest("base64url");
  return `${value}.${mac}`;
}

function verify(token: string | undefined): string | null {
  if (!token) return null;
  const i = token.lastIndexOf(".");
  if (i < 0) return null;
  const value = token.slice(0, i);
  const expected = Buffer.from(sign(value));
  const got = Buffer.from(token);
  return expected.length === got.length && timingSafeEqual(expected, got) ? value : null;
}

export async function startSession(userId: string) {
  (await cookies()).set(COOKIE, sign(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function getCurrentUser() {
  const id = verify((await cookies()).get(COOKIE)?.value);
  if (!id) return null;
  return db.user.findUnique({ where: { id }, include: { team: true } });
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireManager() {
  const user = await requireUser();
  if (user.role !== "MANAGER") redirect("/");
  return user;
}

export type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;
