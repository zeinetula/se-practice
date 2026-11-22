// Tests for filterRooms (src/filter.ts): F1 capacity, F2 equipment, F4 empty result, B5/B6 boundaries.
// The catalog is fixed inside this file, not the page's ROOMS, so a change to the demo data cannot
// change a result. Expected values come from F1-F5 in the SIS #04 README (section 5), never from
// what filterRooms returns.
//   room a: capacity 8,  whiteboard
//   room b: capacity 12, projector + whiteboard
//   room c: capacity 20, projector + whiteboard + video-conferencing (blocked)
//   room d: capacity 40, projector

import { describe, expect, test } from 'vitest';
import { filterRooms } from './filter';
import type { Room } from './rooms';

function makeCatalog(): Room[] {
  return [
    { id: 'a', name: 'Room A', building: 'North', capacity: 8, equipment: ['whiteboard'], blocked: false, bookings: [] },
    { id: 'b', name: 'Room B', building: 'North', capacity: 12, equipment: ['projector', 'whiteboard'], blocked: false, bookings: [] },
    { id: 'c', name: 'Room C', building: 'South', capacity: 20, equipment: ['projector', 'whiteboard', 'video-conferencing'], blocked: true, bookings: [] },
    { id: 'd', name: 'Room D', building: 'South', capacity: 40, equipment: ['projector'], blocked: false, bookings: [] },
  ];
}

const ids = (rooms: Room[]) => rooms.map((r) => r.id);

describe('F1: capacity must be greater than or equal to the attendees', () => {
  test('F1: 9 attendees keeps the rooms with capacity 12, 20 and 40, and drops the 8-seat room', () => {
    expect(ids(filterRooms(makeCatalog(), { attendees: 9, equipment: [] }))).toEqual(['b', 'c', 'd']);
  });

  test('B5 F1: capacity exactly equal to the attendees (12 and 12) includes the room', () => {
    const result = filterRooms(makeCatalog(), { attendees: 12, equipment: [] });
    expect(ids(result)).toContain('b');
  });

  test('B6 F1: capacity one below the attendees (12 seats, 13 attendees) excludes the room', () => {
    const result = filterRooms(makeCatalog(), { attendees: 13, equipment: [] });
    expect(ids(result)).not.toContain('b');
  });
});

describe('F2: the room must contain ALL selected items', () => {
  test('F2: projector + whiteboard keeps only the rooms that have both, not the rooms that have either', () => {
    // a has no projector, d has no whiteboard: "any" would keep them, "all" must not.
    expect(ids(filterRooms(makeCatalog(), { attendees: 1, equipment: ['projector', 'whiteboard'] }))).toEqual(['b', 'c']);
  });

  test('F2: one selected item keeps every room that has it', () => {
    expect(ids(filterRooms(makeCatalog(), { attendees: 1, equipment: ['projector'] }))).toEqual(['b', 'c', 'd']);
  });

  test('F2: no selected equipment applies only the capacity rule', () => {
    expect(ids(filterRooms(makeCatalog(), { attendees: 20, equipment: [] }))).toEqual(['c', 'd']);
  });

  test('F1 F2: capacity and equipment are both required (20 attendees + whiteboard leaves only room c)', () => {
    expect(ids(filterRooms(makeCatalog(), { attendees: 20, equipment: ['whiteboard'] }))).toEqual(['c']);
  });
});

describe('F4: nothing matches', () => {
  test('F4 F1: 50 attendees matches no room and returns an empty list', () => {
    expect(filterRooms(makeCatalog(), { attendees: 50, equipment: [] })).toEqual([]);
  });

  test('F4 F2: an item no room has returns an empty list', () => {
    expect(filterRooms(makeCatalog(), { attendees: 1, equipment: ['lab-bench'] })).toEqual([]);
  });
});

describe('filterRooms does not change its input', () => {
  test('AC5 F1: filtering leaves the catalog equal to a copy taken before the call', () => {
    const catalog = makeCatalog();
    const before = structuredClone(catalog);
    filterRooms(catalog, { attendees: 15, equipment: ['projector'] });
    expect(catalog).toEqual(before);
  });
});
