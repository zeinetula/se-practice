// Final suite for canBook (src/booking.ts), the function the page calls.
// Started from the assistant's first suite (suites/first/booking.test.ts), then revised
// in review (lab-report.md sections 5 and 6.2).
// Expected values come from AC1–AC4 and the case table in lab-report.md section 3,
// never from the code.
// Default fixture: now = 540 (09:00), blocked = false, bookings = [{ start: 600, end: 660 }],
// built fresh for every test. Time is a plain number: no system clock is read or faked.

import { describe, expect, test } from 'vitest';
import { canBook } from './booking';
import type { BookingRequest } from './booking';

const NOW = 540;

// A fresh request every call: new object and new bookings array, never shared between tests.
function makeRequest(
  start: number,
  end: number,
  changes: Partial<Omit<BookingRequest, 'start' | 'end'>> = {},
): BookingRequest {
  return {
    start,
    end,
    now: NOW,
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
    ...changes,
  };
}

// Freezes the request and its bookings: any write inside canBook throws a TypeError
// (ES modules run in strict mode), so a change that is undone later is still caught (AC5).
function deepFreeze(request: BookingRequest): BookingRequest {
  request.bookings.forEach((b) => Object.freeze(b));
  Object.freeze(request.bookings);
  return Object.freeze(request);
}

// Calls the real canBook on a frozen request, checks the bookings did not change,
// and returns the decision. Each test asserts that decision itself with .toBe(...).
function decide(request: BookingRequest): boolean {
  const before = structuredClone(request.bookings);
  const decision = canBook(deepFreeze(request));
  expect(request.bookings).toEqual(before);
  return decision;
}

describe('AC1: valid interval inside the day, start after the supplied now', () => {
  test('T02 AC1: 540–570 starts exactly at now (540) is rejected', () => {
    expect(decide(makeRequest(540, 570))).toBe(false);
  });

  test('R01 AC1: 541–571 starts one minute after now is accepted (pair of the starts-now case)', () => {
    expect(decide(makeRequest(541, 571))).toBe(true);
  });

  test('T03 AC1: 720–720 zero duration is rejected', () => {
    expect(decide(makeRequest(720, 720))).toBe(false);
  });

  test('T04 AC1: 750–720 reversed interval is rejected', () => {
    expect(decide(makeRequest(750, 720))).toBe(false);
  });

  test('T05 AC1: 1380–1441 past the end of the day is rejected', () => {
    expect(decide(makeRequest(1380, 1441))).toBe(false);
  });

  test('R02 AC1: 1380–1440 ending exactly at 24:00 is accepted (pair of the past-day-end case)', () => {
    expect(decide(makeRequest(1380, 1440))).toBe(true);
  });

  test('X1 AC1 AC2: 1320–1440 ends at 24:00 and lasts exactly 120 minutes, accepted', () => {
    expect(decide(makeRequest(1320, 1440))).toBe(true);
  });

  test('R05 AC1: 660–720 with now = 659 is accepted (the supplied now is used)', () => {
    expect(decide(makeRequest(660, 720, { now: 659 }))).toBe(true);
  });

  test('R06 AC1: 660–720 with now = 660 is rejected (start equals the supplied now)', () => {
    expect(decide(makeRequest(660, 720, { now: 660 }))).toBe(false);
  });
});

describe('AC2: no longer than 120 minutes', () => {
  test('T06 AC2: 720–840, exactly 120 minutes, is accepted', () => {
    expect(decide(makeRequest(720, 840))).toBe(true);
  });

  test('T07 AC2: 720–841, 121 minutes, is rejected', () => {
    expect(decide(makeRequest(720, 841))).toBe(false);
  });
});

describe('AC3: blocked room', () => {
  test('T13 AC3: 660–720 in a blocked room is rejected', () => {
    expect(decide(makeRequest(660, 720, { blocked: true }))).toBe(false);
  });
});

describe('AC4: no overlap, touching endpoints allowed', () => {
  test('T01 AC4: 660–720 touching the end of 600–660 is accepted', () => {
    expect(decide(makeRequest(660, 720))).toBe(true);
  });

  test('T08 AC4: 570–600 touching the start of 600–660 is accepted', () => {
    expect(decide(makeRequest(570, 600))).toBe(true);
  });

  test('R03 AC4: 659–720 overlapping the booking by one minute at its end is rejected', () => {
    expect(decide(makeRequest(659, 720))).toBe(false);
  });

  test('R04 AC4: 541–601 overlapping the booking by one minute at its start is rejected', () => {
    expect(decide(makeRequest(541, 601))).toBe(false);
  });

  test('T09 AC4: 630–690 partial overlap is rejected', () => {
    expect(decide(makeRequest(630, 690))).toBe(false);
  });

  test('T10 AC4: 570–690 containing the whole booking is rejected', () => {
    expect(decide(makeRequest(570, 690))).toBe(false);
  });

  test('T11 AC4: 615–645 inside the booking is rejected', () => {
    expect(decide(makeRequest(615, 645))).toBe(false);
  });

  test('T12 AC4: 600–660 identical to the booking is rejected', () => {
    expect(decide(makeRequest(600, 660))).toBe(false);
  });

  test('T14 AC4: 630–690 with no bookings is accepted', () => {
    expect(decide(makeRequest(630, 690, { bookings: [] }))).toBe(true);
  });

  test('X2 AC4: 750–800 clear of 600–660 but overlapping the second booking 720–780 is rejected', () => {
    const request = makeRequest(750, 800, {
      bookings: [
        { start: 600, end: 660 },
        { start: 720, end: 780 },
      ],
    });
    expect(decide(request)).toBe(false);
  });
});

describe('AC5: the decision does not change the existing booking data', () => {
  test('AC5: an Available request leaves the bookings equal to a copy taken before the call', () => {
    const request = makeRequest(660, 720);
    const sameArray = request.bookings;
    const before = JSON.stringify(request.bookings);

    const decision = canBook(deepFreeze(request));

    expect(decision).toBe(true); // the success path, where a booking could be added
    expect(request.bookings).toBe(sameArray);
    expect(JSON.stringify(request.bookings)).toBe(before);
  });
});
