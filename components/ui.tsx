import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Hourglass } from "lucide-react";

export function SectionCard({
  title,
  icon: Icon,
  href,
  linkLabel = "לכל הרשימה",
  children,
  className = "",
}: {
  title: string;
  icon: LucideIcon;
  href?: string;
  linkLabel?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`card p-5 ${className}`} aria-labelledby={`sec-${title}`}>
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <Icon size={18} aria-hidden />
        </span>
        <h2 id={`sec-${title}`} className="flex-1 font-semibold">{title}</h2>
        {href && (
          <Link href={href} className="text-sm text-primary hover:underline">
            {linkLabel}
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

export function SoonNote({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-dashed border-border bg-surface-2 p-4 text-sm text-muted">
      <Hourglass size={18} aria-hidden className="shrink-0" />
      {text}
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end gap-3">
      <div className="flex-1">
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-8 text-center text-muted">
      <span className="text-3xl" aria-hidden>{emoji}</span>
      <p>{text}</p>
    </div>
  );
}
