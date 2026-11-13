import { NavLink, Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Home, Route as RouteIcon, User } from 'lucide-react';
import { NavBrand } from '../components/Brand';
import { Avatar, Button, LaunchTag, cx, useIsDesktop } from '../components/ui';
import { useT } from '../i18n';
import { useDemo, usePaolo, usePaoloActiveApp } from '../store';
import type { ReactNode } from 'react';

/** Unread-alert dot: there's something new when Paolo's application has moved. */
function useHasUnread() {
  const read = useDemo((s) => s.readAlerts);
  const app = usePaoloActiveApp();
  return !read || (app && app.status === 'hired-pending-trainee');
}

export function BellButton() {
  const show = useDemo((s) => s.showLaunch);
  const unread = useHasUnread();
  if (!show) return null; // D5: alerts are Launch-only
  return (
    <Link to="/alerts" aria-label="Alerts" className="relative w-11 h-11 rounded-full bg-white border border-line flex items-center justify-center hover:bg-paper focus-ring">
      <Bell size={20} aria-hidden />
      {unread && <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-mango ring-2 ring-white" />}
    </Link>
  );
}

/** Mobile header for the four tab pages: logo + bell. */
export function AppHeader() {
  return (
    <div className="flex items-center justify-between px-5 pt-4 pb-2 lg:hidden">
      <NavBrand to="/matches" size={28} />
      <BellButton />
    </div>
  );
}

function useTabs() {
  const t = useT();
  const show = useDemo((s) => s.showLaunch);
  return [
    { to: '/matches', label: t('tab.matches'), icon: Home },
    { to: '/my-track', label: t('tab.mytrack'), icon: RouteIcon },
    ...(show ? [{ to: '/alerts', label: t('tab.alerts'), icon: Bell }] : []),
    { to: '/profile', label: t('tab.profile'), icon: User },
  ];
}

function BottomTabs() {
  const tabs = useTabs();
  return (
    <nav aria-label="Main" className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-line">
      <ul className="max-w-[480px] mx-auto flex">
        {tabs.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              className={({ isActive }) => cx('flex flex-col items-center gap-1 pt-2.5 pb-3 text-caption focus-ring', isActive ? 'text-green font-semibold' : 'text-muted')}
            >
              <Icon size={22} aria-hidden />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function TopNav() {
  const tabs = useTabs();
  const p = usePaolo();
  return (
    <header className="bg-white border-b border-line sticky top-0 z-30">
      <div className="max-w-[1440px] mx-auto h-[72px] px-8 xl:px-[56px] flex items-center gap-10">
        <NavBrand to="/matches" size={30} />
        <nav aria-label="Main">
          <ul className="flex gap-1">
            {tabs.map(({ to, label }) => (
              <li key={to}>
                <NavLink to={to} className={({ isActive }) => cx('inline-flex items-center h-9 px-4 rounded-full text-label focus-ring', isActive ? 'bg-mint text-green' : 'text-ink hover:bg-paper')}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <BellButton />
          <Link to="/profile" aria-label="Profile" className="rounded-full focus-ring">
            <Avatar initials={p.initials} size={44} />
          </Link>
        </div>
      </div>
    </header>
  );
}

/** Job seeker app shell: bottom tabs on phones, top nav ≥1024px. */
export const TAB_ROOTS = ['/matches', '/my-track', '/alerts', '/profile'];

export default function SeekerShell() {
  const desktop = useIsDesktop();
  const { pathname } = useLocation();
  const tabs = TAB_ROOTS.includes(pathname);
  return desktop ? (
    <div className="min-h-[calc(100vh-28px)] bg-paper">
      <TopNav />
      <main className="max-w-[1200px] mx-auto px-8 py-10">
        <Outlet />
      </main>
    </div>
  ) : (
    <div className={cx('max-w-[480px] mx-auto min-h-[calc(100vh-28px)] bg-paper flex flex-col', tabs && 'pb-[84px]')}>
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      {tabs && <BottomTabs />}
    </div>
  );
}

/** Bare seeker pages (onboarding, hired): no nav. */
export function SeekerBare() {
  return <Outlet />;
}

/** Wrap Launch-only screens. In Pilot-only mode they're hidden behind a note. */
export function LaunchOnly({ children }: { children: ReactNode }) {
  const show = useDemo((s) => s.showLaunch);
  const set = useDemo((s) => s.setShowLaunch);
  const nav = useNavigate();
  if (show) return <>{children}</>;
  return (
    <div className="px-5 py-16 text-center max-w-md mx-auto">
      <LaunchTag />
      <h1 className="text-h-m mt-4">This screen is a Launch feature</h1>
      <p className="text-body text-muted mt-2">The demo is in Pilot-only mode, so Launch features are hidden.</p>
      <div className="mt-6 flex flex-col gap-3">
        <Button onClick={() => set(true)}>Show Launch features</Button>
        <Button variant="secondary" onClick={() => nav('/matches')}>
          Go to Matches
        </Button>
      </div>
    </div>
  );
}

/** Sticky footer bar for mobile primary actions (S02, S03, S06…). */
export function MobileFooter({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('sticky bottom-0 bg-white border-t border-line px-5 pt-4 pb-5 space-y-3 z-10', className)}>{children}</div>;
}
