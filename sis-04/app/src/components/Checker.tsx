import { Ban, Clock, DoorClosed } from 'lucide-react';
import { MAX_BOOKING_MINUTES } from '../booking';
import type { Room } from '../rooms';
import { formatRange, formatTime } from '../lib/time';
import type { Decision } from '../lib/messages';
import DecisionCard from './DecisionCard';
import TimeField from './TimeField';

// The availability form for the selected room. It shows the result it is given; it decides nothing.
export default function Checker({
  room,
  startInput,
  endInput,
  onStart,
  onEnd,
  now,
  nowInput,
  onNowInput,
  onResetNow,
  fixedBlocked,
  onBlocked,
  decision,
}: {
  room: Room;
  startInput: string;
  endInput: string;
  onStart: (v: string) => void;
  onEnd: (v: string) => void;
  now: number;
  nowInput: string;
  onNowInput: (v: string) => void;
  onResetNow: () => void;
  fixedBlocked: boolean;
  onBlocked: (on: boolean) => void;
  decision: Decision | null;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Check availability
      </h2>
      <p className="mt-1 text-lg font-medium text-slate-900">{room.name}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-600">
        <Clock className="h-4 w-4" />
        <label htmlFor="now-input">Current time (HH:MM):</label>
        <input
          id="now-input"
          type="text"
          inputMode="numeric"
          value={nowInput}
          onChange={(e) => onNowInput(e.target.value)}
          className="w-20 rounded-md border border-slate-300 px-2 py-0.5 text-sm font-medium text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        />
        <span className="text-xs text-slate-500">using {formatTime(now)}</span>
        <button
          type="button"
          onClick={onResetNow}
          className="ml-1 rounded-md border border-slate-200 px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-50"
        >
          Update now
        </button>
      </div>

      <label className="mt-3 inline-flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={room.blocked}
          disabled={fixedBlocked}
          onChange={(e) => onBlocked(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300"
        />
        Treat this room as blocked
      </label>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TimeField label="Start (HH:MM)" value={startInput} onChange={onStart} placeholder="13:00" />
        <TimeField label="End (HH:MM)" value={endInput} onChange={onEnd} placeholder="14:00" />
      </div>
      <p className="mt-2 text-xs text-slate-500">
        Max booking length is {MAX_BOOKING_MINUTES} minutes. Intervals must be in the future and
        within 00:00–24:00. Touching endpoints are allowed.
      </p>

      <div className="mt-5">
        {decision ? (
          <DecisionCard decision={decision} />
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
            Enter a start and end time to see the availability decision.
          </div>
        )}
      </div>

      <div className="mt-6">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Existing bookings today
        </h3>
        {room.bookings.length === 0 ? (
          <p className="text-sm text-slate-500">No bookings recorded.</p>
        ) : (
          <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200">
            {room.bookings.map((b) => (
              <li
                key={b.id ?? `${b.start}-${b.end}`}
                className="flex items-center justify-between px-3 py-2 text-sm"
              >
                <span className="inline-flex items-center gap-2 text-slate-700">
                  <DoorClosed className="h-4 w-4 text-slate-400" />
                  {b.bookedBy ?? 'Booked'}
                </span>
                <span className="font-mono text-xs text-slate-500">
                  {formatRange(b.start, b.end)}
                </span>
              </li>
            ))}
          </ul>
        )}
        {room.blocked && (
          <p className="mt-2 inline-flex items-center gap-1 text-xs text-red-600">
            <Ban className="h-3.5 w-3.5" />
            This room is blocked and cannot be booked.
          </p>
        )}
      </div>
    </section>
  );
}
