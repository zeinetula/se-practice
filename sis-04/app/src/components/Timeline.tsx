import { MINUTES_PER_DAY } from '../booking';
import type { Room } from '../rooms';
import { formatRange, formatTime } from '../lib/time';

export default function Timeline({ room, now }: { room: Room; now: number }) {
  const pct = (m: number) => `${(m / MINUTES_PER_DAY) * 100}%`;
  return (
    <div className="mt-3">
      <div className="relative h-2 w-full rounded-full bg-slate-100">
        {room.bookings.map((b) => (
          <div
            key={b.id ?? `${b.start}-${b.end}`}
            className="absolute top-0 h-2 rounded-full bg-blue-400"
            style={{ left: pct(b.start), width: pct(b.end - b.start) }}
            title={`${formatRange(b.start, b.end)} · ${b.bookedBy ?? 'Booked'}`}
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
