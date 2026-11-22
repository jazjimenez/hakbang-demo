import { useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Check, ChevronRight, Clock, FileText, Hourglass, MessageSquare, PartyPopper, Route as RouteIcon, ShieldCheck, Star } from 'lucide-react';
import { AppHeader } from '../../layouts/SeekerShell';
import { MobileFooter } from '../../layouts/SeekerShell';
import { Swoosh } from '../../components/Brand';
import { Trail, type TrailStep } from '../../components/Trail';
import { Button, IconTile, LaunchTag, Radio, Toast, TopBar, cx, useIsDesktop } from '../../components/ui';
import { EN_NUMBERS, FIL_ORDINALS, useT } from '../../i18n';
import { isPassed, trailFor, useDemo, useEmployer, usePaolo, usePaoloActiveApp, useTrack } from '../../store';
import type { Application, Track } from '../../data/types';

/* ---------------- helpers ---------------- */

function useTrailSteps(app: Application, track: Track, short?: boolean): TrailStep[] {
  const t = useT();
  const raw = trailFor(app);
  const m = (id: 'm1' | 'm2') => track.modules.find((x) => x.id === id)!;
  const modSub = (id: 'm1' | 'm2', state: string) => {
    const sc = app.scores[id];
    if (typeof sc === 'number' && isPassed(sc)) return t('trail.passed', { n: sc });
    if (sc === 'retake' || (typeof sc === 'number' && !isPassed(sc))) return t('trail.retake');
    if (state === 'current') return short ? t('trail.currentShort') : t('trail.current');
    return undefined;
  };
  return raw.map(({ key, state }) => {
    switch (key) {
      case 'applied':
        return { key, state, label: t('trail.applied'), sub: app.appliedAt };
      case 'accepted':
        return { key, state, label: short ? t('trail.acceptedShort') : t('trail.accepted'), sub: app.acceptedAt };
      case 'm1':
      case 'm2': {
        const n = key === 'm1' ? 1 : 2;
        return { key, state, label: short ? `Module ${n}` : `Module ${n}: ${m(key).title}`, sub: modSub(key, state) };
      }
      case 'f2f':
        return { key, state, label: short ? t('trail.f2fShort') : t('trail.f2f'), sub: state === 'done' ? t('mytrack.passedBadge') : 'May 1' + (short ? '' : ', ' + track.locationShort) };
      case 'decision':
        return { key, state, label: t('trail.decision') };
      default:
        return { key, state, label: short ? t('trail.contractShort') : t('trail.contract') };
    }
  });
}

function StatusBadge({ app }: { app: Application }) {
  const t = useT();
  const map: Record<Application['status'], [string, 'green' | 'mint' | 'mango' | 'grey' | 'red']> = {
    applied: [t('mytrack.waiting'), 'mango'],
    accepted: [t('mytrack.inTrack'), 'green'],
    'in-track': [t('mytrack.inTrack'), 'green'],
    passed: [t('mytrack.passedBadge'), 'green'],
    'hired-pending-trainee': [t('mytrack.hired'), 'green'],
    'hired-confirmed': [t('mytrack.hired'), 'green'],
    declined: [t('mytrack.declinedBadge'), 'grey'],
  };
  const [l, tone] = map[app.status];
  return (
    <span className={cx('inline-flex items-center gap-1.5 rounded-full px-3 h-7 text-caption', tone === 'green' ? 'bg-green text-white' : tone === 'mango' ? 'bg-mango-tint text-mango-ink' : 'bg-paper border border-line text-muted')}>
      <RouteIcon size={14} aria-hidden />
      {l}
    </span>
  );
}

