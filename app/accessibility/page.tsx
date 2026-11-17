import Link from "next/link";
import { config } from "@/lib/config";
import { Logo } from "@/components/Logo";

export const metadata = { title: "הצהרת נגישות" };

export default function AccessibilityStatement() {
  const c = config.accessibility;
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/" aria-label="חזרה למערכת"><Logo className="h-8" /></Link>
      <article className="card mt-6 space-y-4 p-6 leading-relaxed sm:p-8">
        <h1 className="text-2xl font-bold">הצהרת נגישות</h1>
        <p>
          TRUSTECH רואה חשיבות רבה במתן שירות שוויוני ונגיש לכל העובדים. המזכירה הווירטואלית
          נבנתה כך שתהיה נגישה לאנשים עם מוגבלות, בהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות
          (התאמות נגישות לשירות), התשע״ג-2013, ולתקן הישראלי ת״י 5568 (המבוסס על הנחיות WCAG 2.0 ברמה AA).
        </p>
        <h2 className="text-lg font-semibold">מה נעשה במערכת</h2>
        <ul className="list-disc space-y-1 pr-5">
          <li>אפשר לנווט בכל המערכת באמצעות המקלדת, וכל רכיב מסומן כשהוא בפוקוס.</li>
          <li>המערכת מותאמת לקוראי מסך: כותרות, תוויות לשדות ותיאורים לכפתורים.</li>
          <li>ניגודיות צבעים לפי הדרישות, ותמיכה במצב כהה.</li>
          <li>תפריט נגישות: הגדלת טקסט, ניגודיות גבוהה, הדגשת קישורים ועצירת הנפשות.</li>
          <li>כשבמכשיר מוגדר "צמצום תנועה", ההנפשות לא מוצגות.</li>
          <li>המערכת מותאמת לטלפונים ולטאבלטים.</li>
        </ul>
        <h2 className="text-lg font-semibold">נתקלתם בבעיה?</h2>
        <p>נשמח לשמוע ולתקן. אפשר לפנות לרכז/ת הנגישות:</p>
        <ul className="pr-5">
          <li>שם: {c.name || "(יוגדר בהמשך)"}</li>
          <li>מייל: {c.email ? <a href={`mailto:${c.email}`} className="text-primary underline">{c.email}</a> : "(יוגדר בהמשך)"}</li>
          <li>טלפון: {c.phone || "(יוגדר בהמשך)"}</li>
        </ul>
        <p className="text-sm text-muted">עדכון אחרון של ההצהרה: נובמבר 2026</p>
        <Link href="/" className="inline-block rounded-xl bg-primary px-5 py-2.5 font-semibold text-primary-fg">חזרה למערכת</Link>
      </article>
    </main>
  );
}
