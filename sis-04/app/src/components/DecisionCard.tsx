import { CheckCircle2, XCircle } from 'lucide-react';
import type { Decision } from '../lib/messages';

export default function DecisionCard({ decision }: { decision: Decision }) {
  const ok = decision.status === 'available';
  return (
    <div
      role="status"
      className={`flex items-start gap-3 rounded-xl border p-4 ${
        ok ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'
      }`}
    >
      <div
        className={`mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full ${
          ok ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
        }`}
      >
        {ok ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
      </div>
      <div className="text-sm">
        <p className={`font-semibold ${ok ? 'text-emerald-800' : 'text-red-800'}`}>
          {ok ? 'Available' : 'Unavailable'}
        </p>
        <p className={ok ? 'text-emerald-700' : 'text-red-700'}>{decision.message}</p>
        {decision.status === 'unavailable' && (
          <p className="mt-1 text-xs text-red-600">{decision.reason}</p>
        )}
      </div>
    </div>
  );
}
