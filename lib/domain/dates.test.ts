import { describe, expect, it } from "vitest";

import { formatHistoryListDate, formatLocalDate, todayLocalDate } from "@/lib/domain/dates";

describe("lib/domain/dates", () => {
  it("formats local date as YYYY-MM-DD with zero-padding", () => {
    const date = new Date(2026, 6, 5); // July 5, 2026 local
    expect(formatLocalDate(date)).toBe("2026-07-05");
  });

  it("does not use UTC (avoids off-by-one near midnight UTC)", () => {
    const date = new Date(2026, 0, 1, 23, 30);
    expect(formatLocalDate(date)).toBe("2026-01-01");
  });

  it("returns today in local timezone", () => {
    const now = new Date();
    const expected = formatLocalDate(now);
    expect(todayLocalDate()).toBe(expected);
  });

  it("formats history list date in Spanish with capitalized weekday", () => {
    expect(formatHistoryListDate("2026-07-12")).toMatch(/^Domingo, 12 de julio$/);
  });
});
