"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MoreHorizontal, X } from "lucide-react";
import { NAV } from "./nav";
import { Logo } from "./Logo";

function isActive(path: string, href: string) {
  return href === "/" ? path === "/" : path.startsWith(href);
}

export function Sidebar({ isManager }: { isManager: boolean }) {
  const path = usePathname();
  const items = NAV.filter((n) => !n.managerOnly || isManager);
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-l border-border bg-surface sticky top-0 h-dvh">
      <div className="px-6 pt-6 pb-8">
        <Link href="/" aria-label="TRUSTech — לוח בקרה">
          <Logo className="h-8" />
        </Link>
        <p className="mt-2 text-sm text-muted">המזכירה הווירטואלית</p>
      </div>
      <nav aria-label="ניווט ראשי" className="flex-1 px-3">
        <ul className="space-y-1">
          {items.map(({ href, label, icon: Icon, soon }) => {
            const active = isActive(path, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] transition-colors ${
                    active
                      ? "bg-primary-soft text-primary font-semibold"
                      : "text-fg hover:bg-surface-2"
                  }`}
                >
                  <Icon size={20} aria-hidden />
                  <span className="flex-1">{label}</span>
                  {soon && (
                    <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] text-muted">בקרוב</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="px-6 py-4 text-xs text-muted border-t border-border">
        <Link href="/accessibility" className="hover:underline">הצהרת נגישות</Link>
      </div>
    </aside>
  );
}

export function BottomNav({ isManager }: { isManager: boolean }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const main = NAV.filter((n) => n.mobile);
  const more = NAV.filter((n) => !n.mobile && (!n.managerOnly || isManager));
  return (
    <>
      <nav
        aria-label="ניווט ראשי"
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-surface/95 backdrop-blur pb-[env(safe-area-inset-bottom)]"
      >
        <ul className="grid grid-cols-5">
          {main.map(({ href, label, icon: Icon }) => {
            const active = isActive(path, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex flex-col items-center gap-1 py-2.5 text-[11px] ${active ? "text-primary font-semibold" : "text-muted"}`}
                >
                  <Icon size={22} aria-hidden />
                  {label}
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              className="flex w-full flex-col items-center gap-1 py-2.5 text-[11px] text-muted"
            >
              <MoreHorizontal size={22} aria-hidden />
              עוד
            </button>
          </li>
        </ul>
      </nav>
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/40" onClick={() => setOpen(false)}>
          <div
            role="dialog"
            aria-label="עוד"
            className="absolute bottom-0 inset-x-0 rounded-t-3xl bg-surface p-5 pb-8 pop-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold">עוד</h2>
              <button onClick={() => setOpen(false)} aria-label="סגירה" className="p-2 rounded-full hover:bg-surface-2">
                <X size={20} />
              </button>
            </div>
            <ul className="grid grid-cols-3 gap-3">
              {more.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className="flex flex-col items-center gap-2 rounded-2xl bg-surface-2 p-4 text-sm"
                  >
                    <Icon size={24} aria-hidden className="text-primary" />
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/accessibility"
                  onClick={() => setOpen(false)}
                  className="flex flex-col items-center gap-2 rounded-2xl bg-surface-2 p-4 text-sm text-center"
                >
                  הצהרת נגישות
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
