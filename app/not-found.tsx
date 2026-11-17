import Link from "next/link";
export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-4 text-center">
      <p className="text-5xl" aria-hidden>🧭</p>
      <h1 className="text-2xl font-bold">הדף לא נמצא</h1>
      <Link href="/" className="rounded-xl bg-primary px-5 py-2.5 font-semibold text-primary-fg">חזרה ללוח הבקרה</Link>
    </main>
  );
}
