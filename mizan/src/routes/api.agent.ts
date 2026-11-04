
import { createFileRoute } from "@tanstack/react-router";
import { ObjectId } from "mongodb";
import Groq from "groq-sdk";
import { getDb } from "@/lib/server/db";
import { getUserIdFromRequest } from "@/lib/server/auth";

const globalForGroq = globalThis as typeof globalThis & {
  groqClient?: Groq;
};

function getGroq() {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("GROQ_API_KEY is missing.");
  }

  if (!globalForGroq.groqClient) {
    globalForGroq.groqClient = new Groq({ apiKey });
  }

  return globalForGroq.groqClient;
}

export const Route = createFileRoute("/api/agent")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          // 1. Authenticate user
          const userId = getUserIdFromRequest(request);

          if (!userId || !ObjectId.isValid(userId)) {
            return Response.json(
              { success: false, message: "Unauthorized." },
              { status: 401 },
            );
          }

          // 2. Validate instruction
          const body = await request.json();

          const instruction =
            typeof body.instruction === "string"
              ? body.instruction.trim().slice(0, 2000)
              : "";

          if (!instruction) {
            return Response.json(
              {
                success: false,
                message: "Please enter an agent request.",
              },
              { status: 400 },
            );
          }

          // 3. Retrieve authenticated business records
          const db = await getDb();

          const [business, documents, deadlines, tasks] =
            await Promise.all([
              db.collection("businesses").findOne({ userId }),

              db.collection("documents")
                .find({ userId })
                .limit(100)
                .toArray(),

              db.collection("deadlines")
                .find({ userId })
                .sort({ date: 1 })
                .limit(100)
                .toArray(),

              db.collection("tasks")
                .find({ userId })
                .sort({ createdAt: -1 })
                .limit(100)
                .toArray(),
            ]);

          const context = {
            business: business
              ? {
                  name: business.name,
                  activity: business.activity,
                  location: business.location,
                  authority: business.authority,
                  licenceExpiry: business.licenceExpiry,
                  employees: business.employees,
                }
              : null,

            documents: documents.map((doc) => ({
              name: doc.name,
              category: doc.category,
              expiry: doc.expiry ?? doc.expiryDate ?? null,
            })),

            deadlines: deadlines.map((item) => ({
              title: item.title,
              type: item.type,
              date: item.date,
            })),

            existingTasks: tasks.map((item) => ({
              title: item.title,
              status: item.status,
              due: item.due ?? null,
            })),
          };

          // 4. Groq system instructions
          const systemPrompt = `
You are Mizan, an AI operations and compliance planning agent for Dubai SMEs.

Analyse the authenticated business context and the user's instruction.

Return ONLY valid JSON with this exact structure:

{
  "summary": "Short explanation of your analysis",
  "findings": [
    {
      "title": "Finding title",
      "detail": "Evidence-based explanation",
      "source": "Business profile, document, deadline, or task record"
    }
  ],
  "tasks": [
    {
      "title": "Actionable task title",
      "priority": "Low",
      "due": "YYYY-MM-DD or null",
      "reason": "Why this task is useful"
    }
  ],
  "approvals": [
    {
      "action": "Proposed external action",
      "reason": "Why approval may be needed"
    }
  ]
}

STRICT RULES:

- Use only supplied records for business-specific facts.
- Never invent documents, dates, deadlines, licence relationships, or legal requirements.
- Distinguish stored deadlines from official government deadlines.
- Do not duplicate existing tasks.
- Only propose tasks relevant to the instruction and actual findings.
- Use existing recorded dates as task due dates only when relevant.
- Never invent due dates. Otherwise return null.
- Priority must be Low, Medium, or High.
- Maximum 10 proposed tasks and 10 findings.
- Maximum 10 approval requests.
- External actions must only be proposed, never executed.
- Never claim to send emails, submit applications, make payments, or contact authorities.
- If information is insufficient, explain the limitation.
- Never invent regulatory fees, penalties, or legal advice.
- Clearly distinguish database facts from general guidance.
- Return empty arrays when no findings, tasks, or approvals are appropriate.
`;

          // 5. Request AI analysis
          const completion = await getGroq().chat.completions.create({
            model:
              process.env.GROQ_MODEL || "openai/gpt-oss-120b",

            messages: [
              {
                role: "system",
                content: systemPrompt,
              },
              {
                role: "user",
                content:
                  `BUSINESS RECORDS:\n${JSON.stringify(context, null, 2)}` +
                  `\n\nUSER REQUEST:\n${instruction}`,
              },
            ],

            temperature: 0.2,
            max_completion_tokens: 2000,
            response_format: { type: "json_object" },
          });

          const content = completion.choices[0]?.message?.content;

          if (!content || typeof content !== "string") {
            throw new Error("The AI returned an empty plan.");
          }

          const plan = JSON.parse(content);

          // 6. Validate proposed tasks
          const validPriorities = ["Low", "Medium", "High"];

          const safeTasks = Array.isArray(plan.tasks)
            ? plan.tasks
                .slice(0, 10)
                .filter(
                  (task: any) =>
                    typeof task.title === "string" &&
                    task.title.trim().length > 0 &&
                    validPriorities.includes(task.priority),
                )
                .map((task: any) => ({
                  title: task.title.trim().slice(0, 200),
                  priority: task.priority,

                  due:
                    typeof task.due === "string" &&
                    /^\d{4}-\d{2}-\d{2}$/.test(task.due)
                      ? task.due
                      : undefined,

                  reason:
                    typeof task.reason === "string"
                      ? task.reason.trim().slice(0, 500)
                      : "",
                }))
            : [];

          // 7. Validate proposed external actions
          const safeApprovals = Array.isArray(plan.approvals)
            ? plan.approvals
                .slice(0, 10)
                .filter(
                  (item: any) =>
                    typeof item.action === "string" &&
                    item.action.trim().length > 0,
                )
                .map((item: any) => ({
                  action: item.action.trim().slice(0, 300),

                  reason:
                    typeof item.reason === "string"
                      ? item.reason.trim().slice(0, 1000)
                      : "",
                }))
            : [];

          // 8. Persist approval requests in MongoDB
          let savedApprovals: any[] = [];

          if (safeApprovals.length > 0) {
            const now = new Date();

            const approvalRecords = safeApprovals.map((item) => ({
              userId,
              ...item,
              status: "Pending",
              executionStatus: "Not executed",
              createdAt: now,
              decidedAt: null,
              executedAt: null,
            }));

            const result = await db
              .collection("approvals")
              .insertMany(approvalRecords);

            savedApprovals = approvalRecords.map((item, index) => ({
              id: result.insertedIds[index].toString(),
              action: item.action,
              reason: item.reason,
              status: item.status,
              executionStatus: item.executionStatus,
              createdAt: item.createdAt,
              decidedAt: null,
            }));
          }

          // 9. Return complete analysis
          return Response.json({
            success: true,

            plan: {
              summary:
                typeof plan.summary === "string"
                  ? plan.summary
                  : "",

              findings: Array.isArray(plan.findings)
                ? plan.findings
                    .filter(
                      (item: any) =>
                        typeof item.title === "string" &&
                        typeof item.detail === "string",
                    )
                    .slice(0, 10)
                : [],

              tasks: safeTasks,

              approvals: savedApprovals,
            },
          });
        } catch (error) {
          console.error("Agent planning error:", error);

          return Response.json(
            {
              success: false,
              message:
                "Mizan could not generate or save the action plan. Please try again.",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});
