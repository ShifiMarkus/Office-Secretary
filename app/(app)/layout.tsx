import Link from "next/link";
import { LogOut } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { isDemoMode } from "@/lib/config";
import { formatGregorian, formatWeekday, todayIL } from "@/lib/dates";
import { formatHebrew } from "@/lib/hebrew-date";
import { GREETINGS, todaysCelebrants } from "@/lib/data";
import { Sidebar, BottomNav } from "@/components/Sidebar";
import { Logo } from "@/components/Logo";
import { Avatar } from "@/components/Avatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AccessibilityMenu } from "@/components/AccessibilityMenu";
import { BirthdayCelebration } from "@/components/BirthdayCelebration";
import { logout } from "@/app/actions";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const today = todayIL();
  const celebrants = await todaysCelebrants();
  const isManager = user.role === "MANAGER";

  return (
    <div className="flex min-h-dvh">
      <a href="#main" className="skip-link">דילוג לתוכן הראשי</a>
      <Sidebar isManager={isManager} />
      <div className="flex min-w-0 flex-1 flex-col">
        {isDemoMode && (
          <div className="bg-primary-soft px-4 py-1.5 text-center text-xs text-primary">
            מצב הדגמה — הנתונים לדוגמה בלבד. החיבור ל-Microsoft 365 יוגדר בהמשך.
          </div>
        )}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-bg/90 px-4 py-3 backdrop-blur sm:px-8">
          <Link href="/" className="lg:hidden" aria-label="לוח בקרה">
            <Logo className="h-6" />
          </Link>
          <p className="hidden sm:block text-sm text-muted">
            יום {formatWeekday(today).replace("יום ", "")}, {formatHebrew(today)} · {formatGregorian(today, true)}
          </p>
          <div className="flex-1" />
          <AccessibilityMenu />
          <ThemeToggle />
          <div className="mx-1 hidden h-6 w-px bg-border sm:block" />
          <div className="flex items-center gap-2">
            <Avatar name={user.name} color={user.avatarColor} size={34} />
            <div className="hidden sm:block leading-tight">
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-muted">{isManager ? "מנהל/ת" : user.jobTitle}</p>
            </div>
          </div>
          <form action={logout}>
            <button className="rounded-full p-2.5 text-muted hover:bg-surface-2 hover:text-fg" aria-label="יציאה" title="יציאה">
              <LogOut size={20} aria-hidden />
            </button>
          </form>
        </header>
        <main id="main" className="flex-1 px-4 pb-28 pt-6 sm:px-8 lg:pb-10">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
      <BottomNav isManager={isManager} />
      <BirthdayCelebration
        celebrants={celebrants}
        me={{ id: user.id, name: user.name }}
        todayKey={today.toISOString().slice(0, 10)}
        greetings={GREETINGS}
      />
    </div>
  );
}
