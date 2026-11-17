import { Settings } from "lucide-react";
import { requireManager } from "@/lib/auth";
import { ComingSoon } from "@/components/ComingSoon";
export const metadata = { title: "הגדרות" };
export default async function Page() {
  await requireManager();
  return (
    <ComingSoon
      title="הגדרות"
      icon={Settings}
      stage={5}
      features={["ניהול משתמשים ומנהלים", "צוותים", "זמני טיפול בפניות", "נוסחי ברכות יום הולדת", "הפעלת ציון ותק"]}
    />
  );
}
