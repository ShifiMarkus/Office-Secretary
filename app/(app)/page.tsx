import Link from "next/link";
import {
  AlertTriangle,
  Cake,
  CalendarDays,
  CalendarPlus,
  Inbox,
  Megaphone,
  PackageMinus,
  Pin,
  Receipt,
  SquarePen,
} from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatGregorian, todayIL } from "@/lib/dates";
import { formatHebrew } from "@/lib/hebrew-date";
import { upcomingBirthdays } from "@/lib/birthdays";
import { birthdayUsers, todaysCelebrants } from "@/lib/data";
import { BirthdayBanner } from "@/components/BirthdayCelebration";
import { SectionCard, SoonNote, EmptyState } from "@/components/ui";
import { Avatar } from "@/components/Avatar";

export const dynamic = "force-dynamic";

function greeting() {
  const h = Number(new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Jerusalem", hour: "numeric", hourCycle: "h23" }).format(new Date()));
  if (h < 12) return "בוקר טוב";
  if (h < 17) return "צהריים טובים";
  if (h < 21) return "ערב טוב";
  return "לילה טוב";
}

export default async function Dashboard() {
  const user = await requireUser();
  const isManager = user.role === "MANAGER";
  const today = todayIL();
  const [celebrants, bUsers, announcements] = await Promise.all([
    todaysCelebrants(),
    birthdayUsers(),
    db.announcement.findMany({
      where: { OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
      orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
      take: 4,
      include: { author: true, reads: { where: { userId: user.id } } },
    }),
  ]);
  const upcoming = upcomingBirthdays(bUsers, today, 21).filter((e) => e.inDays > 0).slice(0, 5);

  const quick = [
    { href: "/shopping", label: "דיווח חוסר", icon: PackageMinus },
    { href: "/tickets", label: "פנייה חדשה", icon: SquarePen },
    { href: "/meetings", label: "זימון פגישה", icon: CalendarPlus },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">
          {greeting()}, {user.name.split(" ")[0]} 👋
        </h1>
        <p className="mt-1 text-muted">מה נעשה היום?</p>
      </div>

      <BirthdayBanner celebrants={celebrants} meId={user.id} />

      <nav aria-label="פעולות מהירות" className="grid grid-cols-3 gap-3">
        {quick.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="card group flex flex-col items-center gap-2 p-4 text-center transition hover:-translate-y-0.5 hover:border-primary sm:flex-row sm:p-5 sm:text-start"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-fg">
              <Icon size={22} aria-hidden />
            </span>
            <span className="font-semibold">{label}</span>
          </Link>
        ))}
      </nav>

      {isManager && (
        <section aria-labelledby="mgr-title">
          <h2 id="mgr-title" className="mb-3 text-sm font-semibold text-muted">למנהלים</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { icon: AlertTriangle, label: "פניות פתוחות", note: "יוצג בשלב 3" },
              { icon: PackageMinus, label: "חוסרים שממתינים לאישור", note: "יוצג בשלב 2" },
              { icon: Receipt, label: "הוצאות החודש", note: "יוצג בשלב 2" },
            ].map(({ icon: Icon, label, note }) => (
              <div key={label} className="card flex items-center gap-3 p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2 text-muted">
                  <Icon size={20} aria-hidden />
                </span>
                <div>
                  <p className="font-semibold">{label}</p>
                  <p className="text-xs text-muted">{note}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="הודעות" icon={Megaphone} href="/announcements">
          {announcements.length === 0 ? (
            <EmptyState emoji="📭" text="אין הודעות חדשות" />
          ) : (
            <ul className="divide-y divide-border">
              {announcements.map((a) => (
                <li key={a.id} className="py-3 first:pt-0 last:pb-0">
                  <Link href="/announcements" className="group block">
                    <p className="flex items-center gap-2 font-medium group-hover:text-primary">
                      {a.pinned && <Pin size={14} aria-label="נעוצה" className="text-primary" />}
                      {a.title}
                      {a.reads.length === 0 && (
                        <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] text-primary-fg">חדש</span>
                      )}
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-sm text-muted">{a.body}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="ימי הולדת קרובים" icon={Cake} href="/birthdays" linkLabel="ללוח ימי ההולדת">
          {upcoming.length === 0 ? (
            <EmptyState emoji="🎈" text="אין ימי הולדת בשבועות הקרובים" />
          ) : (
            <ul className="space-y-3">
              {upcoming.map((e) => (
                <li key={e.user.id + e.kind} className="flex items-center gap-3">
                  <Avatar name={e.user.name} color={e.user.avatarColor} size={38} />
                  <div className="flex-1">
                    <p className="font-medium">{e.user.name}</p>
                    <p className="text-sm text-muted">
                      {e.kind === "HEBREW" ? formatHebrew(e.date) : formatGregorian(e.date)}
                      {e.shifted && " · נחגוג לפני שבת"}
                    </p>
                  </div>
                  <span className="rounded-full bg-surface-2 px-3 py-1 text-sm">
                    {e.inDays === 1 ? "מחר" : `בעוד ${e.inDays} ימים`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="הפגישות שלי" icon={CalendarDays}>
          <SoonNote text="הפגישות הקרובות שלך מ-Outlook יוצגו כאן, אחרי החיבור ל-Microsoft 365 (שלב 4)." />
        </SectionCard>

        <SectionCard title="הפניות שלי" icon={Inbox}>
          <SoonNote text="הפניות שפתחת והסטטוס שלהן יוצגו כאן (שלב 3)." />
        </SectionCard>
      </div>
    </div>
  );
}
