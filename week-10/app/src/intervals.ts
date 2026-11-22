// Pure interval helpers used by canBook (src/booking.ts). No state, no I/O.
// Times are minutes after midnight.

export interface Interval {
  start: number;
  end: number;
}

// False for a reversed interval and for NaN bounds (every comparison with NaN is false).
export function isWellFormed(i: Interval): boolean {
  return i.start <= i.end;
}

// Two intervals overlap only when they share more than an endpoint (AC4).
export function overlaps(a: Interval, b: Interval): boolean {
  return a.start < b.end && a.end > b.start;
}
