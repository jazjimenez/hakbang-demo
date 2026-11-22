import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Building2, Compass, RotateCcw, ShieldCheck, User } from 'lucide-react';
import { Logo, Swoosh } from '../components/Brand';
import { Button, LangToggle, LaunchTag, Switch, cx } from '../components/ui';
import { useDemo } from '../store';
import { roleHome } from '../layouts/DemoChrome';
import type { Role } from '../data/types';

const script = [
  ['Paolo', 'Sign up, accept the privacy notice, upload a resume and save the AI-filled profile.'],
  ['Paolo', 'Open the Back Office Associate match and apply (shares the profile with BlueHarbor only).'],
  ['Carla', 'Candidates: accept Paolo. His My Track moves to “In track”.'],
  ['Demo', 'Fast-forward: Paolo passes all modules (Demo controls → Jump to step).'],
  ['Carla', 'Trainees: mark Paolo as hired.'],
  ['Paolo', 'Confirm the signed contract (dual confirmation).'],
  ['Carla', 'Hires & billing: Paolo moves to “Confirmed, ₱2,500”.'],
  ['Admin', 'Verification queue: approve BlueHarbor. Carla’s “Post a track” unlocks.'],
];

export function DemoHub() {
  const nav = useNavigate();
  const s = useDemo();
  const go = (r: Role) => {
    s.setRole(r);
    nav(roleHome(r, s.onboarding.profileSaved));
  };
  const cards: [Role, string, string, typeof User][] = [
    ['seeker', 'I’m a job seeker', 'Paolo Reyes, fresh BSBA grad from Pasig. Mobile-first, works on desktop.', User],
    ['employer', 'I’m an employer', 'Carla Mendoza, BlueHarbor CX. Post tracks, accept trainees, confirm hires.', Building2],
    ['admin', 'I’m Hakbang admin', 'Verification queue for employer documents and safety reports.', ShieldCheck],
  ];
  return (
    <div role="main" className="min-h-[calc(100vh-28px)] bg-deep text-white relative overflow-hidden">
      <Swoosh className="w-[1200px] -right-[240px] top-[80px]" opacity={0.12} />
      <div className="relative max-w-[1100px] mx-auto px-5 py-10 lg:py-14">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" aria-label="Hakbang landing page" className="focus-ring rounded">
            <Logo reversed height={34} />
          </Link>
          <Link to="/" className="text-label text-white/80 hover:text-white focus-ring rounded">
            Landing page
          </Link>
        </div>
        <h1 className="mt-10 font-display font-extrabold text-[48px] leading-[48px] tracking-[-0.04em]">Demo <em className="hk-accent text-lime">hub</em></h1>
        <p className="mt-3 text-body text-white/80 max-w-[640px]">Pick a role to walk through the product. State is shared across roles and saved in this browser, so what Paolo does shows up for Carla and the admin.</p>

        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {cards.map(([r, title, desc, Icon]) => (
            <button
              key={r}
              type="button"
              onClick={() => go(r)}
              className={cx('text-left rounded-panel p-6 bg-cream text-ink border-[1.5px] border-ink shadow-brut-lime hover:-translate-y-1 active:translate-y-0 active:shadow-none transition-all duration-150 focus-ring group', s.role === r && 'ring-2 ring-lime ring-offset-2 ring-offset-deep')}
            >
              <span className="w-12 h-12 rounded-[14px] bg-mint text-green flex items-center justify-center">
                <Icon size={24} aria-hidden />
              </span>
              <span className="block mt-5 text-h-m font-display">{title}</span>
              <span className="block mt-2 text-body-s text-muted">{desc}</span>
              <span className="mt-5 inline-flex items-center gap-1.5 text-label text-green">
                Open <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" aria-hidden />
              </span>
            </button>
          ))}
        </div>

        <div className="mt-6 grid md:grid-cols-[1fr_1.4fr] gap-4">
          <div className="rounded-panel bg-white/10 p-6 space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-title">Language</div>
                <div className="text-caption text-white/70">Job seeker app and landing page</div>
              </div>
              <LangToggle />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-title flex items-center gap-2">
                  Show Launch features <LaunchTag />
                </div>
                <div className="text-caption text-white/70">{s.showLaunch ? 'Pilot + Launch features visible' : 'Pilot-only: Launch screens hidden'}</div>
              </div>
              <Switch checked={s.showLaunch} onChange={() => s.setShowLaunch(!s.showLaunch)} label="Show Launch features" />
            </div>
            <Button
              variant="lime"
              block
              icon={Compass}
              onClick={() => {
                s.reset();
                s.setGuideOn(true);
                s.setRole('seeker');
                nav('/signup');
              }}
            >
              Start pitch demo (fresh data)
            </Button>
            <Button
              variant="onDark"
              block
              icon={Compass}
              onClick={() => {
                s.reset();
                s.setGuideOn(true);
                s.setGuideMode('mvp');
                s.setRole('admin');
                nav('/admin/verification');
              }}
            >
              Start MVP check (fresh data)
            </Button>
            <Button
              variant="onDarkOutline"
              block
              icon={RotateCcw}
              onClick={() => {
                if (confirm('Reset all demo data to the starting state?')) s.reset();
              }}
            >
              Reset demo data
            </Button>
          </div>
          <div className="rounded-panel bg-white/10 p-6">
            <div className="text-title">5-minute presenter script</div>
            <ol className="mt-4 space-y-2.5">
              {script.map(([who, what], i) => (
                <li key={i} className="flex gap-3 text-body-s">
                  <span className="w-6 h-6 rounded-full bg-lime text-deep text-caption font-semibold flex items-center justify-center shrink-0">{i + 1}</span>
                  <span>
                    <span className="font-semibold text-lime">{who}: </span>
                    <span className="text-white/90">{what}</span>
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-caption text-white/60">
              The Demo button switches roles, language, Pilot/Launch, and fast-forwards. Share <span className="font-mono text-lime">#/demo?fresh</span> to give
              someone a clean start, or <span className="font-mono text-lime">#/?fresh&amp;guide</span> to open with the guide on.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
