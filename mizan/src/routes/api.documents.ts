
import { createFileRoute } from "@tanstack/react-router";
import { GridFSBucket, ObjectId } from "mongodb";
import { getDb } from "@/lib/server/db";
import { getUserIdFromRequest } from "@/lib/server/auth";

export const Route = createFileRoute("/api/documents")({
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

          const documents = await db
            .collection("documents")
            .find({ userId })
            .sort({ uploadedAt: -1 })
            .toArray();

          return Response.json({
            success: true,
            documents: documents.map((doc) => ({
              id: doc._id.toString(),
              name: doc.name,
              size: doc.size ?? 0,
              category: doc.category ?? "Other",
              issueDate: doc.issueDate ?? "",
              expiry: doc.expiryDate ?? doc.expiry ?? "",
              uploadedAt: doc.uploadedAt ?? doc.createdAt,
              hasFile: Boolean(doc.fileId),
            })),
          });
        } catch (error) {
          console.error("Fetch documents error:", error);

          return Response.json(
            { success: false, message: "Unable to load documents." },
            { status: 500 },
          );
        }
      },

      POST: async ({ request }) => {
        let uploadedFileId: ObjectId | null = null;

        try {
          const userId = getUserIdFromRequest(request);

          if (!userId || !ObjectId.isValid(userId)) {
            return Response.json(
              { success: false, message: "Unauthorized." },
              { status: 401 },
            );
          }

          const formData = await request.formData();
          const file = formData.get("file");

          if (!(file instanceof File)) {
            return Response.json(
              { success: false, message: "Please select a PDF file." },
              { status: 400 },
            );
          }

          if (file.type !== "application/pdf") {
            return Response.json(
              { success: false, message: "Only PDF files are allowed." },
              { status: 400 },
            );
          }

          const MAX_FILE_SIZE = 10 * 1024 * 1024;

          if (file.size === 0 || file.size > MAX_FILE_SIZE) {
            return Response.json(
              {
                success: false,
                message: "PDF must be between 1 byte and 10 MB.",
              },
              { status: 400 },
            );
          }

          const db = await getDb();
          const bucket = new GridFSBucket(db, {
            bucketName: "documentFiles",
          });

          const buffer = Buffer.from(await file.arrayBuffer());
          const uploadStream = bucket.openUploadStream(file.name, {
            contentType: "application/pdf",
            metadata: {
              userId,
              uploadedBy: userId,
            },
          });

          uploadedFileId = uploadStream.id as ObjectId;

          await new Promise<void>((resolve, reject) => {
            uploadStream.once("finish", resolve);
            uploadStream.once("error", reject);
            uploadStream.end(buffer);
          });

          const category = String(formData.get("category") || "Other");
          const issueDate = String(formData.get("issueDate") || "");
          const expiryDate = String(formData.get("expiryDate") || "");

          const result = await db.collection("documents").insertOne({
            userId,
            name: file.name,
            size: file.size,
            category,
            issueDate,
            expiryDate,
            fileId: uploadedFileId,
            uploadedAt: new Date().toISOString(),
            isDemo: false,
          });

          return Response.json(
            {
              success: true,
              message: "Document uploaded successfully.",
              document: {
                id: result.insertedId.toString(),
                name: file.name,
                size: file.size,
                category,
                issueDate,
                expiry: expiryDate,
                uploadedAt: new Date().toISOString(),
                hasFile: true,
              },
            },
            { status: 201 },
          );
        } catch (error) {
          console.error("Upload document error:", error);

          if (uploadedFileId) {
            try {
              const db = await getDb();
              await new GridFSBucket(db, {
                bucketName: "documentFiles",
              }).delete(uploadedFileId);
            } catch (cleanupError) {
              console.error("File cleanup error:", cleanupError);
            }
          }

          return Response.json(
            { success: false, message: "Unable to upload document." },
            { status: 500 },
          );
        }
      },
    },
  },
});
