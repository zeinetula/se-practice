import { CheckCircle2 } from 'lucide-react';

const ITEMS = [
  'Start and end must satisfy 0 < start < end ≤ 1440.',
  'Start must be later than the current time.',
  'Bookings cannot exceed 120 minutes.',
  'Blocked rooms are always unavailable.',
  'Overlaps are rejected; touching endpoints are allowed.',
  'Rooms shown have at least the requested capacity and all the selected equipment.',
];

export default function Rules() {
  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
        Acceptance rules
      </h2>
      <ul className="grid gap-2 sm:grid-cols-2">
        {ITEMS.map((t) => (
          <li key={t} className="inline-flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-blue-600" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
