import { Ban, Building2, DoorOpen, SearchX, Users } from 'lucide-react';
import type { Room } from '../rooms';
import Timeline from './Timeline';

// The rooms that passed the filter. A blocked room stays in the list with a "Blocked" label;
// whether it can be booked is decided by checkRoom (F3), not here.
export default function RoomList({
  rooms,
  selectedId,
  onSelect,
  now,
}: {
  rooms: Room[];
  selectedId: string;
  onSelect: (id: string) => void;
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
                aria-pressed={active}
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
                    <p className="mt-1 text-xs text-slate-500">{room.equipment.join(', ')}</p>
                  </div>
                  {room.blocked ? (
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
