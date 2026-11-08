// Tests for the booking decision used by the page (src/booking.ts).
// Sources: AC1–AC6 and the reviewed case table (T01–T14, AC5, X1, X2).
// Default fixture: now = 540, blocked = false, bookings = [{ start: 600, end: 660 }],
// built fresh for every test.

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { canBook } from './booking';
import type { BookingRequest } from './booking';

// Fixed time. canBook gets "now" as a parameter (540 = 09:00). The system clock
// is also frozen at the same moment, so a later change that reads the real
// clock still gives the same result on every run.
const FIXED_NOW = 540;
const FIXED_CLOCK = new Date('2026-01-15T09:00:00.000Z');

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(FIXED_CLOCK);
});

afterEach(() => {
  vi.useRealTimers();
});

// A fresh request every call: new object and new bookings array, never shared between tests.
function makeRequest(
  start: number,
  end: number,
  changes: Partial<Omit<BookingRequest, 'start' | 'end'>> = {},
): BookingRequest {
  return {
    start,
    end,
    now: FIXED_NOW,
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
    ...changes,
  };
}

// Checks the exact decision and that the booking data did not change.
function expectDecision(request: BookingRequest, expected: boolean): void {
  const bookingsRef = request.bookings;
  const bookingsBefore = request.bookings.map((b) => ({ ...b }));

  const decision = canBook(request);

  expect(decision).toBe(expected);
  expect(request.bookings).toBe(bookingsRef); // same array, not replaced
  expect(request.bookings).toStrictEqual(bookingsBefore); // same contents
}

describe('canBook – AC1: valid interval inside the day, start after now', () => {
  test('T02: 540–570 starts exactly at now (540) → false', () => {
    expectDecision(makeRequest(540, 570), false);
  });

  test('T03: 720–720 zero duration → false', () => {
    expectDecision(makeRequest(720, 720), false);
  });

  test('T04: 750–720 reversed interval → false', () => {
    expectDecision(makeRequest(750, 720), false);
  });

  test('T05: 1380–1441 ends past the end of the day → false', () => {
    expectDecision(makeRequest(1380, 1441), false);
  });

  test('X1: 1320–1440 ends exactly at 24:00 and is 120 minutes → true', () => {
    expectDecision(makeRequest(1320, 1440), true);
  });
});

describe('canBook – AC2: no longer than 120 minutes', () => {
  test('T06: 720–840 is exactly 120 minutes → true', () => {
    expectDecision(makeRequest(720, 840), true);
  });

  test('T07: 720–841 is 121 minutes → false', () => {
    expectDecision(makeRequest(720, 841), false);
  });
});

describe('canBook – AC3: blocked room', () => {
  test('T13: 660–720 (Available as in T01) but blocked = true → false', () => {
    expectDecision(makeRequest(660, 720, { blocked: true }), false);
  });
});

describe('canBook – AC4: no overlap, touching endpoints allowed', () => {
  test('T01: 660–720 touches the end of 600–660 → true', () => {
    expectDecision(makeRequest(660, 720), true);
  });

  test('T08: 570–600 touches the start of 600–660 → true', () => {
    expectDecision(makeRequest(570, 600), true);
  });

  test('T09: 630–690 partially overlaps 600–660 → false', () => {
    expectDecision(makeRequest(630, 690), false);
  });

  test('T10: 570–690 contains the whole booking (120 minutes) → false', () => {
    expectDecision(makeRequest(570, 690), false);
  });

  test('T11: 615–645 lies inside the booking → false', () => {
    expectDecision(makeRequest(615, 645), false);
  });

  test('T12: 600–660 is identical to the booking → false', () => {
    expectDecision(makeRequest(600, 660), false);
  });

  test('T14: 630–690 with no bookings → true', () => {
    expectDecision(makeRequest(630, 690, { bookings: [] }), true);
  });

  test('X2: 750–800 is clear of 600–660 but overlaps the second booking 720–780 → false', () => {
    expectDecision(
      makeRequest(750, 800, {
        bookings: [
          { start: 600, end: 660 },
          { start: 720, end: 780 },
        ],
      }),
      false,
    );
  });
});

describe('canBook – AC5: decision does not change existing booking data', () => {
  test('AC5: an Available request leaves the bookings equal to a copy taken before the call', () => {
    const request = makeRequest(660, 720);
    const bookingsRef = request.bookings;
    const copyBefore = [{ start: 600, end: 660 }];

    const decision = canBook(request);

    expect(decision).toBe(true); // the success path is exercised
    expect(request.bookings).toBe(bookingsRef);
    expect(request.bookings).toStrictEqual(copyBefore);
    expect(request.bookings).toHaveLength(1); // the accepted request was not added
  });
});
