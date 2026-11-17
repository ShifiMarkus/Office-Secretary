import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { PageHeader } from "./ui";

export function ComingSoon({
  title,
  icon: Icon,
  stage,
  features,
}: {
  title: string;
  icon: LucideIcon;
  stage: number;
  features: string[];
}) {
  return (
    <>
      <PageHeader title={title} />
      <div className="card mx-auto max-w-2xl p-8 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <Icon size={32} aria-hidden />
        </span>
        <h2 className="mt-4 text-xl font-semibold">המסך הזה ייבנה בשלב {stage}</h2>
        <p className="mt-2 text-muted">מה יהיה כאן:</p>
        <ul className="mx-auto mt-4 max-w-md space-y-2 text-start">
          {features.map((f) => (
            <li key={f} className="flex gap-2">
              <span aria-hidden className="text-primary">✓</span>
              {f}
            </li>
          ))}
        </ul>
        <Link href="/" className="mt-6 inline-block rounded-xl bg-primary px-5 py-2.5 font-semibold text-primary-fg">
          חזרה ללוח הבקרה
        </Link>
      </div>
    </>
  );
}
