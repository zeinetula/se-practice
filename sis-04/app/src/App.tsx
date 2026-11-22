import { useMemo, useState } from 'react';
import { ROOMS } from './rooms';
import { checkRoom, whyUnavailable } from './booking';
import { filterRooms } from './filter';
import { describeDecision } from './lib/messages';
import { formatTime, nowInMinutes, parseTime } from './lib/time';
import Checker from './components/Checker';
import FilterPanel from './components/FilterPanel';
import Header from './components/Header';
import RoomList from './components/RoomList';
import Rules from './components/Rules';

// The page: it keeps what the user typed and passes it to the rules modules.
// rooms.ts holds the data, filter.ts the filter (F1, F2), booking.ts the booking rules (AC1-AC5, F3, F5).
export default function App() {
  const [roomId, setRoomId] = useState<string>(ROOMS[0].id);
  const [startInput, setStartInput] = useState('');
  const [endInput, setEndInput] = useState('');
  // Current time: the real clock by default, but the user can type one (HH:MM)
  // so the decision can be checked for a fixed "now" (Practice #07, Task 7).
  const [nowInput, setNowInput] = useState<string>(formatTime(nowInMinutes()));
  const now = parseTime(nowInput) ?? nowInMinutes();
  // Rooms the user marks as blocked for this check. Page state only: ROOMS is never changed (AC5).
  const [blockedIds, setBlockedIds] = useState<string[]>([]);
  // Room filter (F1, F2).
  const [attendeesInput, setAttendeesInput] = useState('');
  const [equipment, setEquipment] = useState<string[]>([]);

  // The catalog as the page sees it: ROOMS with the "treat as blocked" marks applied.
  // This is the one place a blocked mark is combined with the data.
  const catalog = useMemo(
    () => ROOMS.map((r) => (blockedIds.includes(r.id) ? { ...r, blocked: true } : r)),
    [blockedIds],
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
    const request = { start, end, now };
    // checkRoom decides; whyUnavailable only supplies the reason to word when the answer is no.
    const available = checkRoom(catalog, selectedRoom.id, request);
    const rejection = available ? null : whyUnavailable(catalog, selectedRoom.id, request);
    return describeDecision(rejection, request);
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
              total={ROOMS.length}
            />
            <RoomList
              rooms={visibleRooms}
              selectedId={selectedRoom?.id ?? ''}
              onSelect={setRoomId}
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
              fixedBlocked={ROOMS.find((r) => r.id === selectedRoom.id)?.blocked ?? false}
              onBlocked={(on) =>
                setBlockedIds((ids) =>
                  on ? [...ids, selectedRoom.id] : ids.filter((id) => id !== selectedRoom.id),
                )
              }
              decision={decision}
            />
          ) : (
            <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Check availability
              </h2>
              <p className="mt-2">No room is selected. Change the filter to see rooms.</p>
            </section>
          )}
        </div>

        <Rules />
      </main>
    </div>
  );
}
