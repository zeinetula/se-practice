// The booking rules: AC1-AC5 for one room (canBook), and the same rules for a room chosen
// from the catalog (checkRoom, F3, F5). This module is the only place the rules live.
// start, end, now: minutes after midnight on the same day (600 = 10:00, 1440 = 24:00).

import type { Booking, Room } from './rooms';

export interface Interval {
  start: number;
  end: number;
}

export interface BookingRequest<B extends Interval = Interval> {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: B[];
}

// A request for a time slot, before it is joined with a room's own data.
export interface RoomRequest {
  start: number;
  end: number;
  now: number;
}

export const MINUTES_PER_DAY = 1440;
export const MAX_BOOKING_MINUTES = 120;

// The small rules, written once: canBook decides with them and explainRejection names them.
const isValidInterval = (start: number, end: number) =>
  start > 0 && end > start && end <= MINUTES_PER_DAY;
const startsAfter = (start: number, now: number) => start > now;
const isWithinMax = (start: number, end: number, max: number) => end - start <= max;

export function canBook({ start, end, now, blocked, bookings }: BookingRequest): boolean {
  // AC1: a valid interval inside the day, starting after the supplied current time
  if (!isValidInterval(start, end)) return false;
  if (!startsAfter(start, now)) return false;
  // AC2: no longer than 120 minutes
  if (!isWithinMax(start, end, MAX_BOOKING_MINUTES)) return false;
  // AC3: blocked room
  if (blocked) return false;
  // AC4: overlap; touching endpoints are allowed
  if (bookings.some((b) => start < b.end && end > b.start)) return false;
  return true;
}

// B is the booking type the caller uses, so the clash comes back as the caller's own booking
// (with its label, if it has one); the rules only ever read start and end.
export type Rejection<B extends Interval = Interval> =
  | { reason: 'invalid-interval' | 'not-future' | 'too-long' | 'blocked' | 'unknown-room' }
  | { reason: 'overlap'; clash: B };

// Why canBook says no: the first rule that fails, in the order of AC1-AC4, or null when the
// request is allowed. The overlap is found by elimination (canBook said no and the four rules
// above passed), and the clashing booking is the one canBook rejects on its own.
export function explainRejection<B extends Interval>(request: BookingRequest<B>): Rejection<B> | null {
  const { start, end, now, blocked, bookings } = request;
  if (canBook(request)) return null;
  if (!isValidInterval(start, end)) return { reason: 'invalid-interval' };
  if (!startsAfter(start, now)) return { reason: 'not-future' };
  if (!isWithinMax(start, end, MAX_BOOKING_MINUTES)) return { reason: 'too-long' };
  if (blocked) return { reason: 'blocked' };
  const clash = bookings.find((b) => !canBook({ ...request, bookings: [b] })) ?? bookings[0];
  return { reason: 'overlap', clash };
}

// F3, F5: find the chosen room by id and decide with THAT room's blocked flag and bookings.
// An unknown id is not available. Nothing is changed (AC5).
export function checkRoom(rooms: Room[], roomId: string, request: RoomRequest): boolean {
  const room = rooms.find((r) => r.id === roomId);
  if (!room) return false;
  return canBook({ ...request, blocked: room.blocked, bookings: room.bookings });
}

// The same lookup as checkRoom, but it answers with the reason (null when the room is available).
export function whyUnavailable(rooms: Room[], roomId: string, request: RoomRequest): Rejection<Booking> | null {
  const room = rooms.find((r) => r.id === roomId);
  if (!room) return { reason: 'unknown-room' };
  return explainRejection({ ...request, blocked: room.blocked, bookings: room.bookings });
}
