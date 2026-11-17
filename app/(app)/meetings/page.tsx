import { CalendarDays } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";
export const metadata = { title: "זימון פגישות" };
export default function Page() {
  return (
    <ComingSoon
      title="זימון פגישות"
      icon={CalendarDays}
      stage={4}
      features={[
        "זימון כל הצוות או חלק ממנו",
        "בדיקת זמינות ביומני Outlook והצעת מועדים",
        "הזימון נשלח ישירות ליומני המשתתפים",
        "מעקב מי אישר ומי לא",
      ]}
    />
  );
}
