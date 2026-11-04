
import { createFileRoute } from "@tanstack/react-router";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/server/db";
import { getUserIdFromRequest } from "@/lib/server/auth";

const STATUSES = ["Approved", "Rejected"];

export const Route = createFileRoute("/api/approvals")({
  server: {
    handlers: {
      // GET: Fetch approvals belonging to the authenticated user
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

          const approvals = await db
            .collection("approvals")
            .find({ userId })
            .sort({ createdAt: -1 })
            .toArray();

          return Response.json({
            success: true,
            approvals: approvals.map((item) => ({
              id: item._id.toString(),
              action: item.action,
              reason: item.reason ?? "",
              status: item.status,
              executionStatus: item.executionStatus ?? "Not executed",
              createdAt: item.createdAt,
              decidedAt: item.decidedAt ?? null,
            })),
          });
        } catch (error) {
          console.error("Fetch approvals error:", error);

          return Response.json(
            { success: false, message: "Unable to load approvals." },
            { status: 500 },
          );
        }
      },

      // POST: Create a new approval request
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

          const action =
            typeof body.action === "string" ? body.action.trim() : "";

          const reason =
            typeof body.reason === "string" ? body.reason.trim() : "";

          if (!action || action.length > 300) {
            return Response.json(
              { success: false, message: "A valid action is required." },
              { status: 400 },
            );
          }

          if (reason.length > 1000) {
            return Response.json(
              { success: false, message: "Reason is too long." },
              { status: 400 },
            );
          }

          const db = await getDb();

          const approval = {
            userId,
            action,
            reason,
            status: "Pending",
            executionStatus: "Not executed",
            createdAt: new Date(),
            decidedAt: null,
            executedAt: null,
          };

          const result = await db
            .collection("approvals")
            .insertOne(approval);

          return Response.json(
            {
              success: true,
              message: "Approval request created.",
              approval: {
                id: result.insertedId.toString(),
                action,
                reason,
                status: "Pending",
                executionStatus: "Not executed",
                createdAt: approval.createdAt,
                decidedAt: null,
              },
            },
            { status: 201 },
          );
        } catch (error) {
          console.error("Create approval error:", error);

          return Response.json(
            { success: false, message: "Unable to create approval." },
            { status: 500 },
          );
        }
      },

      // PATCH: Approve or reject a pending request
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

          const id = String(body.id ?? "");
          const status = body.status;

          if (!ObjectId.isValid(id)) {
            return Response.json(
              { success: false, message: "Invalid approval ID." },
              { status: 400 },
            );
          }

          if (!STATUSES.includes(status)) {
            return Response.json(
              { success: false, message: "Invalid approval status." },
              { status: 400 },
            );
          }

          const db = await getDb();

          const result = await db.collection("approvals").updateOne(
            {
              _id: new ObjectId(id),
              userId,
              status: "Pending",
            },
            {
              $set: {
                status,
                decidedAt: new Date(),
                updatedAt: new Date(),
              },
            },
          );

          if (result.matchedCount === 0) {
            return Response.json(
              {
                success: false,
                message:
                  "Approval not found, already decided, or access denied.",
              },
              { status: 404 },
            );
          }

          return Response.json({
            success: true,
            message: `Approval ${status.toLowerCase()} successfully.`,
            executionStatus: "Not executed",
          });
        } catch (error) {
          console.error("Update approval error:", error);

          return Response.json(
            { success: false, message: "Unable to update approval." },
            { status: 500 },
          );
        }
      },
    },
  },
});
