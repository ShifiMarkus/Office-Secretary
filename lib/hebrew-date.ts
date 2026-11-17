/**
 * חישובי תאריך עברי וימי הולדת.
 * החישוב נעשה בספרייה @hebcal/core, כולל הכללים של אדר בשנה מעוברת
 * ושל ל' חשוון / ל' כסלו בשנים שבהן אין יום כזה.
 */
import { HDate, HebrewCalendar, flags, gematriya } from "@hebcal/core";
import { addDays, utcDate } from "./dates";

const MONTHS_HE: Record<string, string> = {
  Nisan: "ניסן",
  Iyyar: "אייר",
  Sivan: "סיוון",
  Tamuz: "תמוז",
  Av: "אב",
  Elul: "אלול",
  Tishrei: "תשרי",
  Cheshvan: "חשוון",
  Kislev: "כסלו",
  Tevet: "טבת",
  "Sh'vat": "שבט",
  Adar: "אדר",
  "Adar I": "אדר א׳",
  "Adar II": "אדר ב׳",
};

/** המרה מתאריך "ללא שעה" (חצות UTC) ל-HDate */
function toHDate(d: Date): HDate {
  return new HDate(new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function fromHDate(h: HDate): Date {
  const g = h.greg();
  return utcDate(g.getFullYear(), g.getMonth(), g.getDate());
}

/** הספרה העברית ללא גרשיים בסוף מיותרים: ז׳, ט״ו, כ״ג */
function hebNum(n: number): string {
  return gematriya(n);
}

/** "כ״ג בכסלו" או "כ״ג בכסלו תשפ״ז" */
export function formatHebrew(d: Date, withYear = false): string {
  const h = toHDate(d);
  const month = MONTHS_HE[h.getMonthName()] ?? h.getMonthName();
  const base = `${hebNum(h.getDate())} ב${month}`;
  return withYear ? `${base} ${gematriya(h.getFullYear() % 1000)}` : base;
}

/** התאריך העברי של הלידה (מתחשב בלידה אחרי השקיעה) */
export function hebrewBirthDate(birth: Date, afterSunset: boolean): Date {
  return afterSunset ? addDays(birth, 1) : birth;
}

/** מועד יום ההולדת העברי בשנה עברית נתונה, כתאריך לועזי */
export function hebrewBirthdayInYear(
  birth: Date,
  afterSunset: boolean,
  hyear: number,
): Date | null {
  const base = hebrewBirthDate(birth, afterSunset);
  const res = HebrewCalendar.getBirthdayOrAnniversary(
    hyear,
    new Date(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate()),
  );
  return res ? fromHDate(res) : null;
}

/** יום ההולדת העברי הקרוב (כולל היום) */
export function nextHebrewBirthday(birth: Date, afterSunset: boolean, from: Date): Date | null {
  const hy = toHDate(from).getFullYear();
  for (const y of [hy, hy + 1]) {
    const d = hebrewBirthdayInYear(birth, afterSunset, y);
    if (d && d.getTime() >= from.getTime()) return d;
  }
  return null;
}

/** יום ההולדת הלועזי הקרוב (כולל היום). 29 בפברואר → 28 בפברואר בשנה רגילה */
export function nextGregorianBirthday(birth: Date, from: Date): Date {
  const m = birth.getUTCMonth();
  const d = birth.getUTCDate();
  for (const y of [from.getUTCFullYear(), from.getUTCFullYear() + 1]) {
    let candidate = utcDate(y, m, d);
    if (candidate.getUTCMonth() !== m) candidate = utcDate(y, m, d - 1); // 29.2
    if (candidate.getTime() >= from.getTime()) return candidate;
  }
  return utcDate(from.getUTCFullYear() + 1, m, d);
}

/** האם זה יום עבודה: לא שישי, לא שבת ולא יום טוב */
export function isWorkday(d: Date): boolean {
  const dow = d.getUTCDay();
  if (dow === 5 || dow === 6) return false;
  const events = HebrewCalendar.getHolidaysOnDate(toHDate(d), true) ?? [];
  return !events.some((e) => e.getFlags() & flags.CHAG);
}

/** אם המועד לא יוצא ביום עבודה — יום העבודה הקודם */
export function celebrationDay(d: Date): { date: Date; shifted: boolean } {
  let cur = d;
  let shifted = false;
  for (let i = 0; i < 10 && !isWorkday(cur); i++) {
    cur = addDays(cur, -1);
    shifted = true;
  }
  return { date: cur, shifted };
}

export function hebrewYearOf(d: Date): number {
  return toHDate(d).getFullYear();
}
