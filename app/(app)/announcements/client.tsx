"use client";
import { useState, useTransition } from "react";
import { Check, Plus, Trash2, X } from "lucide-react";
import { createAnnouncement, deleteAnnouncement, markRead } from "@/app/actions";

export function AnnouncementActions({
  id,
  read,
  isManager,
  readCount,
  total,
}: {
  id: string;
  read: boolean;
  isManager: boolean;
  readCount: number;
  total: number;
}) {
  const [pending, start] = useTransition();
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
      {read ? (
        <span className="inline-flex items-center gap-1 text-success"><Check size={16} aria-hidden /> קראתי</span>
      ) : (
        <button
          disabled={pending}
          onClick={() => start(() => markRead(id))}
          className="rounded-xl bg-primary-soft px-3 py-1.5 font-medium text-primary hover:opacity-80"
        >
          סימון כנקרא
        </button>
      )}
      {isManager && (
        <>
          <span className="text-muted">· נקרא על ידי {readCount} מתוך {total}</span>
          <button
            disabled={pending}
            onClick={() => confirm("למחוק את ההודעה?") && start(() => deleteAnnouncement(id))}
            className="mr-auto inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-danger hover:bg-surface-2"
          >
            <Trash2 size={16} aria-hidden /> מחיקה
          </button>
        </>
      )}
    </div>
  );
}

export function NewAnnouncement() {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-semibold text-primary-fg"
      >
        <Plus size={18} aria-hidden /> הודעה חדשה
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setOpen(false)}>
          <form
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-ann"
            className="card pop-in w-full max-w-lg p-6"
            onClick={(e) => e.stopPropagation()}
            action={(fd) => start(async () => { await createAnnouncement(fd); setOpen(false); })}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 id="new-ann" className="text-lg font-semibold">הודעה חדשה</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="סגירה" className="rounded-full p-2 hover:bg-surface-2"><X size={18} /></button>
            </div>
            <label className="block text-sm font-medium" htmlFor="ann-title">כותרת</label>
            <input id="ann-title" name="title" required maxLength={120} autoFocus className="mt-1 w-full rounded-xl border border-border bg-surface-2 p-3" />
            <label className="mt-4 block text-sm font-medium" htmlFor="ann-body">תוכן</label>
            <textarea id="ann-body" name="body" required rows={5} className="mt-1 w-full rounded-xl border border-border bg-surface-2 p-3" />
            <div className="mt-4 flex gap-5 text-sm">
              <label className="flex items-center gap-2"><input type="checkbox" name="pinned" className="h-4 w-4 accent-[var(--primary)]" /> הצמדה לראש הלוח</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="important" className="h-4 w-4 accent-[var(--primary)]" /> הודעה חשובה</label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="rounded-xl px-4 py-2 hover:bg-surface-2">ביטול</button>
              <button disabled={pending} className="rounded-xl bg-primary px-5 py-2 font-semibold text-primary-fg disabled:opacity-60">
                {pending ? "מפרסם…" : "פרסום"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