function NowCard({ app, track }: { app: Application; track: Track }) {
  const t = useT();
  const emp = useEmployer(track.employerId)!;
  const card = (tone: 'mango' | 'mint' | 'green' | 'grey', icon: ReactNode, title: string, sub?: string, action?: ReactNode) => (
    <div
      className={cx(
        'rounded-card px-4 py-4 flex items-center gap-3.5',
        tone === 'mango' && 'bg-mango-tint',
        tone === 'mint' && 'bg-mint',
        tone === 'green' && 'bg-green text-white',
        tone === 'grey' && 'bg-white border border-line',
      )}
    >
      <span className={cx('w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0', tone === 'green' ? 'bg-white/15' : 'bg-white')}>{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-title">{title}</div>
        {sub && <div className={cx('text-body-s', tone === 'green' ? 'text-white/85' : 'text-muted')}>{sub}</div>}
      </div>
      {action}
    </div>
  );
  switch (app.status) {
    case 'applied':
      return card('mango', <Hourglass size={22} className="text-mango" aria-hidden />, t('mytrack.waitTitle', { emp: emp.name }), t('mytrack.waitD'));
    case 'declined':
      return card('grey', <RouteIcon size={22} className="text-muted" aria-hidden />, t('mytrack.declinedTitle'), t('mytrack.declinedD'), <Button size="sm" variant="secondary" to="/matches">{t('mytrack.seeMatches')}</Button>);
    case 'passed':
      return card('mint', <Check size={22} className="text-green" aria-hidden />, t('mytrack.passedTitle'), t('mytrack.passedD', { emp: emp.name }));
    case 'hired-pending-trainee':
      return card('green', <PartyPopper size={22} aria-hidden />, t('mytrack.hiredTitle'), undefined, <Button size="sm" variant="onDark" to="/hired">{t('mytrack.goHired')}</Button>);
    case 'hired-confirmed':
      return card('mint', <Star size={22} className="text-green" aria-hidden />, t('mytrack.confirmedTitle', { date: 'May 17' }));
    default: {
      const n = !isPassed(app.scores.m1) ? 1 : !isPassed(app.scores.m2) ? 2 : 0;
      if (n === 0) return card('mango', <Clock size={22} className="text-mango" aria-hidden />, t('mytrack.f2fCard'), t('mytrack.f2fCardD'));
      const due = track.modules[n - 1].due;
      return card('mango', <Clock size={22} className="text-mango" aria-hidden />, t('mytrack.deadline', { n }), t('mytrack.deadlineD', { date: due }));
    }
  }
}

function EndorseRow({ app, desktop }: { app: Application; desktop?: boolean }) {
  const t = useT();
  const show = useDemo((s) => s.showLaunch);
  if (!show) return null;
  return (
    <Link to="/endorsements" className="flex items-center gap-3 bg-cream border-[1.5px] border-ink rounded-card shadow-brut-sm px-4 py-3.5 hover:border-green focus-ring">
      {desktop ? <IconTile icon={Star} size={36} /> : <Star size={20} className="text-green" aria-hidden />}
      <span className="flex-1 text-label text-green">
        {t('mytrack.endorsements')}
        {app.endorsements.length > 0 && <span className="ml-2 text-muted font-normal">({app.endorsements.length})</span>}
      </span>
      <LaunchTag />
    </Link>
  );
}

function EmptyTrack() {
  const t = useT();
  return (
    <div className="text-center py-14 px-6 bg-cream border-[1.5px] border-ink rounded-card shadow-brut-sm">
      <span className="mx-auto w-14 h-14 rounded-full bg-mint text-green flex items-center justify-center">
        <RouteIcon size={26} aria-hidden />
      </span>
      <h1 className="mt-4 text-h-m">{t('mytrack.empty')}</h1>
      <p className="mt-2 text-body text-muted">{t('mytrack.emptyD')}</p>
      <Button className="mt-6" to="/matches">
        {t('mytrack.seeMatches')}
      </Button>
    </div>
  );
}

/* ---------------- S08 / D05 My Track ---------------- */

export function MyTrack() {
  const desktop = useIsDesktop();
  const app = usePaoloActiveApp();
  const track = useTrack(app?.trackId);
  if (!app || !track)
    return desktop ? (
      <EmptyTrack />
    ) : (
      <>
        <AppHeader />
        <div className="px-5 pt-3">
          <EmptyTrack />
        </div>
      </>
    );
  return desktop ? <MyTrackDesktop app={app} track={track} /> : <MyTrackMobile app={app} track={track} />;
}

function MyTrackMobile({ app, track }: { app: Application; track: Track }) {
  const emp = useEmployer(track.employerId)!;
  const steps = useTrailSteps(app, track);
  return (
    <>
      <AppHeader />
      <div className="px-5 pt-3 pb-6 space-y-4">
        <div>
          <div className="flex items-center gap-2.5">
            <StatusBadge app={app} />
            <span className="text-body-s text-muted">{emp.name}</span>
          </div>
          <h1 className="mt-3 text-h-l">{track.title}</h1>
        </div>
        <NowCard app={app} track={track} />
        <div className="bg-cream border-[1.5px] border-ink rounded-card shadow-brut-sm p-5">
          <Trail steps={steps} />
        </div>
        <EndorseRow app={app} />
      </div>
    </>
  );
}

function MyTrackDesktop({ app, track }: { app: Application; track: Track }) {
  const t = useT();
  const lang = useDemo((s) => s.lang);
  const emp = useEmployer(track.employerId)!;
  const steps = useTrailSteps(app, track, true);
  const cur = steps.findIndex((s) => s.state === 'current');
  const idx = cur === -1 ? steps.length - 1 : cur;
  const accepted = !['applied', 'declined'].includes(app.status);
  const modRow = (id: 'm1' | 'm2' | 'm3', i: number) => {
    const m = track.modules[i];
    const sc = id === 'm3' ? (app.f2f === 'passed' ? 100 : undefined) : app.scores[id];
    const done = typeof sc === 'number' && isPassed(sc);
    let right = t('mytrack.notYet');
    if (done) right = id === 'm3' ? t('mytrack.passedBadge') : t('trail.passed', { n: sc as number });
    else if (id === 'm3') right = t('mytrack.f2fPlace');
    else if (accepted && (sc === 'in-progress' || (id === 'm2' && isPassed(app.scores.m1)) || (id === 'm1' && !sc))) right = t('mytrack.inProgressDue', { date: m.due });
    else if (sc === 'retake') right = t('trail.retake');
    return (
      <li key={id} className="flex items-center gap-3.5 py-3.5">
        <IconTile icon={done ? Check : FileText} size={32} tone={done ? 'mint' : 'mint'} className={done ? '' : '!bg-paper !text-muted'} />
        <span className="flex-1 text-label">
          Module {i + 1}: {m.title}
        </span>
        <span className={cx('text-body-s', done ? 'text-green' : 'text-muted')}>{right}</span>
      </li>
    );
  };
  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-3">
          <StatusBadge app={app} />
          <span className="text-body-s text-muted">
            {emp.name}, {track.title}
          </span>
        </div>
        <h1 className="mt-4 text-display">{lang === 'fil' ? t('mytrack.step', { ord: FIL_ORDINALS[idx] }) : t('mytrack.step', { n: EN_NUMBERS[idx] })}</h1>
      </div>
      <div className="bg-cream border-[1.5px] border-ink rounded-panel shadow-brut px-6 py-7">
        <Trail orientation="horizontal" steps={steps} size={26} />
      </div>
      <div className="grid grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px] gap-5 items-start">
        <div className="space-y-4">
          <NowCard app={app} track={track} />
          <section className="bg-cream border-[1.5px] border-ink rounded-card shadow-brut-sm px-5 pt-4 pb-1">
            <h2 className="text-h-s">{t('mytrack.modules')}</h2>
            <ul className="divide-y divide-line">{(['m1', 'm2', 'm3'] as const).map(modRow)}</ul>
          </section>
        </div>
        <div className="space-y-4">
          <div className="rounded-card border border-green bg-mint p-4">
            <div className="flex items-center gap-2 text-h-s font-display text-green">
              <ShieldCheck size={20} aria-hidden /> {t('track.commitment')}
            </div>
            <p className="mt-2 text-body-s">{t('mytrack.commitment', { emp: emp.name })}</p>
          </div>
          <EndorseRow app={app} desktop />
        </div>
      </div>
    </div>
  );
}

