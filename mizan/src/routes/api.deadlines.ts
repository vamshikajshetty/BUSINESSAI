
import { createFileRoute } from "@tanstack/react-router";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/server/db";
import { getUserIdFromRequest } from "@/lib/server/auth";

const TYPES = [
  "Trade Licence",
  "Ejari",
  "Visa",
  "Employee Permit",
  "Tax",
  "Other",
];

export const Route = createFileRoute("/api/deadlines")({
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

          const deadlines = await db
            .collection("deadlines")
            .find({ userId })
            .sort({ date: 1 })
            .toArray();

          return Response.json({
            success: true,
            deadlines: deadlines.map((deadline) => ({
              id: deadline._id.toString(),
              title: deadline.title,
              type: deadline.type ?? "Other",
              date: deadline.date,
            })),
          });
        } catch (error) {
          console.error("Fetch deadlines error:", error);

          return Response.json(
            { success: false, message: "Unable to load deadlines." },
            { status: 500 },
          );
        }
      },

      POST: async ({ request }) => {
        try {
          const userId = getUserIdFromRequest(request);

          if (!userId || !ObjectId.isValid(userId)) {
            return Response.json(
              { success: false, message: "Unauthorized." },
              { status: 401 },
            );
          }

          const body = await request.json();

          const title = String(body.title ?? "").trim();
          const type = String(body.type ?? "Other");
          const date = String(body.date ?? "");

          if (!title || title.length > 200) {
            return Response.json(
              {
                success: false,
                message: "Deadline title is required (maximum 200 characters).",
              },
              { status: 400 },
            );
          }

          if (!TYPES.includes(type)) {
            return Response.json(
              { success: false, message: "Invalid deadline type." },
              { status: 400 },
            );
          }

          if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return Response.json(
              { success: false, message: "A valid deadline date is required." },
              { status: 400 },
            );
          }

          const parsedDate = new Date(`${date}T00:00:00.000Z`);

          if (
            Number.isNaN(parsedDate.getTime()) ||
            parsedDate.toISOString().slice(0, 10) !== date
          ) {
            return Response.json(
              { success: false, message: "Invalid calendar date." },
              { status: 400 },
            );
          }

          const db = await getDb();

          const deadline = {
            userId,
            title,
            type,
            date,
            createdAt: new Date(),
            updatedAt: new Date(),
            isDemo: false,
          };

          const result = await db
            .collection("deadlines")
            .insertOne(deadline);

          return Response.json(
            {
              success: true,
              message: "Deadline created successfully.",
              deadline: {
                id: result.insertedId.toString(),
                title: deadline.title,
                type: deadline.type,
                date: deadline.date,
              },
            },
            { status: 201 },
          );
        } catch (error) {
          console.error("Create deadline error:", error);

          return Response.json(
            { success: false, message: "Unable to create deadline." },
            { status: 500 },
          );
        }
      },
    },
  },
});
