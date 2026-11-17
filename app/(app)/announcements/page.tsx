import { Pin, Megaphone } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageHeader, EmptyState } from "@/components/ui";
import { Avatar } from "@/components/Avatar";
import { AnnouncementActions, NewAnnouncement } from "./client";

export const metadata = { title: "לוח הודעות" };
export const dynamic = "force-dynamic";

const WHEN = new Intl.DateTimeFormat("he-IL", { timeZone: "Asia/Jerusalem", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });

export default async function Announcements() {
  const me = await requireUser();
  const isManager = me.role === "MANAGER";
  const [list, total] = await Promise.all([
    db.announcement.findMany({
      where: { OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
      orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
      include: { author: true, reads: true },
    }),
    db.user.count(),
  ]);
  return (
    <>
      <PageHeader title="לוח הודעות" subtitle="עדכונים מההנהלה" action={isManager ? <NewAnnouncement /> : undefined} />
      {list.length === 0 ? (
        <EmptyState emoji="📭" text="אין הודעות כרגע" />
      ) : (
        <ul className="space-y-4">
          {list.map((a) => {
            const read = a.reads.some((r) => r.userId === me.id);
            return (
              <li key={a.id} className={`card p-5 ${a.important ? "border-r-4 border-r-primary" : ""}`}>
                <div className="flex items-start gap-3">
                  <Avatar name={a.author.name} color={a.author.avatarColor} size={40} />
                  <div className="min-w-0 flex-1">
                    <h2 className="flex flex-wrap items-center gap-2 text-lg font-semibold">
                      {a.pinned && <Pin size={16} aria-label="נעוצה" className="text-primary" />}
                      {a.title}
                      {a.important && <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-fg">חשוב</span>}
                    </h2>
                    <p className="text-sm text-muted">
                      {a.author.name} · {WHEN.format(a.createdAt)}
                    </p>
                    <p className="mt-3 whitespace-pre-line leading-relaxed">{a.body}</p>
                    <AnnouncementActions
                      id={a.id}
                      read={read}
                      isManager={isManager}
                      readCount={a.reads.length}
                      total={total}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <p className="sr-only"><Megaphone aria-hidden /></p>
    </>
  );
}
