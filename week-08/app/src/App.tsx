import { useMemo, useState } from 'react';
import {
  Clock,
  DoorClosed,
  DoorOpen,
  Users,
  CheckCircle2,
  XCircle,
  CalendarClock,
  Building2,
  Ban,
} from 'lucide-react';
import { SAMPLE_ROOMS, Room } from '@/lib/rooms';
import { canBook } from './booking';
import {
  describeDecision,
  formatTime,
  parseTime,
  MAX_BOOKING_MINUTES,
  MINUTES_PER_DAY,
} from '@/lib/availability';

function nowInMinutes(): number {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

export default function App() {
  const [rooms] = useState<Room[]>(SAMPLE_ROOMS);
  const [roomId, setRoomId] = useState<string>(rooms[0].id);
  const [startInput, setStartInput] = useState('');
  const [endInput, setEndInput] = useState('');
  // Current time: the real clock by default, but the user can type one (HH:MM)
  // so the decision can be checked for a fixed "now" (Practice #07, Task 7).
  const [nowInput, setNowInput] = useState<string>(formatTime(nowInMinutes()));
  const now = parseTime(nowInput) ?? nowInMinutes();
  // Rooms the user marks as blocked for this check. Page state only:
  // SAMPLE_ROOMS and the booking data are never changed (AC5).
  const [blockedIds, setBlockedIds] = useState<string[]>([]);

  const selectedRoom = useMemo(
    () => rooms.find((r) => r.id === roomId) ?? rooms[0],
    [rooms, roomId],
  );

  const start = parseTime(startInput);
  const end = parseTime(endInput);

  const blocked = selectedRoom.blocked || blockedIds.includes(selectedRoom.id);

  const decision = useMemo(() => {
    if (start === null || end === null) return null;
    const request = {
      start,
      end,
      now,
      blocked,
      bookings: selectedRoom.bookings,
    };
    // The decision comes from canBook (src/booking.ts); the page only words it.
    const available = canBook(request);
    return describeDecision(available, request);
  }, [selectedRoom, start, end, now, blocked]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <RoomList
            rooms={rooms}
            selectedId={selectedRoom.id}
            onSelect={setRoomId}
            blockedIds={blockedIds}
            now={now}
          />
          <Checker
            room={selectedRoom}
            startInput={startInput}
            endInput={endInput}
            onStart={setStartInput}
            onEnd={setEndInput}
            now={now}
            nowInput={nowInput}
            onNowInput={setNowInput}
            onResetNow={() => setNowInput(formatTime(nowInMinutes()))}
            blocked={blocked}
            fixedBlocked={selectedRoom.blocked}
            onBlocked={(on) =>
              setBlockedIds((ids) =>
                on
                  ? [...ids, selectedRoom.id]
                  : ids.filter((id) => id !== selectedRoom.id),
              )
            }
            decision={decision}
          />
        </div>

        <Rules />
      </main>
    </div>
  );
}

function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
            <CalendarClock className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Smart Campus Room Availability
            </h1>
            <p className="text-sm text-slate-500">
              Check whether a lecture room is free for your requested time.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

function RoomList({
  rooms,
  selectedId,
  onSelect,
  blockedIds,
  now,
}: {
  rooms: Room[];
  selectedId: string;
  onSelect: (id: string) => void;
  blockedIds: string[];
  now: number;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
        Rooms
      </h2>
      <ul className="space-y-2">
        {rooms.map((room) => {
          const active = room.id === selectedId;
          return (
            <li key={room.id}>
              <button
                type="button"
                onClick={() => onSelect(room.id)}
                className={`w-full rounded-xl border p-3 text-left transition ${
                  active
                    ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-slate-900">{room.name}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5" />
                        {room.building}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {room.capacity}
                      </span>
                    </div>
                  </div>
                  {room.blocked || blockedIds.includes(room.id) ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                      <Ban className="h-3 w-3" />
                      Blocked
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                      <DoorOpen className="h-3 w-3" />
                      Open
                    </span>
                  )}
                </div>
                <Timeline room={room} now={now} />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Timeline({ room, now }: { room: Room; now: number }) {
  const pct = (m: number) => `${(m / MINUTES_PER_DAY) * 100}%`;
  return (
    <div className="mt-3">
      <div className="relative h-2 w-full rounded-full bg-slate-100">
        {room.bookings.map((b) => (
          <div
            key={b.id}
            className="absolute top-0 h-2 rounded-full bg-blue-400"
            style={{ left: pct(b.start), width: pct(b.end - b.start) }}
            title={`${formatTime(b.start)}–${formatTime(b.end)} · ${b.bookedBy}`}
          />
        ))}
        <div
          className="absolute top-0 h-2 w-px bg-slate-900"
          style={{ left: pct(now) }}
          title={`Now ${formatTime(now)}`}
        />
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-slate-400">
        <span>00:00</span>
        <span>12:00</span>
        <span>24:00</span>
      </div>
    </div>
  );
}

function Checker({
  room,
  startInput,
  endInput,
  onStart,
  onEnd,
  now,
  nowInput,
  onNowInput,
  onResetNow,
  blocked,
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
  blocked: boolean;
  fixedBlocked: boolean;
  onBlocked: (on: boolean) => void;
  decision: ReturnType<typeof describeDecision> | null;
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
          checked={blocked}
          disabled={fixedBlocked}
          onChange={(e) => onBlocked(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300"
        />
        Treat this room as blocked
      </label>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TimeField
          label="Start (HH:MM)"
          value={startInput}
          onChange={onStart}
          placeholder="13:00"
        />
        <TimeField
          label="End (HH:MM)"
          value={endInput}
          onChange={onEnd}
          placeholder="14:00"
        />
      </div>
      <p className="mt-2 text-xs text-slate-500">
        Max booking length is {MAX_BOOKING_MINUTES} minutes. Intervals must be
        in the future and within 00:00–24:00. Touching endpoints are allowed.
      </p>

      <div className="mt-5">
        {!decision && (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
            Enter a start and end time to see the availability decision.
          </div>
        )}
        {decision && <DecisionCard decision={decision} />}
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
                key={b.id}
                className="flex items-center justify-between px-3 py-2 text-sm"
              >
                <span className="inline-flex items-center gap-2 text-slate-700">
                  <DoorClosed className="h-4 w-4 text-slate-400" />
                  {b.bookedBy}
                </span>
                <span className="font-mono text-xs text-slate-500">
                  {formatTime(b.start)}–{formatTime(b.end)}
                </span>
              </li>
            ))}
          </ul>
        )}
        {blocked && (
          <p className="mt-2 inline-flex items-center gap-1 text-xs text-red-600">
            <Ban className="h-3.5 w-3.5" />
            This room is blocked and cannot be booked.
          </p>
        )}
      </div>
    </section>
  );
}

function TimeField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600">
        {label}
      </span>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

function DecisionCard({
  decision,
}: {
  decision: ReturnType<typeof describeDecision>;
}) {
  const ok = decision.status === 'available';
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border p-4 ${
        ok
          ? 'border-emerald-200 bg-emerald-50'
          : 'border-red-200 bg-red-50'
      }`}
    >
      <div
        className={`mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full ${
          ok ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
        }`}
      >
        {ok ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          <XCircle className="h-4 w-4" />
        )}
      </div>
      <div className="text-sm">
        <p
          className={`font-semibold ${
            ok ? 'text-emerald-800' : 'text-red-800'
          }`}
        >
          {ok ? 'Available' : 'Unavailable'}
        </p>
        <p className={ok ? 'text-emerald-700' : 'text-red-700'}>
          {decision.message}
        </p>
        {!ok && (
          <p className="mt-1 text-xs text-red-600">
            {decision.reason}
          </p>
        )}
      </div>
    </div>
  );
}

function Rules() {
  const items = [
    'Start and end must satisfy 0 < start < end ≤ 1440.',
    'Start must be later than the current time.',
    'Bookings cannot exceed 120 minutes.',
    'Blocked rooms are always unavailable.',
    'Overlaps are rejected; touching endpoints are allowed.',
  ];
  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
        Acceptance rules
      </h2>
      <ul className="grid gap-2 sm:grid-cols-2">
        {items.map((t) => (
          <li key={t} className="inline-flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-blue-600" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
