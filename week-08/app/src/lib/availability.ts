import { Booking } from './rooms';
import { MINUTES_PER_DAY, MAX_BOOKING_MINUTES } from '../booking';

export { MINUTES_PER_DAY, MAX_BOOKING_MINUTES };


export type Decision =
  | { status: 'available'; message: string }
  | { status: 'unavailable'; message: string; reason: string };

export interface CheckInput {
  start: number;
  end: number;
  now: number; // current time in minutes from midnight
  blocked: boolean;
  bookings: Booking[];
}

// The decision itself is made by canBook() in src/booking.ts and passed in as
// `available`. This function only writes the message the page shows, so the
// wording from Week 06 is kept. It never changes the bookings (AC5).
export function describeDecision(
  available: boolean,
  { start, end, now, blocked, bookings }: CheckInput,
): Decision {
  const duration = end - start;
  if (available) {
    return {
      status: 'available',
      message: `Available for ${duration} min (${formatTime(start)}–${formatTime(end)}).`,
    };
  }
  if (!(start > 0 && end > start && end <= MINUTES_PER_DAY)) {
    return {
      status: 'unavailable',
      message: 'Interval is not valid.',
      reason:
        'Times must satisfy 0 < start < end, and end cannot exceed 24:00 (1440 min).',
    };
  }
  if (start <= now) {
    return {
      status: 'unavailable',
      message: 'Start time is not in the future.',
      reason: `The start time must be later than the current time (${formatTime(now)}).`,
    };
  }
  if (duration > MAX_BOOKING_MINUTES) {
    return {
      status: 'unavailable',
      message: 'Booking is too long.',
      reason: `Maximum booking length is ${MAX_BOOKING_MINUTES} minutes; you requested ${duration}.`,
    };
  }
  if (blocked) {
    return {
      status: 'unavailable',
      message: 'Room is blocked.',
      reason: 'This room is currently blocked and cannot be booked.',
    };
  }
  const clash = bookings.find((b) => start < b.end && end > b.start);
  if (clash) {
    return {
      status: 'unavailable',
      message: 'Interval overlaps an existing booking.',
      reason: `Conflicts with ${clash.bookedBy} (${formatTime(clash.start)}–${formatTime(clash.end)}). Touching endpoints are allowed.`,
    };
  }
  return {
    status: 'unavailable',
    message: 'Unavailable.',
    reason: 'The request does not meet the booking rules.',
  };
}

export function formatTime(minutes: number): string {
  const m = Math.max(0, Math.min(MINUTES_PER_DAY, Math.round(minutes)));
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

// Parse HH:MM string into minutes from midnight. Returns null when invalid.
export function parseTime(value: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return h * 60 + m;
}
