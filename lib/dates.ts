/**
 * עזרי תאריכים. כל התאריכים "ללא שעה" מיוצגים כ-Date בחצות UTC,
 * ו"היום" מחושב לפי שעון ישראל.
 */
export const TZ = "Asia/Jerusalem";

export function utcDate(y: number, m: number, d: number): Date {
  return new Date(Date.UTC(y, m, d));
}

/** התאריך של היום בישראל, כחצות UTC */
export function todayIL(now: Date = new Date()): Date {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  const [y, m, d] = parts.split("-").map(Number);
  return utcDate(y, m - 1, d);
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 86_400_000);
}

export function sameDay(a: Date, b: Date): boolean {
  return a.getTime() === b.getTime();
}

export function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

const GREG = new Intl.DateTimeFormat("he-IL", {
  timeZone: "UTC",
  day: "numeric",
  month: "long",
});
const GREG_YEAR = new Intl.DateTimeFormat("he-IL", {
  timeZone: "UTC",
  day: "numeric",
  month: "long",
  year: "numeric",
});
const WEEKDAY = new Intl.DateTimeFormat("he-IL", { timeZone: "UTC", weekday: "long" });

export function formatGregorian(d: Date, withYear = false): string {
  return (withYear ? GREG_YEAR : GREG).format(d);
}

export function formatWeekday(d: Date): string {
  return WEEKDAY.format(d);
}
