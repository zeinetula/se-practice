// Filtering logic: which rooms satisfy what the user asked for (F1, F2).

import type { Room } from './rooms';

export interface Criteria {
  attendees: number;
  equipment: string[];
}

// F1: room capacity must be greater than or equal to the requested attendees.
// F2: the room must contain ALL the selected items (not just one of them).
// Blocked rooms are NOT removed here: F3 is decided by checkRoom, and the page labels them.
// Returns a new array in catalog order; the input is never changed.
export function filterRooms(rooms: Room[], criteria: Criteria): Room[] {
  return rooms.filter(
    (room) =>
      room.capacity >= criteria.attendees &&
      criteria.equipment.every((item) => room.equipment.includes(item)),
  );
}
