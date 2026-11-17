import { describe, expect, it } from "vitest";
import { utcDate } from "../lib/dates";
import {
  celebrationDay,
  formatHebrew,
  hebrewBirthdayInYear,
  isWorkday,
  nextGregorianBirthday,
} from "../lib/hebrew-date";

describe("תאריך עברי", () => {
  it("מציג תאריך בפורמט עברי", () => {
    expect(formatHebrew(utcDate(2026, 10, 17))).toBe("ז׳ בכסלו");
  });

  it("לידה אחרי השקיעה מזיזה את התאריך העברי ביום", () => {
    // 17.11.2026 = ז׳ כסלו; אחרי השקיעה → ח׳ כסלו
    const birth = utcDate(2026, 10, 17);
    const a = hebrewBirthdayInYear(birth, false, 5788)!;
    const b = hebrewBirthdayInYear(birth, true, 5788)!;
    expect(formatHebrew(a)).toBe("ז׳ בכסלו");
    expect(formatHebrew(b)).toBe("ח׳ בכסלו");
  });

  it("נולד באדר בשנה רגילה — חוגג באדר ב׳ בשנה מעוברת", () => {
    // 5.3.1995 = ג׳ אדר תשנ״ה (שנה רגילה). תשפ״ז (5787) מעוברת
    const d = hebrewBirthdayInYear(utcDate(1995, 2, 5), false, 5787)!;
    expect(formatHebrew(d)).toBe("ג׳ באדר ב׳");
  });

  it("ל׳ חשוון בשנה שבה אין ל׳ — חוגגים בא׳ כסלו", () => {
    // ל׳ חשוון תשפ״ה = 1.12.2024 ; בתשפ״ט לחשוון 29 יום
    const d = hebrewBirthdayInYear(utcDate(2024, 11, 1), false, 5789)!;
    expect(formatHebrew(d)).toBe("א׳ בכסלו");
  });
});

describe("יום הולדת לועזי", () => {
  it("29 בפברואר בשנה רגילה → 28 בפברואר", () => {
    const d = nextGregorianBirthday(utcDate(1992, 1, 29), utcDate(2027, 0, 1));
    expect(d).toEqual(utcDate(2027, 1, 28));
  });
});

describe("ימי עבודה", () => {
  it("שישי ושבת אינם ימי עבודה, ויום הולדת בשבת נחגג ביום חמישי", () => {
    const sat = utcDate(2026, 10, 21); // שבת
    expect(isWorkday(sat)).toBe(false);
    const c = celebrationDay(sat);
    expect(c.shifted).toBe(true);
    expect(c.date).toEqual(utcDate(2026, 10, 19));
  });

  it("יום טוב אינו יום עבודה", () => {
    expect(isWorkday(utcDate(2026, 8, 12))).toBe(false); // ראש השנה תשפ״ז
  });
});
