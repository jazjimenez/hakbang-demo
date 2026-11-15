import { Suspense, useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Building2, FastForward, LayoutGrid, RotateCcw, ShieldCheck, SlidersHorizontal, User, X } from 'lucide-react';
import { useDemo } from '../store';
import { LangToggle, Switch, cx } from '../components/ui';
import type { Role } from '../data/types';
import { Guide, useDemoParams } from './Guide';

export function roleHome(role: Role, profileSaved: boolean) {
  if (role === 'employer') return '/employer/overview';
  if (role === 'admin') return '/admin/verification';
  return profileSaved ? '/matches' : '/signup';
}

export function DemoBanner({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="bg-ink text-white/90 text-[12px] leading-4 px-3 py-1.5 flex items-center justify-center gap-3" role="note">
      <span className="text-center">
        <span className="sm:hidden">Demo prototype. All data is fictional.</span>
        <span className="hidden sm:inline">Demo prototype. All people, companies, and data are fictional.</span>
      </span>
      <button type="button" onClick={onOpen} className="lg:hidden shrink-0 inline-flex items-center gap-1 h-6 px-2 rounded-full bg-white/15 text-white font-semibold focus-ring" aria-label="Open demo controls">
        <SlidersHorizontal size={13} aria-hidden /> Demo
      </button>
    </div>
  );
}

/** Floating presenter controls, bottom-left on every page. */
export function DemoControls({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const nav = useNavigate();
  const { pathname } = useLocation();
  // employer/admin have the org card bottom-left in the sidebar; sit just right of it
  const dash = /^\/(employer|admin)/.test(pathname);
  const s = useDemo();
  const go = (role: Role) => {
    s.setRole(role);
    nav(roleHome(role, s.onboarding.profileSaved));
    setOpen(false);
  };
  const ff = (fn: () => void, to: string, role: Role = 'seeker') => {
    fn();
    s.setRole(role);
    nav(to);
    setOpen(false);
  };
  // phones: opened from the banner, panel drops from the top; desktop: floating bottom-left
  return (
    <div className={cx('fixed z-[70] print:hidden', dash ? 'left-3 lg:left-[264px]' : 'left-3', open ? 'top-9 lg:top-auto lg:bottom-4' : 'hidden lg:block bottom-4')}>
      {open ? (
        <div className="w-[300px] max-w-[calc(100vw-24px)] max-h-[80vh] overflow-auto bg-white rounded-panel shadow-float border border-line p-4 text-ink animate-pop" role="dialog" aria-label="Demo controls">
          <div className="flex items-center justify-between mb-3">
            <span className="text-label uppercase tracking-wide text-muted">Demo controls</span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close demo controls" className="w-8 h-8 rounded-full hover:bg-paper flex items-center justify-center focus-ring">
              <X size={18} />
            </button>
          </div>

          <p className="text-caption text-muted mb-2">Switch role</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {(
              [
                ['seeker', 'Paolo', User],
                ['employer', 'Carla', Building2],
                ['admin', 'Admin', ShieldCheck],
              ] as const
            ).map(([r, l, Icon]) => (
              <button
                key={r}
                type="button"
                onClick={() => go(r)}
                aria-pressed={s.role === r}
                className={cx('rounded-btn border px-2 py-2.5 flex flex-col items-center gap-1 text-caption focus-ring', s.role === r ? 'bg-mint border-green text-green' : 'border-line hover:bg-paper')}
              >
                <Icon size={18} aria-hidden />
                {l}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mb-3">
            <span className="text-body-s">Language (job seeker)</span>
            <LangToggle short />
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-body-s">
              Show Launch features
              <span className="block text-caption text-muted">{s.showLaunch ? 'Pilot + Launch' : 'Pilot only'}</span>
            </span>
            <Switch checked={s.showLaunch} onChange={() => s.setShowLaunch(!s.showLaunch)} label="Show Launch features" />
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-body-s">
              Presenter guide
              <span className="block text-caption text-muted">Step-by-step card for the 5-minute story</span>
            </span>
            <Switch checked={s.guideOn} onChange={() => s.setGuideOn(!s.guideOn)} label="Presenter guide" />
          </div>

          <p className="text-caption text-muted mb-2 flex items-center gap-1.5">
            <FastForward size={14} aria-hidden /> Jump to step
          </p>
          <div className="space-y-1.5 mb-4">
            {(
              [
                ['Paolo applied, Carla accepts', () => s.ffAccept(), '/my-track'],
                ['Paolo passes Module 1 (88%)', () => s.ffPassModule1(), '/my-track'],
                ['Paolo passes all modules', () => s.ffPassAll(), '/my-track'],
                ['Carla marks Paolo hired', () => s.ffHired(), '/hired'],
              ] as const
            ).map(([l, fn, to]) => (
              <button key={l} type="button" onClick={() => ff(fn, to)} className="w-full text-left text-body-s px-3 py-2 rounded-[10px] border border-line hover:bg-paper focus-ring">
                {l}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <Link to="/demo" onClick={() => setOpen(false)} className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-btn border border-line text-label hover:bg-paper focus-ring">
              <LayoutGrid size={16} aria-hidden /> Demo hub
            </Link>
            <button
              type="button"
              onClick={() => {
                if (confirm('Reset all demo data to the starting state?')) {
                  s.reset();
                  nav('/demo');
                  setOpen(false);
                }
              }}
              className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-btn bg-red-tint text-red text-label focus-ring"
            >
              <RotateCcw size={16} aria-hidden /> Reset demo
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 h-10 pl-3 pr-4 rounded-full bg-ink text-white text-label shadow-float hover:bg-black focus-ring"
          aria-label="Open demo controls"
        >
          <SlidersHorizontal size={16} aria-hidden /> Demo
        </button>
      )}
    </div>
  );
}

export default function DemoChrome() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useDemoParams();
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  return (
    <>
      <DemoBanner onOpen={() => setOpen(true)} />
      <Suspense fallback={<div className="min-h-[calc(100vh-28px)] bg-paper" aria-busy="true" />}>
        <Outlet />
      </Suspense>
      <DemoControls open={open} setOpen={setOpen} />
      <Guide />
    </>
  );
}
