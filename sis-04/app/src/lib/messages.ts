// The wording of an availability result. It maps a Rejection (decided in src/booking.ts) to the
// text the page shows. It decides nothing and compares nothing: the rules live in booking.ts.

import { MAX_BOOKING_MINUTES } from '../booking';
import type { Rejection } from '../booking';
import type { Booking } from '../rooms';
import { formatRange, formatTime } from './time';

export type Decision =
  | { status: 'available'; message: string }
  | { status: 'unavailable'; message: string; reason: string };

export function describeDecision(
  rejection: Rejection<Booking> | null,
  { start, end, now }: { start: number; end: number; now: number },
): Decision {
  const duration = end - start;
  if (rejection === null) {
    return {
      status: 'available',
      message: `Available for ${duration} min (${formatRange(start, end)}).`,
    };
  }
  switch (rejection.reason) {
    case 'invalid-interval':
      return {
        status: 'unavailable',
        message: 'Interval is not valid.',
        reason: 'Times must satisfy 0 < start < end, and end cannot exceed 24:00 (1440 min).',
      };
    case 'not-future':
      return {
        status: 'unavailable',
        message: 'Start time is not in the future.',
        reason: `The start time must be later than the current time (${formatTime(now)}).`,
      };
    case 'too-long':
      return {
        status: 'unavailable',
        message: 'Booking is too long.',
        reason: `Maximum booking length is ${MAX_BOOKING_MINUTES} minutes; you requested ${duration}.`,
      };
    case 'blocked':
      return {
        status: 'unavailable',
        message: 'Room is blocked.',
        reason: 'This room is currently blocked and cannot be booked.',
      };
    case 'overlap':
      return {
        status: 'unavailable',
        message: 'Interval overlaps an existing booking.',
        reason: `Conflicts with ${rejection.clash.bookedBy ?? 'another booking'} (${formatRange(rejection.clash.start, rejection.clash.end)}). Touching endpoints are allowed.`,
      };
    case 'unknown-room':
      return {
        status: 'unavailable',
        message: 'Room not found.',
        reason: 'The selected room is not in the catalog.',
      };
  }
}
