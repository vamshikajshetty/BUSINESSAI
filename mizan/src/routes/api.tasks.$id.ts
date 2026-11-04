
import { createFileRoute } from "@tanstack/react-router";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/server/db";
import { getUserIdFromRequest } from "@/lib/server/auth";

const PRIORITIES = ["Low", "Medium", "High"];
const STATUSES = ["To do", "In progress", "Done"];

export const Route = createFileRoute("/api/tasks/$id")({
  server: {
    handlers: {
      PATCH: async ({ request, params }) => {
        try {
          const userId = getUserIdFromRequest(request);
          const { id } = params;

          if (!userId || !ObjectId.isValid(userId)) {
            return Response.json(
              { success: false, message: "Unauthorized." },
              { status: 401 },
            );
          }

          if (!ObjectId.isValid(id)) {
            return Response.json(
              { success: false, message: "Invalid task ID." },
              { status: 400 },
            );
          }

          const body = await request.json();
          const updates: Record<string, string | Date> = {};

          if (body.title !== undefined) {
            if (
              typeof body.title !== "string" ||
              !body.title.trim() ||
              body.title.trim().length > 200
            ) {
              return Response.json(
                { success: false, message: "Invalid task title." },
                { status: 400 },
              );
            }
            updates.title = body.title.trim();
          }

          if (body.assignee !== undefined) {
            if (
              typeof body.assignee !== "string" ||
              body.assignee.length > 120
            ) {
              return Response.json(
                { success: false, message: "Invalid assignee." },
                { status: 400 },
              );
            }
            updates.assignee = body.assignee.trim();
          }

          if (body.priority !== undefined) {
            if (!PRIORITIES.includes(body.priority)) {
              return Response.json(
                { success: false, message: "Invalid priority." },
                { status: 400 },
              );
            }
            updates.priority = body.priority;
          }

          if (body.status !== undefined) {
            if (!STATUSES.includes(body.status)) {
              return Response.json(
                { success: false, message: "Invalid status." },
                { status: 400 },
              );
            }
            updates.status = body.status;
          }

          if (body.due !== undefined) {
            if (
              body.due !== "" &&
              (typeof body.due !== "string" ||
                !/^\d{4}-\d{2}-\d{2}$/.test(body.due))
            ) {
              return Response.json(
                { success: false, message: "Invalid due date." },
                { status: 400 },
              );
            }
            updates.due = body.due;
          }

          if (Object.keys(updates).length === 0) {
            return Response.json(
              { success: false, message: "No valid updates provided." },
              { status: 400 },
            );
          }

          updates.updatedAt = new Date();

          const db = await getDb();

          const result = await db.collection("tasks").updateOne(
            { _id: new ObjectId(id), userId },
            { $set: updates },
          );

          if (!result.matchedCount) {
            return Response.json(
              { success: false, message: "Task not found." },
              { status: 404 },
            );
          }

          return Response.json({
            success: true,
            message: "Task updated successfully.",
          });
        } catch (error) {
          console.error("Update task error:", error);

          return Response.json(
            { success: false, message: "Unable to update task." },
            { status: 500 },
          );
        }
      },

      DELETE: async ({ request, params }) => {
        try {
          const userId = getUserIdFromRequest(request);
          const { id } = params;

          if (!userId || !ObjectId.isValid(userId)) {
            return Response.json(
              { success: false, message: "Unauthorized." },
              { status: 401 },
            );
          }

          if (!ObjectId.isValid(id)) {
            return Response.json(
              { success: false, message: "Invalid task ID." },
              { status: 400 },
            );
          }

          const db = await getDb();

          const result = await db.collection("tasks").deleteOne({
            _id: new ObjectId(id),
            userId,
          });

          if (!result.deletedCount) {
            return Response.json(
              { success: false, message: "Task not found." },
              { status: 404 },
            );
          }

          return Response.json({
            success: true,
            message: "Task deleted successfully.",
          });
        } catch (error) {
          console.error("Delete task error:", error);

          return Response.json(
            { success: false, message: "Unable to delete task." },
            { status: 500 },
          );
        }
      },
    },
  },
});
