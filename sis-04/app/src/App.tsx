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
  SearchX,
} from 'lucide-react';
import { ROOMS, EQUIPMENT, Room } from './rooms';
import { checkRoom } from './booking';
import { filterRooms } from './filter';
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
  const [rooms] = useState<Room[]>(ROOMS);
  const [roomId, setRoomId] = useState<string>(rooms[0].id);
  const [startInput, setStartInput] = useState('');
  const [endInput, setEndInput] = useState('');
  // Current time: the real clock by default, but the user can type one (HH:MM)
  // so the decision can be checked for a fixed "now" (Practice #07, Task 7).
  const [nowInput, setNowInput] = useState<string>(formatTime(nowInMinutes()));
  const now = parseTime(nowInput) ?? nowInMinutes();
  // Rooms the user marks as blocked for this check. Page state only:
  // ROOMS and the booking data are never changed (AC5).
  const [blockedIds, setBlockedIds] = useState<string[]>([]);
  // Room filter (F1, F2).
  const [attendeesInput, setAttendeesInput] = useState('');
  const [equipment, setEquipment] = useState<string[]>([]);

  // The catalog as the page sees it: ROOMS with the "treat as blocked" marks applied.
  const catalog = useMemo(
    () => rooms.map((r) => (blockedIds.includes(r.id) ? { ...r, blocked: true } : r)),
    [rooms, blockedIds],
  );

  const visibleRooms = useMemo(
    () => filterRooms(catalog, { attendees: Number(attendeesInput) || 0, equipment }),
    [catalog, attendeesInput, equipment],
  );

  // F5: the result is derived from the selected room on every render, so changing
  // the room (or the filter that hides it) always refreshes it.
  const selectedRoom = visibleRooms.find((r) => r.id === roomId) ?? visibleRooms[0] ?? null;

  const start = parseTime(startInput);
  const end = parseTime(endInput);

  const decision = useMemo(() => {
    if (!selectedRoom || start === null || end === null) return null;
    const request = {
      start,
      end,
      now,
      blocked: selectedRoom.blocked,
      bookings: selectedRoom.bookings,
    };
    // The decision comes from checkRoom (src/booking.ts); the page only words it.
    const available = checkRoom(catalog, selectedRoom.id, { start, end, now });
    return describeDecision(available, request);
  }, [catalog, selectedRoom, start, end, now]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-4">
            <FilterPanel
              attendeesInput={attendeesInput}
              onAttendees={setAttendeesInput}
              equipment={equipment}
              onEquipment={setEquipment}
              shown={visibleRooms.length}
              total={rooms.length}
            />
            <RoomList
              rooms={visibleRooms}
              selectedId={selectedRoom?.id ?? ''}
              onSelect={setRoomId}
              blockedIds={blockedIds}
              now={now}
            />
          </div>
          {selectedRoom ? (
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
              blocked={selectedRoom.blocked}
              fixedBlocked={rooms.find((r) => r.id === selectedRoom.id)?.blocked ?? false}
              onBlocked={(on) =>
                setBlockedIds((ids) =>
                  on
                    ? [...ids, selectedRoom.id]
                    : ids.filter((id) => id !== selectedRoom.id),
                )
              }
              decision={decision}
            />
          ) : (
            <NoRoomSelected />
          )}
        </div>

        <Rules />
      </main>
    </div>
  );
}

function FilterPanel({
  attendeesInput,
  onAttendees,
  equipment,
  onEquipment,
  shown,
  total,
}: {
  attendeesInput: string;
  onAttendees: (v: string) => void;
  equipment: string[];
  onEquipment: (items: string[]) => void;
  shown: number;
  total: number;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
        Find a room
      </h2>
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-slate-600">
          Attendees (minimum capacity)
        </span>
        <input
          type="number"
          min={0}
          inputMode="numeric"
          value={attendeesInput}
          placeholder="e.g. 10"
          onChange={(e) => onAttendees(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        />
      </label>
      <fieldset className="mt-3">
        <legend className="mb-1 text-xs font-medium text-slate-600">
          Required equipment (the room must have all selected)
        </legend>
        <div className="flex flex-wrap gap-2">
          {EQUIPMENT.map((item) => {
            const on = equipment.includes(item);
            return (
              <label
                key={item}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${
                  on
                    ? 'border-blue-600 bg-blue-50 text-blue-800'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <input
                  type="checkbox"
                  checked={on}
                  onChange={(e) =>
                    onEquipment(
                      e.target.checked
                        ? [...equipment, item]
                        : equipment.filter((x) => x !== item),
                    )
                  }
                  className="h-3.5 w-3.5"
                />
                {item}
              </label>
            );
          })}
        </div>
      </fieldset>
      <p className="mt-3 text-xs text-slate-500" aria-live="polite">
        Showing {shown} of {total} rooms.
      </p>
    </section>
  );
}

function NoRoomSelected() {
  return (
    <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Check availability
      </h2>
      <p className="mt-2">No room is selected. Change the filter to see rooms.</p>
    </section>
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
      {rooms.length === 0 && (
        <div
          role="status"
          className="flex items-start gap-2 rounded-xl border border-dashed border-amber-300 bg-amber-50 p-4 text-sm text-amber-800"
        >
          <SearchX className="mt-0.5 h-4 w-4 flex-none" />
          <span>No rooms match. Lower the number of attendees or remove some equipment.</span>
        </div>
      )}
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
                    <p className="mt-1 text-xs text-slate-500">
                      {room.equipment.join(', ')}
                    </p>
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
            key={b.id ?? `${b.start}-${b.end}`}
            className="absolute top-0 h-2 rounded-full bg-blue-400"
            style={{ left: pct(b.start), width: pct(b.end - b.start) }}
            title={`${formatTime(b.start)}–${formatTime(b.end)} · ${b.bookedBy ?? 'Booked'}`}
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
                key={b.id ?? `${b.start}-${b.end}`}
                className="flex items-center justify-between px-3 py-2 text-sm"
              >
                <span className="inline-flex items-center gap-2 text-slate-700">
                  <DoorClosed className="h-4 w-4 text-slate-400" />
                  {b.bookedBy ?? 'Booked'}
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
