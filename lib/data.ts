import "server-only";
import { db } from "./db";
import { todayIL } from "./dates";
import { upcomingBirthdays } from "./birthdays";

export const GREETINGS = [
  "כל צוות TRUSTECH מאחל לך שנה של בריאות, הצלחה ושמחה!",
  "{name}, שתהיה לך שנה מלאה בהצלחות, סיפוק ורגעים טובים. מזל טוב מכולנו!",
  "מאחלים לך שנה נפלאה, מלאה בברכה ובעשייה טובה. מזל טוב מכל הצוות!",
];

export async function birthdayUsers() {
  return db.user.findMany({
    where: { showBirthday: true, birthDate: { not: null } },
    select: {
      id: true,
      name: true,
      jobTitle: true,
      avatarColor: true,
      birthDate: true,
      bornAfterSunset: true,
      celebrateBy: true,
      showBirthday: true,
      showBirthYear: true,
    },
  });
}

export async function todaysCelebrants() {
  const today = todayIL();
  const events = upcomingBirthdays(await birthdayUsers(), today, 0);
  return events.map((e) => ({ id: e.user.id, name: e.user.name, shifted: e.shifted, age: e.age }));
}
