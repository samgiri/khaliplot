import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "kp_admin_session";
const SESSION_VALUE = "authenticated";

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET or ADMIN_PASSWORD must be set");
  }
  return secret;
}

function sign(value: string): string {
  const hmac = createHmac("sha256", getSecret());
  hmac.update(value);
  return hmac.digest("hex");
}

function makeToken(): string {
  const signature = sign(SESSION_VALUE);
  return `${SESSION_VALUE}.${signature}`;
}

function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const [value, signature] = token.split(".");
  if (value !== SESSION_VALUE || !signature) return false;

  const expected = sign(SESSION_VALUE);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Checks the provided password against ADMIN_PASSWORD. */
export function checkPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;

  const a = Buffer.from(password);
  const b = Buffer.from(adminPassword);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Sets the admin session cookie after a successful login. */
export async function createSession() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, makeToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/** Clears the admin session cookie (logout). */
export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/** Returns true if the current request has a valid admin session. */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return verifyToken(token);
}
