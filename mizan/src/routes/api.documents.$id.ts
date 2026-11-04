
import { createFileRoute } from "@tanstack/react-router";
import { GridFSBucket, ObjectId } from "mongodb";
import { Readable } from "node:stream";
import { getDb } from "@/lib/server/db";
import { getUserIdFromRequest } from "@/lib/server/auth";

export const Route = createFileRoute("/api/documents/$id")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
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
              { success: false, message: "Invalid document ID." },
              { status: 400 },
            );
          }

          const db = await getDb();
          const document = await db.collection("documents").findOne({
            _id: new ObjectId(id),
            userId,
          });

          if (!document) {
            return Response.json(
              { success: false, message: "Document not found." },
              { status: 404 },
            );
          }

          if (!document.fileId) {
            return Response.json(
              { success: false, message: "No PDF file is attached to this document." },
              { status: 404 },
            );
          }

          const bucket = new GridFSBucket(db, {
            bucketName: "documentFiles",
          });

          const files = await bucket.find({
            _id: document.fileId,
            "metadata.userId": userId,
          }).toArray();

          if (!files.length) {
            return Response.json(
              { success: false, message: "Stored PDF not found." },
              { status: 404 },
            );
          }

          const stream = bucket.openDownloadStream(document.fileId);

          return new Response(
            Readable.toWeb(stream) as ReadableStream,
            {
              headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": 'inline; filename="document.pdf"',
                "Cache-Control": "private, no-store",
                "X-Content-Type-Options": "nosniff",
              },
            },
          );
        } catch (error) {
          console.error("Document preview error:", error);

          return Response.json(
            { success: false, message: "Unable to preview document." },
            { status: 500 },
          );
        }
      },
      
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
              { success: false, message: "Invalid document ID." },
              { status: 400 },
            );
          }

          const body = await request.json();

          const allowedCategories = [
            "Trade Licence",
            "Ejari",
            "Visa",
            "Employee Permit",
            "Tax",
            "MOA",
            "Other",
          ];

          const updates: Record<string, string> = {};

          if (body.category !== undefined) {
            if (!allowedCategories.includes(body.category)) {
              return Response.json(
                { success: false, message: "Invalid category." },
                { status: 400 },
              );
            }
            updates.category = body.category;
          }

          if (body.issueDate !== undefined) {
            if (
              body.issueDate !== "" &&
              !/^\d{4}-\d{2}-\d{2}$/.test(body.issueDate)
            ) {
              return Response.json(
                { success: false, message: "Invalid issue date." },
                { status: 400 },
              );
            }
            updates.issueDate = body.issueDate;
          }

          if (body.expiryDate !== undefined) {
            if (
              body.expiryDate !== "" &&
              !/^\d{4}-\d{2}-\d{2}$/.test(body.expiryDate)
            ) {
              return Response.json(
                { success: false, message: "Invalid expiry date." },
                { status: 400 },
              );
            }
            updates.expiryDate = body.expiryDate;
          }

          if (Object.keys(updates).length === 0) {
            return Response.json(
              { success: false, message: "No valid updates provided." },
              { status: 400 },
            );
          }

          const db = await getDb();

          const result = await db.collection("documents").updateOne(
            {
              _id: new ObjectId(id),
              userId,
            },
            {
              $set: {
                ...updates,
                updatedAt: new Date(),
              },
            },
          );

          if (!result.matchedCount) {
            return Response.json(
              { success: false, message: "Document not found." },
              { status: 404 },
            );
          }

          return Response.json({
            success: true,
            message: "Document updated successfully.",
          });
        } catch (error) {
          console.error("Document update error:", error);

          return Response.json(
            { success: false, message: "Unable to update document." },
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
              { success: false, message: "Invalid document ID." },
              { status: 400 },
            );
          }

          const db = await getDb();
          const documents = db.collection("documents");

          const document = await documents.findOne({
            _id: new ObjectId(id),
            userId,
          });

          if (!document) {
            return Response.json(
              { success: false, message: "Document not found." },
              { status: 404 },
            );
          }

          await documents.deleteOne({
            _id: document._id,
            userId,
          });

          if (document.fileId) {
            try {
              const bucket = new GridFSBucket(db, {
                bucketName: "documentFiles",
              });

              const files = await bucket.find({
                _id: document.fileId,
                "metadata.userId": userId,
              }).toArray();

              if (files.length) {
                await bucket.delete(document.fileId);
              }
            } catch (fileError) {
              console.error("PDF deletion error:", fileError);
              return Response.json({
                success: true,
                warning: "Document record deleted, but PDF cleanup needs attention.",
              });
            }
          }

          return Response.json({
            success: true,
            message: "Document deleted successfully.",
          });
        } catch (error) {
          console.error("Document deletion error:", error);

          return Response.json(
            { success: false, message: "Unable to delete document." },
            { status: 500 },
          );
        }
      },
    },
  },
});
