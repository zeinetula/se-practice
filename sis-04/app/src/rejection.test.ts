// Tests for explainRejection and whyUnavailable (src/booking.ts): the reason behind a "no".
// The page used to work the reason out itself (describeDecision in lib/availability.ts), repeating
// the AC1-AC4 conditions. Now the rules module gives the reason and the page only words it.
// Expected reasons follow the order of AC1-AC4 in the SIS #04 README (section 5): an invalid
// interval first, then a start that is not in the future, then more than 120 minutes, then a
// blocked room, then an overlap. now = 540 (09:00), bookings = [600-660] unless a test says otherwise.

import { describe, expect, test } from 'vitest';
import { canBook, explainRejection, whyUnavailable } from './booking';
import type { BookingRequest } from './booking';
import type { Room } from './rooms';

function makeRequest(start: number, end: number, changes: Partial<BookingRequest> = {}): BookingRequest {
  return { start, end, now: 540, blocked: false, bookings: [{ start: 600, end: 660 }], ...changes };
}

describe('explainRejection gives the first rule that fails', () => {
  test('AC1: a reversed interval (750-720) is invalid-interval', () => {
    expect(explainRejection(makeRequest(750, 720))).toEqual({ reason: 'invalid-interval' });
  });

  test('AC1: an interval past 24:00 (1380-1441) is invalid-interval', () => {
    expect(explainRejection(makeRequest(1380, 1441))).toEqual({ reason: 'invalid-interval' });
  });

  test('AC1: a start equal to now (540-570) is not-future', () => {
    expect(explainRejection(makeRequest(540, 570))).toEqual({ reason: 'not-future' });
  });

  test('AC2: 121 minutes (720-841) is too-long', () => {
    expect(explainRejection(makeRequest(720, 841))).toEqual({ reason: 'too-long' });
  });

  test('AC3: a blocked room is blocked, even when the time is free', () => {
    expect(explainRejection(makeRequest(720, 780, { blocked: true }))).toEqual({ reason: 'blocked' });
  });

  test('AC4: 630-690 overlapping 600-660 is overlap and names that booking', () => {
    expect(explainRejection(makeRequest(630, 690))).toEqual({ reason: 'overlap', clash: { start: 600, end: 660 } });
  });

  test('AC4: the clash named is the booking that overlaps, not the first one in the list', () => {
    const request = makeRequest(750, 800, { bookings: [{ start: 600, end: 660 }, { start: 720, end: 780 }] });
    expect(explainRejection(request)).toEqual({ reason: 'overlap', clash: { start: 720, end: 780 } });
  });

  test('AC1 AC3: when two rules fail, the earlier one is reported (blocked room, reversed interval)', () => {
    expect(explainRejection(makeRequest(750, 720, { blocked: true }))).toEqual({ reason: 'invalid-interval' });
  });

  test('AC4: 660-720 touching the booking has no rejection', () => {
    expect(explainRejection(makeRequest(660, 720))).toBeNull();
  });
});

describe('explainRejection agrees with canBook', () => {
  test('AC1 AC2 AC3 AC4: for a grid of requests, no rejection exactly when canBook is true', () => {
    const starts = [0, 540, 541, 600, 630, 659, 660, 720, 1380];
    const ends = [0, 541, 600, 660, 690, 720, 841, 1440, 1441];
    for (const start of starts) {
      for (const end of ends) {
        for (const blocked of [false, true]) {
          const request = makeRequest(start, end, { blocked });
          expect(explainRejection(request) === null).toBe(canBook(request));
        }
      }
    }
  });
});

describe('whyUnavailable uses the chosen room', () => {
  const catalog: Room[] = [
    { id: 'a', name: 'Room A', building: 'North', capacity: 8, equipment: [], blocked: false, bookings: [{ start: 600, end: 660 }] },
    { id: 'c', name: 'Room C', building: 'South', capacity: 20, equipment: [], blocked: true, bookings: [] },
  ];

  test('F3: a blocked room is reported as blocked', () => {
    expect(whyUnavailable(catalog, 'c', { start: 720, end: 780, now: 540 })).toEqual({ reason: 'blocked' });
  });

  test('F5: 600-660 in room a overlaps its own booking 600-660', () => {
    expect(whyUnavailable(catalog, 'a', { start: 600, end: 660, now: 540 })).toEqual({ reason: 'overlap', clash: { start: 600, end: 660 } });
  });

  test('F5: an unknown room id is unknown-room', () => {
    expect(whyUnavailable(catalog, 'zzz', { start: 720, end: 780, now: 540 })).toEqual({ reason: 'unknown-room' });
  });

  test('AC5: a free slot in room a has no rejection', () => {
    expect(whyUnavailable(catalog, 'a', { start: 660, end: 720, now: 540 })).toBeNull();
  });
});
