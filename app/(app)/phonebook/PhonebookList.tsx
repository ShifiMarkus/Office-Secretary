"use client";
import { useMemo, useState } from "react";
import { Mail, MessageCircle, Phone, Search } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { EmptyState } from "@/components/ui";

type Person = { id: string; name: string; jobTitle: string; team: string; email: string; mobile: string | null; color: string };

export function PhonebookList({ people }: { people: Person[] }) {
  const [q, setQ] = useState("");
  const [team, setTeam] = useState("");
  const teams = useMemo(() => [...new Set(people.map((p) => p.team).filter(Boolean))], [people]);
  const shown = people.filter(
    (p) =>
      (!team || p.team === team) &&
      [p.name, p.jobTitle, p.team, p.mobile ?? "", p.email].join(" ").toLowerCase().includes(q.trim().toLowerCase()),
  );
  return (
    <>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">חיפוש</span>
          <Search size={18} aria-hidden className="absolute top-1/2 right-3 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="חיפוש לפי שם, תפקיד או טלפון"
            className="w-full rounded-xl border border-border bg-surface py-3 pr-10 pl-4 focus:border-primary"
          />
        </label>
        {teams.length > 1 && (
          <div role="group" aria-label="סינון לפי צוות" className="flex gap-2 overflow-x-auto">
            {["", ...teams].map((t) => (
              <button
                key={t || "all"}
                onClick={() => setTeam(t)}
                aria-pressed={team === t}
                className={`whitespace-nowrap rounded-xl border px-4 py-2.5 text-sm ${
                  team === t ? "border-primary bg-primary-soft font-semibold text-primary" : "border-border bg-surface"
                }`}
              >
                {t || "כולם"}
              </button>
            ))}
          </div>
        )}
      </div>
      {shown.length === 0 ? (
        <EmptyState emoji="🔍" text="לא נמצאו אנשי קשר" />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((p) => (
            <li key={p.id} className="card flex flex-col p-5">
              <div className="flex items-center gap-3">
                <Avatar name={p.name} color={p.color} size={48} />
                <div className="min-w-0">
                  <p className="truncate font-semibold">{p.name}</p>
                  <p className="truncate text-sm text-muted">{p.jobTitle}</p>
                  {p.team && <p className="text-xs text-muted">{p.team}</p>}
                </div>
              </div>
              <p className="mt-4 text-sm" dir="ltr" style={{ textAlign: "right" }}>
                {p.mobile ?? <span className="text-muted" dir="rtl">המספר מוסתר</span>}
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {p.mobile ? (
                  <a href={`tel:${p.mobile.replaceAll("-", "")}`} className="flex items-center justify-center gap-1.5 rounded-xl bg-primary-soft py-2 text-sm text-primary hover:opacity-80" aria-label={`חיוג ל${p.name}`}>
                    <Phone size={16} aria-hidden /> חיוג
                  </a>
                ) : (
                  <span className="flex items-center justify-center gap-1.5 rounded-xl bg-surface-2 py-2 text-sm text-muted" aria-hidden>
                    <Phone size={16} /> חיוג
                  </span>
                )}
                <a href={`mailto:${p.email}`} className="flex items-center justify-center gap-1.5 rounded-xl bg-primary-soft py-2 text-sm text-primary hover:opacity-80" aria-label={`מייל ל${p.name}`}>
                  <Mail size={16} aria-hidden /> מייל
                </a>
                <a
                  href={`https://teams.microsoft.com/l/chat/0/0?users=${encodeURIComponent(p.email)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-primary-soft py-2 text-sm text-primary hover:opacity-80"
                  aria-label={`צ׳אט ב-Teams עם ${p.name}`}
                >
                  <MessageCircle size={16} aria-hidden /> Teams
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
