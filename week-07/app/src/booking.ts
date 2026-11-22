// The booking decision, extracted from checkAvailability() in src/lib/availability.ts
// (Practice #07, Task 1). The conditions are copied as they were, in the same order.
// start, end, now: minutes after midnight on the same day (600 = 10:00, 1440 = 24:00).

export interface Interval {
  start: number;
  end: number;
}

export interface BookingRequest {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: Interval[];
}

export const MINUTES_PER_DAY = 1440;
export const MAX_BOOKING_MINUTES = 120;

export function canBook({ start, end, now, blocked, bookings }: BookingRequest): boolean {
  // AC1: a valid interval inside the day
  if (!(start > 0 && end > start && end <= MINUTES_PER_DAY)) return false;
  // AC1: start must be after the supplied current time
  if (start <= now) return false;
  // AC2: no longer than 120 minutes
  if (end - start > MAX_BOOKING_MINUTES) return false;
  // AC3: blocked room
  if (blocked) return false;
  // AC4: overlap; touching endpoints are allowed
  if (bookings.some((b) => start < b.end && end > b.start)) return false;
  return true;
}
