import { describe, expect, it } from "vitest";

import {
  formatStretchCountdown,
  remainingFromEndsAt,
} from "@/lib/domain/stretch-timer";

describe("lib/domain/stretch-timer", () => {
  it("formats countdown as m:ss", () => {
    expect(formatStretchCountdown(32)).toBe("0:32");
    expect(formatStretchCountdown(60)).toBe("1:00");
    expect(formatStretchCountdown(125)).toBe("2:05");
    expect(formatStretchCountdown(0)).toBe("0:00");
    expect(formatStretchCountdown(-3)).toBe("0:00");
  });

  it("computes remaining seconds from wall-clock end time", () => {
    expect(remainingFromEndsAt(10_000, 7_400)).toBe(3);
    expect(remainingFromEndsAt(10_000, 10_000)).toBe(0);
    expect(remainingFromEndsAt(10_000, 12_000)).toBe(0);
  });
});
