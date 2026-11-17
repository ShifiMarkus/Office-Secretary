import type { User } from "./generated/prisma/client";
import { addDays, daysBetween } from "./dates";
import {
  celebrationDay,
  formatHebrew,
  nextGregorianBirthday,
  nextHebrewBirthday,
  hebrewBirthDate,
} from "./hebrew-date";

export type BirthdayEvent = {
  user: Pick<User, "id" | "name" | "jobTitle" | "avatarColor" | "showBirthYear" | "birthDate">;
  kind: "HEBREW" | "GREGORIAN";
  /** המועד בפועל */
  date: Date;
  /** היום שבו חוגגים במשרד (יום העבודה הקודם אם יוצא בשישי/שבת/חג) */
  celebrateOn: Date;
  shifted: boolean;
  /** בן/בת כמה (לפי השנה הלועזית) — רק אם העובד/ת הסכים/ה להציג שנה */
  age?: number;
  hebrewBirth: string;
  inDays: number;
};

type BUser = Pick<
  User,
  | "id"
  | "name"
  | "jobTitle"
  | "avatarColor"
  | "birthDate"
  | "bornAfterSunset"
  | "celebrateBy"
  | "showBirthday"
  | "showBirthYear"
>;

/** כל ימי ההולדת שחוגגים בטווח [from, from+days] */
export function upcomingBirthdays(users: BUser[], from: Date, days: number): BirthdayEvent[] {
  const until = addDays(from, days);
  const events: BirthdayEvent[] = [];
  // מתחילים מעט לפני — כדי לתפוס יום הולדת בשבת שנחגג כבר ביום חמישי
  const lookFrom = addDays(from, 0);
  for (const u of users) {
    if (!u.showBirthday || !u.birthDate) continue;
    const kinds: ("HEBREW" | "GREGORIAN")[] =
      u.celebrateBy === "BOTH" ? ["HEBREW", "GREGORIAN"] : [u.celebrateBy as "HEBREW" | "GREGORIAN"];
    for (const kind of kinds) {
      for (const probe of [lookFrom, addDays(lookFrom, 3)]) {
        const date =
          kind === "HEBREW"
            ? nextHebrewBirthday(u.birthDate, u.bornAfterSunset, probe)
            : nextGregorianBirthday(u.birthDate, probe);
        if (!date) continue;
        const { date: celebrateOn, shifted } = celebrationDay(date);
        if (celebrateOn < from || celebrateOn > until) continue;
        if (events.some((e) => e.user.id === u.id && e.kind === kind && +e.date === +date)) continue;
        events.push({
          user: u,
          kind,
          date,
          celebrateOn,
          shifted,
          age: u.showBirthYear ? date.getUTCFullYear() - u.birthDate.getUTCFullYear() : undefined,
          hebrewBirth: formatHebrew(hebrewBirthDate(u.birthDate, u.bornAfterSunset)),
          inDays: daysBetween(from, celebrateOn),
        });
      }
    }
  }
  // אם שני המועדים של אותו אדם נופלים באותו יום — מציגים פעם אחת
  const dedup = events.filter(
    (e, i) => events.findIndex((x) => x.user.id === e.user.id && +x.celebrateOn === +e.celebrateOn) === i,
  );
  return dedup.sort((a, b) => +a.celebrateOn - +b.celebrateOn || a.user.name.localeCompare(b.user.name, "he"));
}

export function birthdaysToday(users: BUser[], today: Date): BirthdayEvent[] {
  return upcomingBirthdays(users, today, 0);
}