/* ---------------- S09 / D06 Hired ---------------- */

export function Hired() {
  const t = useT();
  const nav = useNavigate();
  const p = usePaolo();
  const app = usePaoloActiveApp();
  const track = useTrack(app?.trackId);
  const emp = useEmployer(track?.employerId);
  const hire = useDemo((s) => s.hires.find((h) => h.applicationId === app?.id));
  const confirm = useDemo((s) => s.confirmHire);
  const status = app?.status;
  const date = hire?.startDate ?? 'May 17';

  let body: ReactNode;
  if (status === 'hired-pending-trainee' && emp && track) {
    body = (
      <>
        <div className="flex-1 flex flex-col items-center text-center pt-10">
          <span className="w-[104px] h-[104px] rounded-full bg-lime text-deep flex items-center justify-center">
            <Check size={52} strokeWidth={2.4} aria-hidden />
          </span>
          <h1 className="mt-8 font-display font-extrabold text-display lg:text-[44px] lg:leading-[48px]">{t('hired.title', { name: p.firstName })}</h1>
          <p className="mt-4 text-body text-white/85 max-w-[420px]">{t('hired.sub', { emp: emp.name, role: hire?.position ?? track.shortTitle, date })}</p>
          <div className="mt-6 w-full bg-white text-ink rounded-card p-5 text-left max-w-[420px]">
            <div className="text-h-s font-display">{t('hired.last')}</div>
            <p className="mt-1 text-body-s text-muted">{t('hired.lastD')}</p>
          </div>
        </div>
        <div className="mt-10 space-y-3 w-full max-w-[420px] mx-auto">
          <Button variant="onDark" block onClick={() => confirm(app!.id)} data-guide="confirm-hire">
            {t('hired.yes')}
          </Button>
          <Button variant="onDarkOutline" block onClick={() => nav('/report?about=hire')}>
            {t('hired.no')}
          </Button>
        </div>
      </>
    );
  } else if (status === 'hired-confirmed' && emp) {
    body = (
      <>
        <div className="flex-1 flex flex-col items-center text-center pt-10">
          <span className="w-[104px] h-[104px] rounded-full bg-lime text-deep flex items-center justify-center">
            <Star size={48} aria-hidden />
          </span>
          <h1 className="mt-8 font-display font-extrabold text-display lg:text-[44px] lg:leading-[48px]">{t('hired.doneTitle', { name: p.firstName })}</h1>
          <p className="mt-4 text-body text-white/85 max-w-[420px]">{t('hired.doneD', { emp: emp.name, date })}</p>
        </div>
        <div className="mt-10 w-full max-w-[420px] mx-auto">
          <Button variant="onDark" block to="/my-track">
            {t('hired.toTrack')}
          </Button>
        </div>
      </>
    );
  } else {
    body = (
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <span className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
          <Hourglass size={36} aria-hidden />
        </span>
        <h1 className="mt-6 text-h-l">{t('hired.notYetTitle')}</h1>
        <Button className="mt-8" variant="onDark" to="/my-track">
          {t('hired.toTrack')}
        </Button>
      </div>
    );
  }
  return (
    <div role="main" className="relative min-h-[calc(100vh-28px)] bg-deep text-white overflow-hidden">
      <Swoosh className="w-[900px] -left-[260px] bottom-[-120px]" opacity={0.2} />
      <div className="relative max-w-[480px] lg:max-w-[640px] mx-auto px-5 pt-6 pb-10 min-h-[calc(100vh-28px)] flex flex-col">{body}</div>
    </div>
  );
}

