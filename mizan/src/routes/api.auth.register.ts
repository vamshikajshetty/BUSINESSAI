
import { createFileRoute } from "@tanstack/react-router";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/server/db";
import { createAuthToken, createAuthCookie } from "@/lib/server/auth";

export const Route = createFileRoute("/api/auth/register")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const name = String(body.name ?? "").trim();
          const email = String(body.email ?? "").trim().toLowerCase();
          const password = String(body.password ?? "");

          if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return Response.json(
              { success: false, message: "Enter a valid name and email." },
              { status: 400 },
            );
          }

          if (password.length < 8) {
            return Response.json(
              { success: false, message: "Password must be at least 8 characters." },
              { status: 400 },
            );
          }

          const db = await getDb();
          const users = db.collection("users");

          await users.createIndex({ email: 1 }, { unique: true });

          const existing = await users.findOne({ email });

          if (existing) {
            return Response.json(
              { success: false, message: "An account with this email already exists." },
              { status: 409 },
            );
          }

          const passwordHash = await bcrypt.hash(password, 12);
          const result = await users.insertOne({
            name,
            email,
            passwordHash,
            createdAt: new Date(),
          });

          const token = createAuthToken(result.insertedId.toString());

          return Response.json(
            {
              success: true,
              message: "Account created successfully.",
              user: { id: result.insertedId.toString(), name, email },
            },
            {
              status: 201,
              headers: { "Set-Cookie": createAuthCookie(token) },
            },
          );
        } catch (error) {
          console.error("Registration error:", error);

          return Response.json(
            { success: false, message: "Unable to create account." },
            { status: 500 },
          );
        }
      },
    },
  },
});
