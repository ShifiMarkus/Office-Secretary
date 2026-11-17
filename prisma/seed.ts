/**
 * נתוני הדגמה. רץ אוטומטית ב-npm run dev, ואפשר להריץ שוב ב-npm run seed.
 * תאריכי הלידה מחושבים ביחס להיום — כדי שתמיד יהיה מי שחוגג היום.
 */
import "dotenv/config";
import { db } from "../lib/db";
import { addDays, todayIL, utcDate } from "../lib/dates";
import { celebrationDay, isWorkday } from "../lib/hebrew-date";

const COLORS = ["#4A6076", "#889DB0", "#2E7D6B", "#7A5C99", "#B5651D", "#3D6FA8", "#8A4F4F", "#5C7A3D"];

function yearsAgo(d: Date, years: number) {
  return utcDate(d.getUTCFullYear() - years, d.getUTCMonth(), d.getUTCDate());
}

async function main() {
  const existing = await db.user.count();
  if (existing > 0 && !process.argv.includes("--force")) {
    console.log("נתוני ההדגמה כבר קיימים (להרצה מחדש: npm run seed -- --force)");
    return;
  }
  await db.birthdayWish.deleteMany();
  await db.announcementRead.deleteMany();
  await db.announcement.deleteMany();
  await db.user.deleteMany();
  await db.team.deleteMany();

  const today = todayIL();
  // יום הולדת "היום": אם היום אינו יום עבודה — היום שבו חוגגים יהיה יום העבודה הקודם, אז נבחר את יום העבודה הבא
  let party = today;
  while (!isWorkday(party)) party = addDays(party, 1);
  void celebrationDay;

  const dev = await db.team.create({ data: { name: "צוות פיתוח" } });

  const people: Array<{
    name: string;
    email: string;
    jobTitle: string;
    role?: "MANAGER" | "EMPLOYEE";
    mobile: string;
    birth?: Date;
    celebrateBy?: "HEBREW" | "GREGORIAN" | "BOTH";
    afterSunset?: boolean;
    showYear?: boolean;
    hideMobile?: boolean;
  }> = [
    { name: "יוסף כהן", email: "yosef@trustech.demo", jobTitle: "מנכ״ל", role: "MANAGER", mobile: "050-1234567", birth: yearsAgo(addDays(today, 12), 48), celebrateBy: "HEBREW" },
    { name: "שפרה מרקוס", email: "shifra@trustech.demo", jobTitle: "מנהלת תפעול", role: "MANAGER", mobile: "052-2345678", birth: yearsAgo(addDays(today, 40), 35) },
    { name: "אברהם לוי", email: "avraham@trustech.demo", jobTitle: "סמנכ״ל טכנולוגיות", role: "MANAGER", mobile: "054-3456789", birth: yearsAgo(addDays(today, 5), 41), celebrateBy: "GREGORIAN" },
    { name: "רחל פרידמן", email: "rachel@trustech.demo", jobTitle: "מנהלת כספים", role: "MANAGER", mobile: "053-4567890", birth: yearsAgo(addDays(today, 70), 39) },
    { name: "משה גרינברג", email: "moshe@trustech.demo", jobTitle: "מפתח Full Stack", mobile: "050-5678901", birth: yearsAgo(party, 29), celebrateBy: "GREGORIAN", showYear: true },
    { name: "חיים וייס", email: "chaim@trustech.demo", jobTitle: "ראש צוות פיתוח", mobile: "052-6789012", birth: yearsAgo(addDays(today, 3), 33), celebrateBy: "HEBREW", afterSunset: true },
    { name: "לאה שטרן", email: "leah@trustech.demo", jobTitle: "מפתחת Backend", mobile: "054-7890123", birth: yearsAgo(addDays(today, 21), 27) },
    { name: "דוד רוזן", email: "david@trustech.demo", jobTitle: "מהנדס DevOps", mobile: "058-8901234", birth: yearsAgo(addDays(today, 9), 31), celebrateBy: "GREGORIAN" },
    { name: "מרים קליין", email: "miriam@trustech.demo", jobTitle: "מפתחת Frontend", mobile: "050-9012345", hideMobile: true, birth: yearsAgo(addDays(today, 100), 26) },
    { name: "יעקב שפירא", email: "yaakov@trustech.demo", jobTitle: "מיישם מערכות", mobile: "052-0123456" },
    { name: "שרה ברגר", email: "sara@trustech.demo", jobTitle: "בודקת תוכנה (QA)", mobile: "054-1122334", birth: yearsAgo(addDays(today, 150), 30) },
    { name: "בנימין הורוביץ", email: "binyamin@trustech.demo", jobTitle: "מפתח מערכות מידע", mobile: "053-2233445", birth: utcDate(1992, 1, 29), celebrateBy: "GREGORIAN" },
    { name: "אסתר וולף", email: "esther@trustech.demo", jobTitle: "מנתחת מערכות", mobile: "050-3344556", birth: utcDate(1995, 2, 5), celebrateBy: "HEBREW" },
    { name: "שמואל אדלר", email: "shmuel@trustech.demo", jobTitle: "מפתח מובייל", mobile: "052-4455667", birth: yearsAgo(addDays(today, 26), 34) },
  ];

  const users = [];
  for (const [i, p] of people.entries()) {
    users.push(
      await db.user.create({
        data: {
          name: p.name,
          email: p.email,
          jobTitle: p.jobTitle,
          role: p.role ?? "EMPLOYEE",
          mobile: p.mobile,
          hideMobile: p.hideMobile ?? false,
          teamId: p.role === "MANAGER" ? null : dev.id,
          avatarColor: COLORS[i % COLORS.length],
          birthDate: p.birth ?? null,
          showBirthday: !!p.birth,
          bornAfterSunset: p.afterSunset ?? false,
          celebrateBy: p.celebrateBy ?? "BOTH",
          showBirthYear: p.showYear ?? false,
          hireDate: yearsAgo(addDays(today, 30 + i * 17), 1 + (i % 6)),
        },
      }),
    );
  }

  const [ceo, ops] = users;
  await db.announcement.createMany({
    data: [
      {
        title: "ברוכים הבאים למזכירה הווירטואלית!",
        body: "מהיום כל ענייני המשרד במקום אחד: רשימת קניות, פניות, זימון פגישות וספר טלפונים. נשמח לשמוע הערות והצעות.",
        pinned: true,
        important: true,
        authorId: ops.id,
      },
      {
        title: "ישיבת צוות חודשית",
        body: "ביום ראשון הקרוב בשעה 10:00 תתקיים ישיבת צוות חודשית במשרד. הזימון יישלח ליומן.",
        authorId: ceo.id,
        createdAt: addDays(new Date(), -1),
      },
      {
        title: "עדכון: נוהל הזמנת ציוד משרדי",
        body: "הזמנות ציוד משרדי דורשות מעכשיו אישור מנהל. את הבקשה מגישים דרך רשימת הקניות.",
        authorId: ops.id,
        createdAt: addDays(new Date(), -3),
      },
    ],
  });

  console.log(`נוצרו ${users.length} משתמשים לדוגמה ו-3 הודעות.`);
}

main().finally(() => db.$disconnect());