/* ---------------- S10 Alerts (Launch) ---------------- */

export function Alerts() {
  const t = useT();
  const app = usePaoloActiveApp();
  const markRead = useDemo((s) => s.markAlertsRead);
  const desktop = useIsDesktop();
  useEffect(() => {
    markRead();
  }, [markRead]);

  type A = { icon: typeof Bell; tone: 'mango' | 'mint'; title: string; sub?: string; when: string; unread?: boolean; to?: string };
  const today: A[] = [];
  const earlier: A[] = [];
  if (app) {
    if (app.status === 'hired-pending-trainee') today.push({ icon: Star, tone: 'mint', title: t('alerts.hired', { emp: 'BlueHarbor CX' }), sub: t('alerts.hiredD'), when: 'now', unread: true, to: '/hired' });
    if (app.status === 'in-track' && isPassed(app.scores.m1) && !isPassed(app.scores.m2))
      today.push({ icon: Clock, tone: 'mango', title: t('alerts.m2Tomorrow'), sub: t('alerts.need80'), when: '1h', unread: true, to: '/my-track' });
    if (typeof app.scores.m2 === 'number' && isPassed(app.scores.m2)) today.push({ icon: Check, tone: 'mint', title: t('alerts.passedM', { n: 2 }), sub: t('alerts.score', { n: app.scores.m2 }), when: 'Apr 24', unread: true, to: '/my-track' });
    if (typeof app.scores.m1 === 'number' && isPassed(app.scores.m1)) today.push({ icon: Check, tone: 'mint', title: t('alerts.passedM', { n: 1 }), sub: t('alerts.score', { n: app.scores.m1 }), when: 'Apr 17', unread: true, to: '/my-track' });
    if (app.acceptedAt) earlier.push({ icon: RouteIcon, tone: 'mint', title: t('alerts.accepted'), sub: 'BlueHarbor CX', when: app.acceptedAt, to: '/my-track' });
    earlier.push({ icon: Check, tone: 'mint', title: t('alerts.applied'), sub: 'BlueHarbor CX', when: app.appliedAt, to: '/my-track' });
  }
  earlier.push({ icon: Star, tone: 'mint', title: t('alerts.newMatch'), sub: t('alerts.newMatchD'), when: 'Apr 7', to: '/matches' });

  const Row = ({ a }: { a: A }) => (
    <li>
      <Link to={a.to ?? '#'} className="flex items-center gap-3.5 py-3.5 focus-ring rounded">
        <IconTile icon={a.icon} tone={a.tone} size={44} />
        <div className="flex-1 min-w-0">
          <div className={cx('text-body', a.unread && 'font-semibold')}>{a.title}</div>
          {a.sub && <div className="text-body-s text-muted">{a.sub}</div>}
        </div>
        <div className="flex flex-col items-end gap-2 self-start pt-1">
          <span className="text-caption text-muted">{a.when}</span>
          {a.unread && <span className="w-2 h-2 rounded-full bg-green" aria-label="unread" />}
        </div>
      </Link>
    </li>
  );
  return (
    <>
      <AppHeader />
      <div className={cx('px-5 pt-3 pb-6', desktop && 'max-w-[640px] px-0')}>
        <div className="flex items-center gap-3">
          <h1 className="text-h-l lg:text-display">{t('alerts.title')}</h1>
          <LaunchTag />
        </div>
        {today.length > 0 && (
          <>
            <h2 className="mt-4 text-label text-muted font-sans">{t('alerts.today')}</h2>
            <ul className="divide-y divide-line">
              {today.map((a, i) => (
                <Row key={i} a={a} />
              ))}
            </ul>
          </>
        )}
        <h2 className="mt-4 text-label text-muted font-sans">{t('alerts.earlier')}</h2>
        <ul className="divide-y divide-line border-b border-line">
          {earlier.map((a, i) => (
            <Row key={i} a={a} />
          ))}
        </ul>
        <Link to="/reminders" className="mt-5 flex items-center gap-3.5 bg-cream border-[1.5px] border-ink rounded-card shadow-brut-sm p-4 hover:border-green focus-ring">
          <IconTile icon={Bell} size={40} />
          <div className="flex-1">
            <div className="text-title">{t('alerts.howRemind')}</div>
            <div className="text-body-s text-muted">{t('alerts.channels')}</div>
          </div>
          <ChevronRight size={20} className="text-muted" aria-hidden />
        </Link>
      </div>
    </>
  );
}

