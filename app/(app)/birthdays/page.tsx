import Link from "next/link";
import { ChevronLeft, ChevronRight, Cake, PartyPopper } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { addDays, formatGregorian, todayIL, utcDate } from "@/lib/dates";
import { formatHebrew } from "@/lib/hebrew-date";
import { upcomingBirthdays, type BirthdayEvent } from "@/lib/birthdays";
import { birthdayUsers, todaysCelebrants } from "@/lib/data";
import { Avatar } from "@/components/Avatar";
import { PageHeader, SectionCard, EmptyState } from "@/components/ui";

export const metadata = { title: "ימי הולדת" };
export const dynamic = "force-dynamic";

const MONTH = new Intl.DateTimeFormat("he-IL", { timeZone: "UTC", month: "long", year: "numeric" });
const DOW = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"];

function KindTag({ kind }: { kind: BirthdayEvent["kind"] }) {
  return (
    <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] text-muted">
      {kind === "HEBREW" ? "לפי התאריך העברי" : "לפי התאריך הלועזי"}
    </span>
  );
}

export default async function Birthdays({ searchParams }: { searchParams: Promise<{ m?: string }> }) {
  const me = await requireUser();
  const today = todayIL();
  const { m } = await searchParams;
  const [yy, mm] = (m && /^\d{4}-\d{2}$/.test(m) ? m : today.toISOString().slice(0, 7)).split("-").map(Number);
  const monthStart = utcDate(yy, mm - 1, 1);
  const monthEnd = utcDate(yy, mm, 0);
  const prev = utcDate(yy, mm - 2, 1).toISOString().slice(0, 7);
  const next = utcDate(yy, mm, 1).toISOString().slice(0, 7);

  const users = await birthdayUsers();
  const celebrants = await todaysCelebrants();
  const upcoming = upcomingBirthdays(users, today, 60).filter((e) => e.inDays > 0);
  const monthEvents = upcomingBirthdays(users, addDays(monthStart, -1), 33).filter(
    (e) => e.celebrateOn >= monthStart && e.celebrateOn <= monthEnd,
  );
  const wishes = await db.birthdayWish.findMany({
    where: { toId: { in: celebrants.map((c) => c.id) }, year: today.getUTCFullYear() },
    include: { from: true },
    orderBy: { createdAt: "desc" },
  });

  // תאי לוח השנה
  const lead = monthStart.getUTCDay();
  const cells: (Date | null)[] = [
    ...Array(lead).fill(null),
    ...Array.from({ length: monthEnd.getUTCDate() }, (_, i) => utcDate(yy, mm - 1, i + 1)),
  ];
  while (cells.length % 7) cells.push(null);

  return (
    <>
      <PageHeader title="ימי הולדת" subtitle="לפי התאריך העברי והלועזי. מוצגים רק מי שהסכימו להצגה." />

      {celebrants.length > 0 && (
        <SectionCard title="חוגגים היום" icon={PartyPopper} className="mb-6">
          <div className="space-y-4">
            {celebrants.map((c) => {
              const mine = wishes.filter((w) => w.toId === c.id);
              return (
                <div key={c.id}>
                  <p className="font-semibold">
                    🎂 {c.name}
                    {c.age ? ` · ${c.age}` : ""}
                    {c.id === me.id && " (זה את/ה!)"}
                  </p>
                  {mine.length > 0 ? (
                    <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                      {mine.map((w) => (
                        <li key={w.id} className="rounded-xl bg-primary-soft p-3 text-sm">
                          <p>{w.message}</p>
                          <p className="mt-1 text-xs text-muted">— {w.from.name}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-1 text-sm text-muted">עוד אין ברכות. אפשר לשלוח מלוח הבקרה.</p>
                  )}
                </div>
              );
            })}
          </div>
        </SectionCard>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="card p-5" aria-labelledby="cal-title">
          <div className="mb-4 flex items-center justify-between">
            <Link href={`?m=${prev}`} className="rounded-full p-2 hover:bg-surface-2" aria-label="החודש הקודם">
              <ChevronRight size={20} />
            </Link>
            <div className="text-center">
              <h2 id="cal-title" className="font-semibold">{MONTH.format(monthStart)}</h2>
              <p className="text-xs text-muted">
                {formatHebrew(monthStart, true)} – {formatHebrew(monthEnd, true)}
              </p>
            </div>
            <Link href={`?m=${next}`} className="rounded-full p-2 hover:bg-surface-2" aria-label="החודש הבא">
              <ChevronLeft size={20} />
            </Link>
          </div>
          <div role="grid" aria-labelledby="cal-title" className="grid grid-cols-7 gap-1 text-center">
            {DOW.map((d) => (
              <div key={d} role="columnheader" className="pb-1 text-xs font-semibold text-muted">{d}</div>
            ))}
            {cells.map((d, i) => {
              if (!d) return <div key={i} />;
              const ev = monthEvents.filter((e) => +e.celebrateOn === +d);
              const isToday = +d === +today;
              const weekend = d.getUTCDay() >= 5;
              return (
                <div
                  key={i}
                  role="gridcell"
                  aria-label={`${formatGregorian(d)}, ${formatHebrew(d)}${ev.length ? `: יום הולדת ל${ev.map((e) => e.user.name).join(", ")}` : ""}`}
                  className={`min-h-16 rounded-xl p-1.5 text-start text-xs sm:min-h-20 ${
                    isToday ? "ring-2 ring-primary" : ""
                  } ${ev.length ? "bg-primary-soft" : weekend ? "bg-surface-2/60" : ""}`}
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-semibold">{d.getUTCDate()}</span>
                    <span className="text-[10px] text-muted">{formatHebrew(d).split(" ")[0]}</span>
                  </div>
                  {ev.map((e) => (
                    <p key={e.user.id + e.kind} className="mt-1 truncate font-medium text-primary" title={e.user.name}>
                      🎂 {e.user.name.split(" ")[0]}
                    </p>
                  ))}
                </div>
              );
            })}
          </div>
        </section>

        <SectionCard title="בחודשיים הקרובים" icon={Cake}>
          {upcoming.length === 0 ? (
            <EmptyState emoji="🎈" text="אין ימי הולדת בחודשיים הקרובים" />
          ) : (
            <ul className="space-y-4">
              {upcoming.map((e) => (
                <li key={e.user.id + e.kind + e.date.toISOString()} className="flex items-start gap-3">
                  <Avatar name={e.user.name} color={e.user.avatarColor} size={40} />
                  <div className="flex-1">
                    <p className="font-semibold">{e.user.name}</p>
                    <p className="text-sm">
                      {formatHebrew(e.date)} · {formatGregorian(e.date)}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      <KindTag kind={e.kind} />
                      {e.shifted && (
                        <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] text-muted">
                          נחגוג ב{formatGregorian(e.celebrateOn)} (לפני שבת/חג)
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="whitespace-nowrap rounded-full bg-surface-2 px-3 py-1 text-sm">
                    {e.inDays === 1 ? "מחר" : `בעוד ${e.inDays} ימים`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </>
  );
}
