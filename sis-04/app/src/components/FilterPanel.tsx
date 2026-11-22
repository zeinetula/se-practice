// The room filter form (F1, F2). It only collects the user's choices; filterRooms applies them.

import { EQUIPMENT } from '../rooms';

export default function FilterPanel({
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
