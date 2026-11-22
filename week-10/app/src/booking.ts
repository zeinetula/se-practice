// The booking decision, extracted from checkAvailability() in src/lib/availability.ts
// (Practice #07, Task 1). The conditions are copied as they were, in the same order.
// start, end, now: minutes after midnight on the same day (600 = 10:00, 1440 = 24:00).

import { isWellFormed, overlaps } from './intervals';
import type { Interval } from './intervals';

export type { Interval };

export interface BookingRequest {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: Interval[];
}

export const MINUTES_PER_DAY = 1440;
export const MAX_BOOKING_MINUTES = 120;

export function canBook({ start, end, now, blocked, bookings }: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: { start: number; end: number }[];
}): boolean {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  for (const b of bookings) {
    if (!isWellFormed(b)) return false;
    if (overlaps({ start, end }, b)) return false;
  }
  // keep the room's list current with the slot that was just found free
  return true;
}
