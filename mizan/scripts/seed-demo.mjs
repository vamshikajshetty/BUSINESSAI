import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

const {
  MONGODB_URI,
  DB_NAME = "business_ai",
  DEMO_ACCOUNT_NAME,
  DEMO_ACCOUNT_EMAIL,
  DEMO_ACCOUNT_PASSWORD,
} = process.env;

if (!MONGODB_URI || !DEMO_ACCOUNT_NAME ||
    !DEMO_ACCOUNT_EMAIL || !DEMO_ACCOUNT_PASSWORD) {
  throw new Error(
    "Missing MONGODB_URI or demo account variables in .env"
  );
}

const client = new MongoClient(MONGODB_URI);

const today = new Date();
const date = (days) => {
  const d = new Date(today);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

const demoKey = "crescent-digital-demo";

async function seedCollection(collection, records) {
  const operations = records.map((record) => ({
    updateOne: {
      filter: { demoKey: record.demoKey },
      update: {
        $set: {
          ...record,
          updatedAt: new Date(),
        },
      },
      upsert: true,
    },
  }));

  if (operations.length) {
    await collection.bulkWrite(operations);
  }

  console.log(`${collection.collectionName}: ${records.length} demo records ready`);
}

async function main() {
  await client.connect();

  const db = client.db(DB_NAME);
  console.log(`Connected to MongoDB database: ${DB_NAME}`);

  // 1. Create demo user
  const users = db.collection("users");
  const passwordHash = await bcrypt.hash(DEMO_ACCOUNT_PASSWORD, 12);

  await users.updateOne(
    { email: DEMO_ACCOUNT_EMAIL.toLowerCase() },
    {
      $set: {
        name: DEMO_ACCOUNT_NAME,
        email: DEMO_ACCOUNT_EMAIL.toLowerCase(),
        passwordHash,
        isDemo: true,
        updatedAt: new Date(),
      },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true }
  );

  const user = await users.findOne({
    email: DEMO_ACCOUNT_EMAIL.toLowerCase(),
  });

  const userId = user._id.toString();

  console.log("Demo user ready.");

  // 2. Create demo business
  await db.collection("businesses").updateOne(
    { demoKey },
    {
      $set: {
        demoKey,
        userId,
        name: "Crescent Digital Solutions LLC",
        activity: "IT Consultancy",
        location: "Dubai, UAE",
        authority: "Dubai Department of Economy and Tourism",
        licenceNo: "DED-2025-78421",
        licenceExpiry: date(45),
        employees: 12,
        isDemo: true,
        updatedAt: new Date(),
      },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true }
  );

  // 3. Documents
  const documentNames = [
    ["Trade License", "Corporate"],
    ["Memorandum of Association", "Corporate"],
    ["Certificate of Incorporation", "Corporate"],
    ["Establishment Card", "Corporate"],
    ["VAT Registration Certificate", "Tax"],
    ["Corporate Tax Registration", "Tax"],
    ["Emirates ID - Director", "Identity"],
    ["Passport - Director", "Identity"],
    ["Office Tenancy Contract", "Property"],
    ["Ejari Certificate", "Property"],
    ["Civil Defence Certificate", "Compliance"],
    ["Insurance Certificate", "Insurance"],
    ["Bank Account Certificate", "Financial"],
    ["Audited Financial Statements", "Financial"],
    ["Employee List", "HR"],
    ["Labour Establishment Card", "HR"],
    ["WPS Registration", "HR"],
    ["Data Protection Policy", "Compliance"],
    ["UBO Declaration", "Compliance"],
    ["AML Policy", "Compliance"],
  ];

  const documents = documentNames.map(([name, category], i) => {
    const expiryOffset = [15, 30, 45, 75, 120, 180, 240, 300][i % 8];
    const expiryDate = date(expiryOffset);
    const issueDate = date(-365 + i * 8);

    return {
      demoKey: `${demoKey}-doc-${i + 1}`,
      userId,
      name,
      category,
      issuingAuthority: "UAE Government Authority",
      documentNumber: `CDS-${2026}-${String(i + 1).padStart(4, "0")}`,
      issueDate,
      expiryDate,
      status:
        expiryOffset <= 30 ? "Expiring Soon" : "Valid",
      uploadedAt: new Date(),
      isDemo: true,
    };
  });

  await seedCollection(db.collection("documents"), documents);

  // 4. Tasks
  const taskTitles = [
    "Renew trade licence",
    "Review VAT filing",
    "Update employee records",
    "Verify corporate tax registration",
    "Review tenancy contract",
    "Prepare annual financial statements",
    "Update UBO declaration",
    "Review AML policy",
    "Renew insurance certificate",
    "Check labour establishment card",
    "Verify WPS compliance",
    "Review director identification",
    "Organise compliance documents",
    "Schedule internal compliance audit",
    "Review business activity permissions",
  ];

  const tasks = taskTitles.map((title, i) => ({
    demoKey: `${demoKey}-task-${i + 1}`,
    userId,
    title,
    assignee: ["Admin", "Finance Team", "HR Team"][i % 3],
    priority: ["High", "Medium", "Low"][i % 3],
    status: ["To do", "In progress", "Done"][i % 3],
    due: date((i + 1) * 3),
    isDemo: true,
  }));

  await seedCollection(db.collection("tasks"), tasks);

  // 5. Compliance deadlines
  const deadlineTitles = [
    ["Trade Licence Renewal", "Licence"],
    ["VAT Return Filing", "Tax"],
    ["Corporate Tax Filing", "Tax"],
    ["Insurance Renewal", "Insurance"],
    ["Tenancy Contract Renewal", "Property"],
    ["WPS Compliance Review", "HR"],
    ["Labour Card Review", "HR"],
    ["UBO Information Update", "Compliance"],
    ["AML Policy Review", "Compliance"],
    ["Financial Audit Submission", "Financial"],
    ["Establishment Card Renewal", "Licence"],
    ["Employee Records Verification", "HR"],
  ];

  const deadlines = deadlineTitles.map(([title, type], i) => ({
    demoKey: `${demoKey}-deadline-${i + 1}`,
    userId,
    title,
    type,
    date: date((i + 1) * 7),
    isDemo: true,
  }));

  await seedCollection(db.collection("deadlines"), deadlines);

  // 6. Approvals
  const approvalActions = [
    "Approve trade licence renewal",
    "Approve VAT filing documents",
    "Approve annual audit submission",
    "Approve insurance renewal",
    "Approve updated compliance policy",
  ];

  const approvals = approvalActions.map((action, i) => ({
    demoKey: `${demoKey}-approval-${i + 1}`,
    userId,
    action,
    status: ["Pending", "Approved", "Pending", "Rejected", "Pending"][i],
    isDemo: true,
  }));

  await seedCollection(db.collection("approvals"), approvals);

  // 7. Activity records
  const activityTexts = [
    "Demo business workspace created",
    "Trade licence document uploaded",
    "VAT registration certificate reviewed",
    "Compliance deadline added",
    "Employee records updated",
    "Corporate tax registration verified",
    "Insurance renewal task created",
    "AML policy review scheduled",
    "Approval request submitted",
    "Compliance dashboard updated",
  ];

  const activities = activityTexts.map((text, i) => ({
    demoKey: `${demoKey}-activity-${i + 1}`,
    userId,
    actor: i % 2 === 0 ? "Agent" : "User",
    text,
    at: new Date(Date.now() - i * 3600000).toISOString(),
    isDemo: true,
  }));

  await seedCollection(db.collection("activity"), activities);

  console.log("\nDemo workspace seeded successfully!");
  console.log(`Demo login: ${DEMO_ACCOUNT_EMAIL}`);
}

main()
  .catch((error) => {
    console.error("Demo seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await client.close();
  });