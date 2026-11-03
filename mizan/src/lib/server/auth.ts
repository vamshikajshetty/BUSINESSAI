
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing from environment variables");
}

export function createAuthToken(userId: string) {
  return jwt.sign({ sub: userId }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function createAuthCookie(token: string) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";

  return [
    `mizan_token=${token}`,
    "HttpOnly",
    "SameSite=Lax",
    "Path=/",
    "Max-Age=604800",
  ].join("; ") + secure;
}

export function clearAuthCookie() {
  return "mizan_token=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0";
}

export function getUserIdFromRequest(request: Request): string | null {
  const cookie = request.headers.get("cookie") ?? "";
  const token = cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("mizan_token="))
    ?.slice("mizan_token=".length);

  if (!token) return null;

  try {
    const payload = jwt.verify(token, JWT_SECRET!) as jwt.JwtPayload;
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}
