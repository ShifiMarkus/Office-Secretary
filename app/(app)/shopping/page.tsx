import { ShoppingCart } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";
export const metadata = { title: "רשימת קניות" };
export default function Page() {
  return (
    <ComingSoon
      title="רשימת קניות"
      icon={ShoppingCart}
      stage={2}
      features={[
        "דיווח חוסר בלחיצה אחת: מטבח, ציוד משרדי ועוד",
        "קטגוריות שמנהלים מוסיפים, עם הגדרה מה גלוי לכולם",
        "מטבח נכנס ישר לרשימה, ציוד משרדי ממתין לאישור מנהל",
        "סימון \"נקנה\" עם כמות ומחיר (המחירים גלויים למנהלים בלבד)",
        "דוחות הוצאות ותקציב (לא חובה)",
      ]}
    />
  );
}
