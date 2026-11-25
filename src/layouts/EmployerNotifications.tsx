import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Award, Bell, Check, ReceiptText, Route as RouteIcon, ShieldAlert, ShieldCheck, UserPlus, type LucideIcon } from 'lucide-react';
import { IconTile, cx } from '../components/ui';
import { useDemo, type EmployerNote, type EmployerNoteKind } from '../store';

const KIND: Record<EmployerNoteKind, [LucideIcon, 'mint' | 'mango']> = {
  applied: [UserPlus, 'mint'],
  course: [Award, 'mint'],
  passed: [Check, 'mint'],
  confirmed: [ReceiptText, 'mint'],
  verified: [ShieldCheck, 'mint'],
  held: [ShieldAlert, 'mango'],
  'track-live': [RouteIcon, 'mint'],
  'at-risk': [AlertCircle, 'mango'],
};

const EMPTY: EmployerNote[] = [];

function ago(at: number, now: number) {
  const m = Math.max(0, Math.round((now - at) / 60_000));
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

/** Bell + dropdown feed for the employer dashboard. New items arrive from store actions (applications, results, hires, verification). */
export function EmployerNotifications({ employerId }: { employerId: string }) {
  const nav = useNavigate();
  const all = useDemo((s) => s.employerNotes ?? EMPTY);
  const markAll = useDemo((s) => s.markEmployerNotesRead);
  const readOne = useDemo((s) => s.readEmployerNote);
  const notes = all.filter((n) => n.employerId === employerId);
  const unread = notes.filter((n) => !n.read).length;
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const wrap = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    setNow(Date.now());
    const onDown = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        btn.current?.focus();
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={wrap} className="relative">
      <button
        ref={btn}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'}
        className="relative w-11 h-11 rounded-btn bg-white border border-line flex items-center justify-center text-ink hover:bg-paper focus-ring"
      >
        <Bell size={20} aria-hidden />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-green text-white text-[11px] font-semibold flex items-center justify-center" aria-hidden>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>
      <span className="sr-only" aria-live="polite">
        {unread ? `${unread} unread notifications` : ''}
      </span>
      {open && (
        <div role="dialog" aria-label="Notifications" className="absolute right-0 top-[52px] z-40 w-[min(380px,calc(100vw-40px))] bg-white border border-line rounded-card shadow-float overflow-hidden animate-pop">
          <div className="flex items-center justify-between px-4 py-3 border-b border-line">
            <h2 className="text-title">Notifications</h2>
            <button type="button" disabled={!unread} onClick={() => markAll(employerId)} className="text-label text-green disabled:text-muted focus-ring rounded">
              Mark all read
            </button>
          </div>
          {notes.length === 0 ? (
            <p className="px-4 py-8 text-center text-body-s text-muted">Nothing yet. You’ll hear here when candidates apply, pass, or accept an offer.</p>
          ) : (
            <ul className="max-h-[420px] overflow-auto overscroll-contain divide-y divide-line">
              {notes.map((n) => {
                const [Icon, tone] = KIND[n.kind];
                return (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => {
                        readOne(n.id);
                        setOpen(false);
                        nav(n.to);
                      }}
                      className="w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-paper focus-ring"
                    >
                      <IconTile icon={Icon} tone={tone} size={36} />
                      <span className="flex-1 min-w-0">
                        <span className={cx('block text-body-s text-ink', !n.read && 'font-semibold')}>{n.title}</span>
                        {n.sub && <span className="block text-caption text-muted">{n.sub}</span>}
                        <span className="block mt-0.5 text-caption text-muted">{ago(n.at, now)}</span>
                      </span>
                      {!n.read && <span className="mt-2 w-2 h-2 rounded-full bg-green shrink-0" aria-label="unread" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
