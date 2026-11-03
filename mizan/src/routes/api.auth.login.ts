
import { createFileRoute } from "@tanstack/react-router";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/server/db";
import { createAuthToken, createAuthCookie } from "@/lib/server/auth";

export const Route = createFileRoute("/api/auth/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const email = String(body.email ?? "").trim().toLowerCase();
          const password = String(body.password ?? "");

          if (!email || !password) {
            return Response.json(
              { success: false, message: "Email and password are required." },
              { status: 400 },
            );
          }

          const db = await getDb();
          const user = await db.collection("users").findOne({ email });

          if (!user || typeof user.passwordHash !== "string") {
            return Response.json(
              { success: false, message: "Invalid email or password." },
              { status: 401 },
            );
          }

          const validPassword = await bcrypt.compare(
            password,
            user.passwordHash,
          );

          if (!validPassword) {
            return Response.json(
              { success: false, message: "Invalid email or password." },
              { status: 401 },
            );
          }

          const token = createAuthToken(user._id.toString());

          return Response.json(
            {
              success: true,
              message: "Signed in successfully.",
              user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
              },
            },
            {
              headers: { "Set-Cookie": createAuthCookie(token) },
            },
          );
        } catch (error) {
          console.error("Login error:", error);

          return Response.json(
            { success: false, message: "Unable to sign in." },
            { status: 500 },
          );
        }
      },
    },
  },
});