/* ---------------- S12 Report ---------------- */

export function Report() {
  const t = useT();
  const nav = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const submit = useDemo((s) => s.submitReport);
  const [reason, setReason] = useState(params.get('about') === 'hire' ? 'report.wrong' : 'report.money');
  const [details, setDetails] = useState('');
  const [sent, setSent] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const opts = [
    ['report.money', 'report.moneyD'],
    ['report.wrong'],
    ['report.harass'],
    ['report.other'],
  ] as const;

  if (sent)
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 lg:max-w-[560px] lg:mx-auto">
        <IconTile icon={ShieldCheck} size={72} />
        <h1 className="mt-6 text-h-l">{t('report.sentTitle')}</h1>
        <p className="mt-3 text-body text-muted">{t('report.sentD')}</p>
        <Button className="mt-8" onClick={() => nav(-1)}>
          {t('report.done')}
        </Button>
      </div>
    );

  return (
    <div className="flex-1 flex flex-col lg:max-w-[640px] lg:mx-auto lg:w-full">
      <TopBar title={t('report.title')} back={-1} />
      <div className="px-5 pb-6 flex-1">
        <h1 className="mt-1 text-h-l">{t('report.what')}</h1>
        <fieldset className="mt-4 space-y-3">
          <legend className="sr-only">{t('report.what')}</legend>
          {opts.map(([k, d]) => (
            <label key={k} className={cx('flex items-center gap-3.5 rounded-[16px] border px-4 py-4 cursor-pointer', reason === k ? 'bg-mint border-green' : 'bg-white border-line')}>
              <input type="radio" name="reason" value={k} checked={reason === k} onChange={() => setReason(k)} className="sr-only peer" />
              <Radio checked={reason === k} />
              <span>
                <span className="block text-body font-semibold">{t(k)}</span>
                {d && <span className="block text-caption text-muted">{t(d)}</span>}
              </span>
            </label>
          ))}
        </fieldset>
        <label className="sr-only" htmlFor="report-details">
          {t('report.tell')}
        </label>
        <textarea
          id="report-details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder={t('report.tell')}
          rows={4}
          className="mt-3 w-full rounded-[16px] border border-line bg-white p-4 text-body focus:border-green"
        />
        <p className="mt-3 flex items-center gap-2.5 bg-mint rounded-[14px] px-4 py-3 text-body-s">
          <ShieldCheck size={18} className="text-green" aria-hidden />
          {t('report.review48')}
        </p>
      </div>
      <MobileFooter className="lg:static lg:border-0 lg:bg-transparent">
        <Button
          block
          onClick={() => {
            submit({ reason: t(reason), details, at: 'Apr 22', trackId: params.get('track') ?? undefined });
            setSent(true);
          }}
        >
          {t('report.submit')}
        </Button>
        <button type="button" className="w-full flex items-center justify-center gap-2 text-label text-green py-1 focus-ring rounded" onClick={() => nav('/support')}>
          <MessageSquare size={17} aria-hidden /> {t('report.chat')}
        </button>
      </MobileFooter>
      <Toast message={toast} onDone={() => setToast(null)} />
    </div>
  );
}

