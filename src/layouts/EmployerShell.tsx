import { NavLink, Outlet } from 'react-router-dom';
import { BookOpen, Building2, Flag, LayoutGrid, ReceiptText, Route as RouteIcon, ShieldCheck, Users, type LucideIcon } from 'lucide-react';
import { NavBrand } from '../components/Brand';
import { cx } from '../components/ui';
import { useEmployer } from '../store';
import { BLUEHARBOR_ID } from '../data/seed';

interface Item {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

function Sidebar({ items, footer, home }: { items: Item[]; footer: React.ReactNode; home: string }) {
  return (
    <aside className="bg-deep text-white lg:w-[248px] lg:shrink-0 lg:min-h-[calc(100vh-28px)] lg:sticky lg:top-0 lg:h-[calc(100vh-28px)] flex lg:flex-col">
      <div className="px-6 pt-6 pb-6 hidden lg:block">
        <NavBrand to={home} reversed size={30} />
      </div>
      <nav aria-label="Dashboard" className="flex-1 overflow-x-auto no-scrollbar">
        <ul className="flex lg:flex-col gap-1 px-3 py-2 lg:py-0">
          {items.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  cx('flex items-center gap-3 h-11 px-3.5 rounded-btn text-label whitespace-nowrap focus-ring', isActive ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/5 hover:text-white')
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={20} className={isActive ? 'text-lime' : ''} aria-hidden />
                    {label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-3 hidden lg:block">{footer}</div>
    </aside>
  );
}

function SmallScreenNote() {
  return <p className="lg:hidden bg-mango-tint text-mango-ink text-body-s px-4 py-2.5">Best viewed on a laptop. The dashboard is stacked on small screens.</p>;
}

function OrgFooter({ initials, name, status, statusTone }: { initials: string; name: string; status: string; statusTone: 'lime' | 'mango' }) {
  return (
    <div className="flex items-center gap-3 rounded-btn bg-white/10 px-3 py-3">
      <span className="w-9 h-9 rounded-[10px] bg-green flex items-center justify-center text-caption font-semibold">{initials}</span>
      <div className="min-w-0">
        <div className="text-label truncate">{name}</div>
        <div className={cx('text-caption', statusTone === 'lime' ? 'text-[#86D37A]' : 'text-[#F5B86A]')}>{status}</div>
      </div>
    </div>
  );
}

export default function EmployerShell() {
  const bh = useEmployer(BLUEHARBOR_ID)!;
  const items: Item[] = [
    { to: '/employer/overview', label: 'Overview', icon: LayoutGrid },
    { to: '/employer/tracks/new', label: 'Tracks', icon: BookOpen },
    { to: '/employer/candidates', label: 'Candidates', icon: Users },
    { to: '/employer/trainees', label: 'Trainees', icon: RouteIcon },
    { to: '/employer/billing', label: 'Hires & billing', icon: ReceiptText },
    { to: '/employer/verify', label: 'Company profile', icon: Building2 },
  ];
  return (
    <div className="lg:flex bg-paper min-h-[calc(100vh-28px)]">
      <Sidebar
        home="/employer/overview"
        items={items}
        footer={<OrgFooter initials={bh.initials} name={bh.name} status={bh.verified ? 'Verified employer' : 'Verification pending'} statusTone={bh.verified ? 'lime' : 'mango'} />}
      />
      <div className="flex-1 min-w-0">
        <SmallScreenNote />
        <main className="px-5 py-8 lg:px-10 lg:py-8 max-w-[1192px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function AdminShell() {
  const items: Item[] = [
    { to: '/admin/verification', label: 'Verification queue', icon: ShieldCheck },
    { to: '/admin/reports', label: 'Reports', icon: Flag },
    { to: '/admin/employers', label: 'Employers', icon: Building2 },
    { to: '/admin/tracks', label: 'Tracks', icon: BookOpen },
  ];
  return (
    <div className="lg:flex bg-paper min-h-[calc(100vh-28px)]">
      <Sidebar home="/admin/verification" items={items} footer={<OrgFooter initials="HK" name="Hakbang admin" status="Operations" statusTone="lime" />} />
      <div className="flex-1 min-w-0">
        <SmallScreenNote />
        <main className="px-5 py-8 lg:px-10 lg:py-10 max-w-[1192px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

/** Page header used across employer/admin screens. */
export function PageHead({ title, sub, actions }: { title: string; sub?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-h-l">{title}</h1>
        {sub && <p className="text-body-s text-muted mt-1">{sub}</p>}
      </div>
      {actions && <div className="flex gap-3 flex-wrap">{actions}</div>}
    </div>
  );
}
