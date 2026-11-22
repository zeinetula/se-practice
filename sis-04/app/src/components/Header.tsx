import { CalendarClock } from 'lucide-react';

export default function Header() {
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
