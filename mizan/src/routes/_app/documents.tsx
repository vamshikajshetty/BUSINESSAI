
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Upload,
  FileText,
  Trash2,
  Eye,
  FolderLock,
  Loader2,
} from "lucide-react";
import { PageHeader, Panel, Empty } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useStore,
  setState,
  classify,
  log,
  daysUntil,
} from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/documents")({
  head: () => ({
    meta: [
      { title: "Document Vault — Mizan" },
      {
        name: "description",
        content: "Upload, classify and track expiry of your business documents.",
      },
      { property: "og:title", content: "Document Vault — Mizan" },
      {
        property: "og:description",
        content: "Secure storage for licences, Ejari, visas and tax documents.",
      },
    ],
  }),
  component: Documents,
});

const CATS = [
  "All",
  "Trade Licence",
  "Ejari",
  "Visa",
  "Employee Permit",
  "Tax",
  "MOA",
  "Other",
];

type DocumentRecord = {
  id: string;
  name: string;
  size: number;
  category: string;
  issueDate?: string;
  expiry?: string;
  uploadedAt: string;
  hasFile?: boolean;
};

function Documents() {
  const docs = useStore((s) => s.docs) as DocumentRecord[];

  const ref = useRef<HTMLInputElement>(null);

  const [filter, setFilter] = useState("All");
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [busyIds, setBusyIds] = useState<string[]>([]);

  // Load documents belonging to the logged-in user.
  useEffect(() => {
    let active = true;

    async function loadDocuments() {
      try {
        const response = await fetch("/api/documents", {
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load documents.");
        }

        if (active) {
          setState(() => ({ docs: data.documents }));
        }
      } catch (error) {
        if (active) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Unable to load documents.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDocuments();

    return () => {
      active = false;
    };
  }, []);

  function setBusy(id: string, busy: boolean) {
    setBusyIds((current) =>
      busy
        ? [...current, id]
        : current.filter((item) => item !== id),
    );
  }

  // Upload PDFs to MongoDB GridFS.
  async function onFiles(files: FileList | null) {
    if (!files) return;

    const selectedFiles = Array.from(files);
    setUploading(true);

    try {
      for (const file of selectedFiles) {
        if (file.type !== "application/pdf") {
          toast.error(`${file.name} is not a PDF.`);
          continue;
        }

        if (file.size > 10 * 1024 * 1024 || file.size === 0) {
          toast.error(`${file.name} must be smaller than 10 MB.`);
          continue;
        }

        const category = classify(file.name);
        const formData = new FormData();

        formData.append("file", file);
        formData.append("category", category);
        formData.append("issueDate", "");
        formData.append("expiryDate", "");

        const response = await fetch("/api/documents", {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          toast.error(data.message || `Failed to upload ${file.name}.`);
          continue;
        }

        setState((s) => ({
          docs: [data.document, ...s.docs.filter(
            (doc) => doc.id !== data.document.id,
          )],
        }));

        log("User", `Uploaded ${file.name} (${category})`);
        toast.success(`${file.name} uploaded successfully.`);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Upload failed.",
      );
    } finally {
      setUploading(false);

      if (ref.current) {
        ref.current.value = "";
      }
    }
  }

  // Update document metadata in MongoDB.
  async function updateDocument(
    id: string,
    updates: {
      category?: string;
      issueDate?: string;
      expiryDate?: string;
    },
  ) {
    setBusy(id, true);

    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to update document.");
      }

      setState((s) => ({
        docs: s.docs.map((doc) =>
          doc.id === id
            ? {
                ...doc,
                ...(updates.category !== undefined
                  ? { category: updates.category }
                  : {}),
                ...(updates.issueDate !== undefined
                  ? { issueDate: updates.issueDate }
                  : {}),
                ...(updates.expiryDate !== undefined
                  ? { expiry: updates.expiryDate }
                  : {}),
              }
            : doc,
        ),
      }));

      log("User", "Updated document details");
      toast.success("Document details saved.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Update failed.",
      );
    } finally {
      setBusy(id, false);
    }
  }

  // Delete document and its GridFS PDF.
  async function deleteDocument(id: string, name: string) {
    if (!window.confirm(`Delete "${name}" permanently?`)) return;

    setBusy(id, true);

    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to delete document.");
      }

      setState((s) => ({
        docs: s.docs.filter((doc) => doc.id !== id),
        deadlines: s.deadlines.filter(
          (deadline) => deadline.id !== `doc-${id}`,
        ),
      }));

      log("User", `Deleted ${name}`);
      toast.success("Document deleted successfully.");

      if (preview === `/api/documents/${id}`) {
        setPreview(null);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Delete failed.",
      );
    } finally {
      setBusy(id, false);
    }
  }

  const shown = docs.filter(
    (doc) => filter === "All" || doc.category === filter,
  );

  return (
    <>
      <PageHeader
        title="Document Vault"
        sub="Securely upload, organise and track your business documents."
        action={
          <>
            <input
              ref={ref}
              type="file"
              accept="application/pdf"
              multiple
              hidden
              onChange={(e) => onFiles(e.target.files)}
            />
            <Button
              onClick={() => ref.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {uploading ? "Uploading..." : "Upload PDF"}
            </Button>
          </>
        }
      />

      <p className="mb-4 text-xs text-muted-foreground">
        PDF files up to 10 MB. Files are stored securely in MongoDB GridFS.
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        {CATS.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              filter === category
                ? "bg-primary text-primary-foreground"
                : "border bg-card text-muted-foreground"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <Panel>
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading documents from MongoDB...
          </div>
        ) : shown.length === 0 ? (
          <Empty
            icon={FolderLock}
            title="No documents"
            text="Upload your trade licence, Ejari, MOA and VAT certificate to improve your score."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-muted-foreground">
                <tr>
                  <th className="pb-3">Document</th>
                  <th>Category</th>
                  <th>Issue date</th>
                  <th>Expiry date</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>

              <tbody className="divide-y">
                {shown.map((doc) => {
                  const days = doc.expiry
                    ? daysUntil(doc.expiry)
                    : null;

                  const busy = busyIds.includes(doc.id);

                  return (
                    <tr key={doc.id}>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 shrink-0 text-accent" />
                          <span className="max-w-56 truncate">
                            {doc.name}
                          </span>
                        </div>

                        <p className="text-xs text-muted-foreground">
                          {(doc.size / 1024).toFixed(0)} KB
                        </p>
                      </td>

                      <td>
                        <select
                          className="rounded-md border bg-card px-2 py-1 text-xs"
                          value={doc.category}
                          disabled={busy}
                          onChange={(e) =>
                            updateDocument(doc.id, {
                              category: e.target.value,
                            })
                          }
                        >
                          {CATS.slice(1).map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td>
                        <Input
                          type="date"
                          className="h-8 w-36 text-xs"
                          value={doc.issueDate ?? ""}
                          disabled={busy}
                          onChange={(e) =>
                            updateDocument(doc.id, {
                              issueDate: e.target.value,
                            })
                          }
                        />
                      </td>

                      <td>
                        <Input
                          type="date"
                          className="h-8 w-36 text-xs"
                          value={doc.expiry ?? ""}
                          disabled={busy}
                          onChange={(e) =>
                            updateDocument(doc.id, {
                              expiryDate: e.target.value,
                            })
                          }
                        />
                      </td>

                      <td className="text-xs">
                        {days === null ? (
                          <span className="text-muted-foreground">
                            No expiry
                          </span>
                        ) : days < 0 ? (
                          <span className="text-destructive">
                            Expired
                          </span>
                        ) : days <= 30 ? (
                          <span className="text-warning">
                            {days}d left
                          </span>
                        ) : (
                          <span className="text-success">
                            Valid
                          </span>
                        )}
                      </td>

                      <td className="text-right">
                        <div className="flex items-center justify-end">
                          <Button
                            size="icon"
                            variant="ghost"
                            disabled={!doc.hasFile || busy}
                            onClick={() =>
                              setPreview(`/api/documents/${doc.id}`)
                            }
                            title={
                              doc.hasFile
                                ? "Preview PDF"
                                : "No PDF file attached"
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            disabled={busy}
                            onClick={() =>
                              deleteDocument(doc.id, doc.name)
                            }
                            title="Delete document"
                          >
                            {busy ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-6"
          onClick={() => setPreview(null)}
        >
          <div
            className="relative h-[85vh] w-full max-w-4xl overflow-hidden rounded-lg bg-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute right-3 top-3 z-10 rounded-md bg-card px-3 py-1 text-sm shadow"
              onClick={() => setPreview(null)}
            >
              Close
            </button>

            <iframe
              src={preview}
              className="h-full w-full"
              title="Document PDF preview"
            />
          </div>
        </div>
      )}
    </>
  );
}
