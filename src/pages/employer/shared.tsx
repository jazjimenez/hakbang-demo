import { useState, type ReactNode } from 'react';
import { AlertCircle, Check, ShieldCheck, Users } from 'lucide-react';
import { Avatar, Card, Toast, cx } from '../../components/ui';
import { isPassed, useDemo } from '../../store';
import { MAIN_TRACK_ID } from '../../data/seed';
import type { Application, JobSeeker, Score } from '../../data/types';

/* ---------------- shared helpers ---------------- */

export type Row = { app: Application; seeker: JobSeeker };

export function useTrackRows(trackId = MAIN_TRACK_ID): Row[] {
  const apps = useDemo((s) => s.applications);
  const seekers = useDemo((s) => s.seekers);
  return apps.filter((a) => a.trackId === trackId).map((app) => ({ app, seeker: seekers.find((x) => x.id === app.seekerId)! }));
}

export const atRisk = (a: Application) => a.status === 'in-track' && (a.scores.m1 === 'retake' || a.scores.m2 === 'retake' || (typeof a.scores.m1 === 'number' && !isPassed(a.scores.m1)));
export const inCohort = (a: Application) => ['in-track', 'passed', 'hired-pending-trainee', 'hired-confirmed', 'accepted'].includes(a.status) && a.acceptedAt?.startsWith('Apr');

export function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  return { msg, show: setMsg, el: <Toast message={msg} onDone={() => setMsg(null)} /> };
}

export function Th({ children, className }: { children?: ReactNode; className?: string }) {
  return <th className={cx('text-left text-caption text-muted font-medium px-4 py-3 whitespace-nowrap', className)}>{children}</th>;
}
export function Td({ children, className }: { children?: ReactNode; className?: string }) {
  return <td className={cx('px-4 py-3.5 text-body-s align-middle', className)}>{children}</td>;
}
export function Table({ children, minWidth = 880 }: { children: ReactNode; minWidth?: number }) {
  return (
    <div className="bg-cream border-[1.5px] border-ink rounded-card shadow-brut-sm overflow-x-auto">
      <table className="w-full border-collapse" style={{ minWidth }}>
        {children}
      </table>
    </div>
  );
}

export function Tabs<T extends string>({ value, onChange, tabs }: { value: T; onChange: (v: T) => void; tabs: [T, string][] }) {
  return (
    <div role="tablist" className="flex gap-2 mb-5 overflow-x-auto no-scrollbar">
      {tabs.map(([v, l]) => (
        <button
          key={v}
          role="tab"
          type="button"
          aria-selected={value === v}
          onClick={() => onChange(v)}
          className={cx('h-9 px-4 rounded-full text-label whitespace-nowrap focus-ring', value === v ? 'bg-deep text-white' : 'bg-white border border-line text-ink hover:bg-paper')}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export function Person({ seeker, sub }: { seeker: JobSeeker; sub?: string }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar initials={seeker.initials} size={34} />
      <div>
        <div className="text-label whitespace-nowrap">{seeker.name}</div>
        {sub && <div className="text-caption text-muted">{sub}</div>}
      </div>
    </div>
  );
}

export function Note({ icon: Icon, children }: { icon: typeof ShieldCheck; children: ReactNode }) {
  return (
    <p className="mt-5 flex items-center gap-3 bg-mint rounded-[14px] px-4 py-3 text-body-s">
      <Icon size={18} className="text-green shrink-0" aria-hidden />
      {children}
    </p>
  );
}

export function Kpi({ label, value, sub, icon: Icon }: { label: string; value: string; sub: string; icon: typeof Users }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between text-body-s text-muted">
        {label}
        <Icon size={18} className="text-green" aria-hidden />
      </div>
      <div className="mt-2 font-display text-stat">{value}</div>
      <div className="mt-1 text-caption text-muted">{sub}</div>
    </Card>
  );
}

export const scoreCell = (s: Score | undefined) => {
  if (s === undefined) return <span className="text-muted">Not started</span>;
  if (s === 'in-progress') return <span className="text-muted">In progress</span>;
  if (s === 'retake') return <span className="text-muted">Retake due</span>;
  return isPassed(s) ? (
    <span className="inline-flex items-center gap-1.5">
      <Check size={16} className="text-green" aria-hidden /> {s}%
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5">
      <AlertCircle size={16} className="text-mango" aria-hidden /> {s}%
    </span>
  );
};
