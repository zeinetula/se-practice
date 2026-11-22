// Tests for checkRoom (src/booking.ts): the availability check uses the chosen room's own data.
// Covers F3, F5, B1-B4 (through checkRoom), AC5 and one INT test (filterRooms then checkRoom).
// Fixed catalog inside the file; now = 540 (09:00) in every test. Expected values come from
// AC1-AC5 and F1-F5 in the SIS #04 README (section 5), never from what the code returns.
//   room a: capacity 8,  not blocked, booked 600-660
//   room b: capacity 12, not blocked, no bookings
//   room c: capacity 20, BLOCKED,     no bookings
//   room d: capacity 40, not blocked, booked 720-780

import { describe, expect, test } from 'vitest';
import { checkRoom } from './booking';
import { filterRooms } from './filter';
import type { Room } from './rooms';

const NOW = 540;

function makeCatalog(): Room[] {
  return [
    { id: 'a', name: 'Room A', building: 'North', capacity: 8, equipment: ['whiteboard'], blocked: false, bookings: [{ start: 600, end: 660 }] },
    { id: 'b', name: 'Room B', building: 'North', capacity: 12, equipment: ['projector', 'whiteboard'], blocked: false, bookings: [] },
    { id: 'c', name: 'Room C', building: 'South', capacity: 20, equipment: ['projector', 'whiteboard', 'video-conferencing'], blocked: true, bookings: [] },
    { id: 'd', name: 'Room D', building: 'South', capacity: 40, equipment: ['projector'], blocked: false, bookings: [{ start: 720, end: 780 }] },
  ];
}

describe('boundaries through checkRoom', () => {
  test('B1 AC2: exactly 120 minutes (720-840) in room b is available', () => {
    expect(checkRoom(makeCatalog(), 'b', { start: 720, end: 840, now: NOW })).toBe(true);
  });

  test('B2 AC2: 121 minutes (720-841) in room b is rejected', () => {
    expect(checkRoom(makeCatalog(), 'b', { start: 720, end: 841, now: NOW })).toBe(false);
  });

  test('B3 AC4: 660-720 touching the end of room a booking 600-660 is available', () => {
    expect(checkRoom(makeCatalog(), 'a', { start: 660, end: 720, now: NOW })).toBe(true);
  });

  test('B4 AC4: 630-690 overlapping room a booking 600-660 is rejected', () => {
    expect(checkRoom(makeCatalog(), 'a', { start: 630, end: 690, now: NOW })).toBe(false);
  });
});

describe('F3: a blocked room cannot be reported as available', () => {
  test('F3 AC3: room c is blocked, so 720-780, free of any booking, is rejected', () => {
    expect(checkRoom(makeCatalog(), 'c', { start: 720, end: 780, now: NOW })).toBe(false);
  });
});

describe('F5: the result comes from the chosen room, not from another room', () => {
  test('F5: the same times 600-660 are rejected in room a (booked) and available in room b (free)', () => {
    const catalog = makeCatalog();
    const request = { start: 600, end: 660, now: NOW };
    expect(checkRoom(catalog, 'a', request)).toBe(false);
    expect(checkRoom(catalog, 'b', request)).toBe(true);
  });

  test('F5: room d is busy 720-780 but room a is free then, so room a stays available', () => {
    expect(checkRoom(makeCatalog(), 'a', { start: 720, end: 780, now: NOW })).toBe(true);
  });

  test('F5: an unknown room id is not available', () => {
    expect(checkRoom(makeCatalog(), 'zzz', { start: 720, end: 780, now: NOW })).toBe(false);
  });
});

describe('AC5: checking a room changes nothing', () => {
  test('AC5: an available check leaves every room and its bookings equal to a copy taken before', () => {
    const catalog = makeCatalog();
    const before = structuredClone(catalog);
    const result = checkRoom(catalog, 'b', { start: 660, end: 720, now: NOW });
    expect(result).toBe(true);
    expect(catalog).toEqual(before);
  });
});

describe('integration: filter, then check the rooms that were shown', () => {
  test('INT F1 F2 F3 F5: 10 attendees + projector shows b, c, d; at 720-780 only b is available', () => {
    const catalog = makeCatalog();
    const shown = filterRooms(catalog, { attendees: 10, equipment: ['projector'] });
    expect(shown.map((r) => r.id)).toEqual(['b', 'c', 'd']);
    const request = { start: 720, end: 780, now: NOW };
    const available = shown.filter((r) => checkRoom(catalog, r.id, request)).map((r) => r.id);
    // c is blocked (F3), d is booked 720-780 (AC4), b is free.
    expect(available).toEqual(['b']);
  });
});
