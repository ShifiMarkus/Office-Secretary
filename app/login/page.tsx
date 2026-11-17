import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { isDemoMode } from "@/lib/config";
import { demoLogin } from "@/app/actions";
import { Logo } from "@/components/Logo";
import { Avatar } from "@/components/Avatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AccessibilityMenu } from "@/components/AccessibilityMenu";

export const metadata = { title: "כניסה" };
export const dynamic = "force-dynamic";

export default async function Login() {
  if (await getCurrentUser()) redirect("/");
  const users = isDemoMode ? await db.user.findMany({ orderBy: [{ role: "desc" }, { name: "asc" }] }) : [];
  const managers = users.filter((u) => u.role === "MANAGER");
  const employees = users.filter((u) => u.role !== "MANAGER");

  const UserButton = ({ u }: { u: (typeof users)[number] }) => (
    <form action={demoLogin}>
      <input type="hidden" name="userId" value={u.id} />
      <button className="flex w-full items-center gap-3 rounded-xl border border-border bg-surface p-3 text-start transition hover:border-primary hover:bg-primary-soft">
        <Avatar name={u.name} color={u.avatarColor} size={36} />
        <span className="min-w-0">
          <span className="block truncate font-medium">{u.name}</span>
          <span className="block truncate text-xs text-muted">{u.jobTitle}</span>
        </span>
      </button>
    </form>
  );

  return (
    <main className="relative flex min-h-dvh items-center justify-center p-4">
      <div className="absolute top-3 left-3 flex">
        <AccessibilityMenu />
        <ThemeToggle />
      </div>
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <div className="flex justify-center"><Logo className="h-12" /></div>
          <h1 className="mt-4 text-2xl font-bold">המזכירה הווירטואלית</h1>
          <p className="mt-1 text-muted">כל ענייני המשרד, במקום אחד</p>
        </div>
        <div className="card p-6 sm:p-8">
          <button
            disabled={isDemoMode}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-primary py-3.5 font-semibold text-primary-fg disabled:opacity-50"
          >
            <svg aria-hidden width="20" height="20" viewBox="0 0 21 21"><rect width="10" height="10" fill="#f25022"/><rect x="11" width="10" height="10" fill="#7fba00"/><rect y="11" width="10" height="10" fill="#00a4ef"/><rect x="11" y="11" width="10" height="10" fill="#ffb900"/></svg>
            כניסה עם החשבון הארגוני (Microsoft 365)
          </button>
          {isDemoMode && (
            <>
              <p className="mt-2 text-center text-xs text-muted">הכניסה הארגונית תופעל אחרי הגדרת החיבור ל-Microsoft 365</p>
              <div className="my-6 flex items-center gap-3 text-sm text-muted">
                <span className="h-px flex-1 bg-border" /> מצב הדגמה: בחרו משתמש לדוגמה <span className="h-px flex-1 bg-border" />
              </div>
              <h2 className="mb-2 text-sm font-semibold">מנהלים</h2>
              <div className="grid gap-2 sm:grid-cols-2">{managers.map((u) => <UserButton key={u.id} u={u} />)}</div>
              <h2 className="mt-5 mb-2 text-sm font-semibold">עובדים</h2>
              <div className="grid gap-2 sm:grid-cols-2">{employees.map((u) => <UserButton key={u.id} u={u} />)}</div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
