import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Download, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

type BackupApplication = {
  programId: number;
  application: Record<string, unknown>;
  documents: Array<{ documentType: string; label: string; isComplete: boolean }>;
  recommenders: Array<{ name?: string | null; email?: string | null; status: "not_requested" | "requested" | "received" }>;
};

export function PersonalBackupPanel({ items, onImported }: { items: any[]; onImported: () => Promise<unknown> | unknown }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const utils = trpc.useUtils();
  const add = trpc.tracker.applications.add.useMutation();
  const update = trpc.tracker.applications.update.useMutation();
  const toggle = trpc.tracker.applications.toggleDocument.useMutation();
  const addRecommender = trpc.tracker.applications.addRecommender.useMutation();
  const updateRecommender = trpc.tracker.applications.updateRecommender.useMutation();

  const exportBackup = () => {
    const applications: BackupApplication[] = items.map(item => ({
      programId: item.program.id,
      application: {
        status: item.application.status, priority: item.application.priority, targetResult: item.application.targetResult,
        nextAction: item.application.nextAction, notes: item.application.notes, primaryContactName: item.application.primaryContactName,
        primaryContactEmail: item.application.primaryContactEmail, reminderAt: item.application.reminderAt ? new Date(item.application.reminderAt).toISOString().slice(0, 10) : null,
      },
      documents: item.documents.map((document: any) => ({ documentType: document.documentType, label: document.label, isComplete: document.isComplete })),
      recommenders: item.recommenders.map((recommender: any) => ({ name: recommender.name, email: recommender.email, status: recommender.status })),
    }));
    const payload = { schemaVersion: 1, exportedAt: new Date().toISOString(), kind: "gradpathway-personal-progress", applications };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `gradpathway-backup-${new Date().toISOString().slice(0, 10)}.json`; anchor.click(); URL.revokeObjectURL(url);
    toast.success(`Downloaded backup with ${applications.length} application${applications.length === 1 ? "" : "s"}.`);
  };

  const importBackup = async (file: File) => {
    setIsImporting(true);
    try {
      const parsed = JSON.parse(await file.text());
      if (parsed?.schemaVersion !== 1 || parsed?.kind !== "gradpathway-personal-progress" || !Array.isArray(parsed.applications)) throw new Error("This is not a supported GradPathway backup file.");
      for (const candidate of parsed.applications as BackupApplication[]) {
        if (!Number.isInteger(candidate.programId) || !candidate.application || !Array.isArray(candidate.documents) || !Array.isArray(candidate.recommenders)) throw new Error("The backup contains an incomplete application record.");
        await add.mutateAsync({ programId: candidate.programId });
      }
      const fresh = await utils.tracker.applications.list.fetch();
      for (const candidate of parsed.applications as BackupApplication[]) {
        const target = fresh.find(item => item.program.id === candidate.programId); if (!target) continue;
        const data = candidate.application as any;
        await update.mutateAsync({ applicationId: target.application.id, status: data.status, priority: data.priority, targetResult: data.targetResult, nextAction: data.nextAction ?? "", notes: data.notes ?? "", primaryContactName: data.primaryContactName ?? "", primaryContactEmail: data.primaryContactEmail ?? "", reminderAt: data.reminderAt ?? null });
        for (const document of candidate.documents) { const match = target.documents.find((item: any) => item.documentType === document.documentType && item.label === document.label); if (match) await toggle.mutateAsync({ documentId: match.id, isComplete: Boolean(document.isComplete) }); }
        for (const saved of candidate.recommenders.slice(0, 3)) { await addRecommender.mutateAsync({ applicationId: target.application.id }); const refreshed = await utils.tracker.applications.list.fetch(); const current = refreshed.find(item => item.application.id === target.application.id)?.recommenders.at(-1); if (current) await updateRecommender.mutateAsync({ recommenderId: current.id, name: saved.name ?? "", email: saved.email ?? "", status: saved.status }); }
      }
      await onImported(); toast.success("Backup merged into your personal workspace.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Could not import that backup."); }
    finally { setIsImporting(false); if (inputRef.current) inputRef.current.value = ""; }
  };

  return <div className="flex flex-wrap items-center gap-2"><Button type="button" variant="outline" onClick={exportBackup}><Download className="mr-2 h-4 w-4" />Export JSON</Button><input ref={inputRef} className="hidden" type="file" accept="application/json,.json" onChange={event => { const file = event.target.files?.[0]; if (file) void importBackup(file); }} /><Button type="button" variant="outline" disabled={isImporting} onClick={() => inputRef.current?.click()}>{isImporting ? "Importing…" : <><Upload className="mr-2 h-4 w-4" />Import JSON</>}</Button></div>;
}
