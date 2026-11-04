
import { createFileRoute } from "@tanstack/react-router";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/server/db";
import { getUserIdFromRequest } from "@/lib/server/auth";

export const Route = createFileRoute("/api/business")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const userId = getUserIdFromRequest(request);

          if (!userId || !ObjectId.isValid(userId)) {
            return Response.json(
              { success: false, message: "Unauthorized." },
              { status: 401 },
            );
          }

          const db = await getDb();

          const business = await db.collection("businesses").findOne({
            userId,
          });

          return Response.json({
            success: true,
            business: business
              ? {
                  name: business.name ?? "",
                  activity: business.activity ?? "",
                  location: business.location ?? "",
                  authority: business.authority ?? "",
                  licenceNo: business.licenceNo ?? "",
                  licenceExpiry: business.licenceExpiry ?? "",
                  employees: business.employees ?? 0,
                }
              : null,
          });
        } catch (error) {
          console.error("Fetch business error:", error);

          return Response.json(
            { success: false, message: "Unable to load business profile." },
            { status: 500 },
          );
        }
      },

      PATCH: async ({ request }) => {
        try {
          const userId = getUserIdFromRequest(request);

          if (!userId || !ObjectId.isValid(userId)) {
            return Response.json(
              { success: false, message: "Unauthorized." },
              { status: 401 },
            );
          }

          const body = await request.json();

          const fields = [
            "name",
            "activity",
            "location",
            "authority",
            "licenceNo",
            "licenceExpiry",
            "employees",
          ] as const;

          const updates: Record<string, string | number> = {};

          for (const field of fields) {
            if (body[field] !== undefined) {
              if (field === "employees") {
                const employees = Number(body.employees);

                if (
                  !Number.isInteger(employees) ||
                  employees < 0 ||
                  employees > 1000000
                ) {
                  return Response.json(
                    { success: false, message: "Invalid employee count." },
                    { status: 400 },
                  );
                }

                updates.employees = employees;
              } else {
                if (
                  typeof body[field] !== "string" ||
                  body[field].trim().length > 200
                ) {
                  return Response.json(
                    { success: false, message: `Invalid ${field}.` },
                    { status: 400 },
                  );
                }

                updates[field] = body[field].trim();
              }
            }
          }

          if (Object.keys(updates).length === 0) {
            return Response.json(
              { success: false, message: "No valid profile changes provided." },
              { status: 400 },
            );
          }

          if (
            updates.licenceExpiry &&
            !/^\d{4}-\d{2}-\d{2}$/.test(String(updates.licenceExpiry))
          ) {
            return Response.json(
              { success: false, message: "Invalid licence expiry date." },
              { status: 400 },
            );
          }

          const db = await getDb();

          await db.collection("businesses").updateOne(
            { userId },
            {
              $set: {
                ...updates,
                userId,
                updatedAt: new Date(),
              },
              $setOnInsert: {
                createdAt: new Date(),
                isDemo: false,
              },
            },
            { upsert: true },
          );

          const business = await db.collection("businesses").findOne({
            userId,
          });

          return Response.json({
            success: true,
            message: "Business profile saved successfully.",
            business: {
              name: business?.name ?? "",
              activity: business?.activity ?? "",
              location: business?.location ?? "",
              authority: business?.authority ?? "",
              licenceNo: business?.licenceNo ?? "",
              licenceExpiry: business?.licenceExpiry ?? "",
              employees: business?.employees ?? 0,
            },
          });
        } catch (error) {
          console.error("Update business error:", error);

          return Response.json(
            { success: false, message: "Unable to save business profile." },
            { status: 500 },
          );
        }
      },
    },
  },
});
