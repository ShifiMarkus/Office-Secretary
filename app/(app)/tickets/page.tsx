import { Inbox } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";
export const metadata = { title: "פניות" };
export default function Page() {
  return (
    <ComingSoon
      title="פניות"
      icon={Inbox}
      stage={3}
      features={[
        "פתיחת פנייה לפי סוג, כולל פניות שכר חסויות",
        "בחירת רמת עדיפות ולמי לשלוח",
        "מעקב סטטוס ותגובות",
        "זמני טיפול יעד והתראה כשחורגים",
      ]}
    />
  );
}
