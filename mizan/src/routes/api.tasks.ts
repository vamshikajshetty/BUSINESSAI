
import { createFileRoute } from "@tanstack/react-router";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/server/db";
import { getUserIdFromRequest } from "@/lib/server/auth";

const PRIORITIES = ["Low", "Medium", "High"];
const STATUSES = ["To do", "In progress", "Done"];

export const Route = createFileRoute("/api/tasks")({
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

          const tasks = await db
            .collection("tasks")
            .find({ userId })
            .sort({ createdAt: -1 })
            .toArray();

          return Response.json({
            success: true,
            tasks: tasks.map((task) => ({
              id: task._id.toString(),
              title: task.title,
              assignee: task.assignee ?? "",
              priority: task.priority ?? "Medium",
              status: task.status ?? "To do",
              due: task.due ?? "",
            })),
          });
        } catch (error) {
          console.error("Fetch tasks error:", error);

          return Response.json(
            { success: false, message: "Unable to load tasks." },
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
          const assignee = String(body.assignee ?? "").trim();
          const priority = body.priority ?? "Medium";
          const due = String(body.due ?? "");

          if (!title || title.length > 200) {
            return Response.json(
              { success: false, message: "Task title is required (maximum 200 characters)." },
              { status: 400 },
            );
          }

          if (assignee.length > 120) {
            return Response.json(
              { success: false, message: "Assignee name is too long." },
              { status: 400 },
            );
          }

          if (!PRIORITIES.includes(priority)) {
            return Response.json(
              { success: false, message: "Invalid priority." },
              { status: 400 },
            );
          }

          if (due && !/^\d{4}-\d{2}-\d{2}$/.test(due)) {
            return Response.json(
              { success: false, message: "Invalid due date." },
              { status: 400 },
            );
          }

          const db = await getDb();

          const task = {
            userId,
            title,
            assignee: assignee || "Unassigned",
            priority,
            status: "To do",
            due,
            createdAt: new Date(),
            updatedAt: new Date(),
            isDemo: false,
          };

          const result = await db.collection("tasks").insertOne(task);

          return Response.json(
            {
              success: true,
              message: "Task created successfully.",
              task: {
                id: result.insertedId.toString(),
                title: task.title,
                assignee: task.assignee,
                priority: task.priority,
                status: task.status,
                due: task.due,
              },
            },
            { status: 201 },
          );
        } catch (error) {
          console.error("Create task error:", error);

          return Response.json(
            { success: false, message: "Unable to create task." },
            { status: 500 },
          );
        }
      },
    },
  },
});
