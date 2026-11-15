import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Award, Bell, Check, ChevronRight, Clock, Flag, GraduationCap, MapPin, Route as RouteIcon, Sparkles, Star } from 'lucide-react';
import { AppHeader, MobileFooter } from '../../layouts/SeekerShell';
import { Avatar, Button, Chip, IconTile, LangToggle, LaunchTag, ProgressBar, Radio, ScoreRing, Switch, TopBar, VerifiedBadge, cx, useIsDesktop } from '../../components/ui';
import { useT } from '../../i18n';
import { isPassed, useCourseSkills, useDemo, useEmployer, usePaolo, usePaoloActiveApp, useTrack } from '../../store';
import { courseById } from '../../data/courses';
import { PAOLO_ID } from '../../data/seed';

/* ---------------- S11 / D07 Profile ---------------- */

function TrackRow() {
  const t = useT();
  const app = usePaoloActiveApp();
  const track = useTrack(app?.trackId);
  const emp = useEmployer(track?.employerId);
  let sub = t('profile.noTrack');
  if (app && track) {
    if (app.status === 'applied') sub = t('profile.waiting');
    else if (app.status === 'hired-pending-trainee' || app.status === 'hired-confirmed') sub = t('profile.hiredAt', { date: 'May 17' });
    else if (app.status === 'passed') sub = t('mytrack.passedBadge');
    else if (app.status === 'declined') sub = t('mytrack.declinedBadge');
    else sub = t('profile.inProgress', { n: !isPassed(app.scores.m1) ? 1 : !isPassed(app.scores.m2) ? 2 : 3 });
  }
  return (
    <Link to={app ? '/my-track' : '/matches'} className="flex items-center gap-3.5 bg-cream border-[1.5px] border-ink rounded-card shadow-brut-sm p-4 hover:border-green focus-ring">
      <IconTile icon={RouteIcon} size={44} />
      <div className="min-w-0">
        <div className="text-title">{track && emp ? `${track.shortTitle}, ${emp.name}` : t('tab.mytrack')}</div>
        <div className="text-caption text-muted">{sub}</div>
      </div>
    </Link>
  );
}

function Visibility() {
  const t = useT();
  const p = usePaolo();
  const update = useDemo((s) => s.updateSeeker);
  const opts = [
    ['applied-only', t('profile.appliedOnly'), t('profile.default')],
    ['all-verified', t('profile.allVerified'), t('profile.allVerifiedD')],
  ] as const;
  return (
    <fieldset>
      <legend className="text-h-s font-display">{t('profile.who')}</legend>
      <div className="mt-3 space-y-3">
        {opts.map(([v, l, d]) => (
          <label key={v} className={cx('flex items-center gap-3.5 rounded-[16px] border px-4 py-3.5 cursor-pointer', p.visibility === v ? 'bg-mint border-green' : 'bg-white border-line')}>
            <input type="radio" name="visibility" className="sr-only" checked={p.visibility === v} onChange={() => update(PAOLO_ID, { visibility: v })} />
            <Radio checked={p.visibility === v} />
            <span>
              <span className="block text-body font-semibold">{l}</span>
              <span className="block text-caption text-muted">{d}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function Profile() {
  const t = useT();
  const desktop = useIsDesktop();
  const p = usePaolo();
  const update = useDemo((s) => s.updateSeeker);
  const show = useDemo((s) => s.showLaunch);
  const records = useDemo((s) => s.courseRecords);
  const courseSkills = useCourseSkills();
  const markSeen = useDemo((s) => s.markSeen);
  useEffect(() => {
    if (records.length) markSeen('profileCourses');
  }, [records.length, markSeen]);
  const endorsements = useDemo((s) => s.applications.filter((a) => a.seekerId === PAOLO_ID).flatMap((a) => a.endorsements));

  const header = (
    <div className="flex items-center gap-4">
      <Avatar initials={p.initials} size={desktop ? 80 : 64} />
      <div className="min-w-0">
        <h1 className="text-h-l">{p.name}</h1>
        <div className="text-body-s text-muted">
          {p.course}, {p.school} {p.gradYear}
        </div>
        <div className="mt-0.5 text-body-s text-muted flex items-center gap-1">
          <MapPin size={14} aria-hidden /> {p.city}
        </div>
      </div>
    </div>
  );
  const completeness = (
    <div className="bg-cream border-[1.5px] border-ink rounded-card shadow-brut-sm px-4 py-3.5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-label">{t('profile.complete', { n: p.profileCompleteness })}</span>
        {p.profileCompleteness < 100 ? (
          <button type="button" onClick={() => update(PAOLO_ID, { profileCompleteness: 100 })} className="text-label text-green focus-ring rounded">
            {t('profile.addIntro')}
          </button>
        ) : (
          <span className="text-caption text-green flex items-center gap-1">
            <Check size={14} aria-hidden /> {t('profile.introSaved')}
          </span>
        )}
      </div>
      <ProgressBar className="mt-2.5" value={p.profileCompleteness / 100} height={8} label={t('profile.complete', { n: p.profileCompleteness })} />
    </div>
  );
  const lang = (
    <div className="flex items-center justify-between">
      <span className="text-body">{t('profile.lang')}</span>
      <LangToggle />
    </div>
  );
  const skills = (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-h-s font-display">{t('review.skills')}</h2>
        {show && (
          <Link to="/skill-plan" className="inline-flex items-center gap-1 text-label text-green focus-ring rounded">
            <Sparkles size={15} aria-hidden /> {t('profile.getReady')}
          </Link>
        )}
      </div>
      <ul className="mt-3 flex flex-wrap gap-2">
        {p.skills.map((s) =>
          courseSkills.includes(s) ? (
            <li key={s}>
              <span className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full text-label bg-mint text-green border-[1.5px] border-green" title={t('profile.verifiedSkill')}>
                <Award size={14} aria-label={t('profile.verifiedSkill')} /> {s}
              </span>
            </li>
          ) : (
            <li key={s}>
              <Chip>{s}</Chip>
            </li>
          ),
        )}
      </ul>
    </div>
  );
  const certs = (
    <section aria-labelledby="certs-h" className="bg-cream border-[1.5px] border-ink rounded-card shadow-brut-sm p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 id="certs-h" className="text-h-s font-display">
          {t('profile.certs')}
        </h2>
        <Link to="/learn" className="inline-flex items-center gap-1 text-label text-green focus-ring rounded">
          <GraduationCap size={15} aria-hidden /> {t('profile.browseCourses')}
        </Link>
      </div>
      {records.length === 0 ? (
        <p className="mt-2 text-body-s text-muted">{t('profile.certsEmpty')}</p>
      ) : (
        <>
          <ul className="mt-3 space-y-2.5" data-testid="certificates">
            {records.map((r) => {
              const c = courseById(r.courseId)!;
              return (
                <li key={r.courseId}>
                  <Link to={`/learn/${c.id}`} className="flex items-center gap-3 rounded-[14px] bg-paper border border-ink/15 px-3.5 py-3 hover:border-ink focus-ring">
                    <span className="w-9 h-9 rounded-full bg-lime border-[1.5px] border-ink flex items-center justify-center shrink-0">
                      <Award size={17} className="text-deep" aria-hidden />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-label truncate" lang="en">
                        {c.title}
                      </span>
                      <span className="block text-caption text-muted">
                        {c.providerName} · {r.completedAt} · {r.score}%
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-caption text-muted">{t('profile.employersSee')}</p>
        </>
      )}
    </section>
  );
  const launchRows = show && (
    <>
      <Link to="/resume-review" className="flex items-center gap-3 rounded-card border border-green bg-mint px-4 py-4 hover:bg-[#dcefe0] focus-ring">
        <Sparkles size={20} className="text-green" aria-hidden />
        <span className="flex-1 text-title text-green">{t('profile.resumeScore')}</span>
        <ChevronRight size={20} className="text-green" aria-hidden />
      </Link>
      <Link to="/endorsements" className="flex items-center gap-3.5 bg-cream border-[1.5px] border-ink rounded-card shadow-brut-sm p-4 hover:border-green focus-ring">
        <IconTile icon={Star} size={44} />
        <span className="flex-1 text-title">
          Verified Endorsements
          {endorsements.length > 0 && <span className="block text-caption text-muted font-normal">{t('profile.endorseCount', { n: endorsements.length })}</span>}
        </span>
        <LaunchTag />
      </Link>
      <Link to="/reminders" className="flex items-center gap-3.5 bg-cream border-[1.5px] border-ink rounded-card shadow-brut-sm p-4 hover:border-green focus-ring">
        <IconTile icon={Bell} size={44} />
        <span className="flex-1 text-title">{t('profile.reminders')}</span>
        <LaunchTag />
      </Link>
    </>
  );
  const report = (
    <Link to="/report" className="flex items-center gap-2 text-label text-red focus-ring rounded py-1">
      <Flag size={17} aria-hidden /> {t('profile.report')}
    </Link>
  );

  if (desktop)
    return (
      <div className="grid grid-cols-[1fr_400px] gap-6 items-start">
        <div className="space-y-5">
          <div className="bg-cream border-[1.5px] border-ink rounded-panel shadow-brut p-6 space-y-5">
            {header}
            {completeness}
            {skills}
        {certs}
            {certs}
          </div>
          <div className="bg-cream border-[1.5px] border-ink rounded-panel shadow-brut p-6">
            <Visibility />
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-cream border-[1.5px] border-ink rounded-card shadow-brut-sm px-4 py-3.5">{lang}</div>
          <TrackRow />
          {launchRows}
          {report}
        </div>
      </div>
    );

  return (
    <>
      <AppHeader />
      <div className="px-5 pt-3 pb-8 space-y-4">
        {header}
        {completeness}
        {lang}
        {skills}
        <TrackRow />
        {launchRows}
        <div className="pt-2">
          <Visibility />
        </div>
        {report}
      </div>
    </>
  );
}

/* ---------------- S15 Endorsements (Launch) ---------------- */

export function Endorsements() {
  const t = useT();
  const items = useDemo((s) =>
    s.applications
      .filter((a) => a.seekerId === PAOLO_ID)
      .flatMap((a) => a.endorsements.map((e) => ({ e, track: s.tracks.find((x) => x.id === a.trackId)!, emp: s.employers.find((x) => x.id === s.tracks.find((y) => y.id === a.trackId)!.employerId)! }))),
  );
  return (
    <div className="flex-1 lg:max-w-[640px] lg:mx-auto lg:w-full">
      <TopBar title={t('endorse.title')} back={-1} tag={<LaunchTag />} />
      <div className="px-5 pb-8">
        <h1 className="mt-1 text-h-l">{t('endorse.count', { n: items.length })}</h1>
        <p className="mt-2 text-body-s text-muted">{t('endorse.sub')}</p>
        {items.length === 0 ? (
          <div className="mt-6 bg-white border border-dashed border-line rounded-card p-6 text-center">
            <IconTile icon={Star} size={52} className="mx-auto" />
            <div className="mt-3 text-title">{t('endorse.empty')}</div>
            <p className="mt-1.5 text-body-s text-muted">{t('endorse.emptyD')}</p>
          </div>
        ) : (
          <ul className="mt-5 space-y-3.5">
            {items.map(({ e, track, emp }) => {
              const m = track.modules.find((x) => x.id === e.moduleId)!;
              return (
                <li key={e.id} className="bg-white border-2 border-lime rounded-card p-4">
                  <div className="flex gap-3">
                    <IconTile icon={Star} tone="lime" size={30} className="!rounded-full" />
                    <div>
                      <div className="text-title">
                        Module {track.modules.indexOf(m) + 1}: {m.title}
                      </div>
                      <div className="text-caption text-muted">
                        {emp.name}, {e.date}
                      </div>
                    </div>
                  </div>
                  {e.note && <p className="mt-3 text-body">“{e.note}”</p>}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {e.skills.map((s) => (
                      <Chip key={s}>{s}</Chip>
                    ))}
                  </div>
                  <VerifiedBadge className="mt-3" />
                </li>
              );
            })}
            <li>
              <Link to="/tracks/data-entry" className="flex items-center gap-3.5 bg-mint rounded-card p-4 hover:bg-[#dcefe0] focus-ring">
                <IconTile icon={Sparkles} tone="white" size={44} />
                <div className="flex-1">
                  <div className="text-caption text-muted">{t('endorse.because')}</div>
                  <div className="text-title text-green">{t('endorse.suggest')}</div>
                </div>
                <ChevronRight size={20} className="text-green" aria-hidden />
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}

/* ---------------- S16 Reminders (Launch) ---------------- */

export function Reminders() {
  const t = useT();
  const r = useDemo((s) => s.reminders);
  const toggle = useDemo((s) => s.toggleReminder);
  const p = usePaolo();
  const Row = ({ k, label, sub }: { k: keyof typeof r; label: string; sub?: string }) => (
    <li className="flex items-center gap-3 py-3.5">
      <div className="flex-1 min-w-0">
        <div className="text-body font-semibold">{label}</div>
        {sub && <div className="text-caption text-muted">{sub}</div>}
      </div>
      <Switch checked={r[k]} onChange={() => toggle(k)} label={label} />
    </li>
  );
  return (
    <div className="flex-1 lg:max-w-[640px] lg:mx-auto lg:w-full">
      <TopBar title={t('rem.top')} back={-1} tag={<LaunchTag />} />
      <div className="px-5 pb-8 space-y-4">
        <h1 className="mt-1 text-h-l">{t('rem.title')}</h1>
        <section className="bg-cream border-[1.5px] border-ink rounded-card shadow-brut-sm px-4 pt-3">
          <h2 className="text-label text-muted font-sans">{t('rem.channels')}</h2>
          <ul className="divide-y divide-line">
            <Row k="email" label="Email" sub={p.email} />
            <Row k="push" label={t('rem.push')} sub={t('rem.pushD')} />
            <Row k="messenger" label="Messenger" sub={t('rem.messengerD')} />
            <Row k="sms" label="SMS" sub="+63 917 ••• 4821" />
          </ul>
        </section>
        <section className="bg-cream border-[1.5px] border-ink rounded-card shadow-brut-sm px-4 pt-3">
          <h2 className="text-label text-muted font-sans">{t('rem.what')}</h2>
          <ul className="divide-y divide-line">
            <Row k="deadlines" label={t('rem.deadlines')} sub={t('rem.deadlinesD')} />
            <Row k="sessions" label={t('rem.sessions')} sub={t('rem.sessionsD')} />
            <Row k="results" label={t('rem.results')} />
          </ul>
        </section>
        <div className="bg-cream border-[1.5px] border-ink rounded-card shadow-brut-sm px-4 py-4 flex items-center gap-3">
          <Clock size={20} className="text-green" aria-hidden />
          <span className="flex-1 text-title">{t('rem.quiet')}</span>
          <span className="text-label text-green">{t('rem.quietV')}</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- S14 Skill plan (Launch, students) ---------------- */

const PLANS = {
  'IT Support': { title: 'plan.title', base: 60, gaps: [['Basic networking (IP, DNS)', 'plan.need5'], ['Ticketing tools', 'plan.need3']], have: ['Windows troubleshooting', 'Customer service'] },
  'Back office': { title: 'Para sa Back Office tracks', base: 55, gaps: [['Basic Excel formulas', 'plan.need5'], ['Data entry speed', 'plan.need3']], have: ['Customer service'] },
  'Customer service': { title: 'Para sa Customer Service tracks', base: 75, gaps: [['Typing 35 wpm', 'plan.need3']], have: ['Customer service', 'Windows troubleshooting'] },
} as const;

export function SkillPlan() {
  const t = useT();
  const lang = useDemo((s) => s.lang);
  const learned = useDemo((s) => s.learnedSkills);
  const toggle = useDemo((s) => s.toggleLearned);
  const [tab, setTab] = useState<keyof typeof PLANS>('IT Support');
  const plan = PLANS[tab];
  const gaps = plan.gaps.filter(([s]) => !learned.includes(s));
  const have = [...plan.have, ...plan.gaps.filter(([s]) => learned.includes(s)).map(([s]) => s)];
  const pct = Math.min(100, plan.base + (plan.gaps.length - gaps.length) * 20);
  const title = tab === 'IT Support' ? t('plan.title') : lang === 'fil' ? plan.title : plan.title.replace('Para sa', 'For');
  return (
    <div className="flex-1 flex flex-col lg:max-w-[640px] lg:mx-auto lg:w-full">
      <TopBar title={t('profile.getReady')} back={-1} tag={<LaunchTag />} />
      <div className="px-5 pb-6 flex-1 space-y-4">
        <p className="text-caption text-mango-ink bg-mango-tint rounded-[10px] px-3 py-2">{t('plan.studentNote')}</p>
        <p className="text-body-s text-muted">{t('plan.hi')}</p>
        <h1 className="text-h-l">{title}</h1>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {(Object.keys(PLANS) as (keyof typeof PLANS)[]).map((k) => (
            <Chip key={k} selected={tab === k} onClick={() => setTab(k)}>
              {k}
            </Chip>
          ))}
        </div>
        <div className="bg-cream border-[1.5px] border-ink rounded-card shadow-brut-sm p-4 flex items-center gap-4">
          <ScoreRing value={pct / 100} size={72} />
          <div>
            <div className="text-h-s font-display">{t('plan.ready', { n: pct })}</div>
            <div className="text-body-s text-muted">{t('plan.based')}</div>
          </div>
        </div>
        {gaps.length > 0 && (
          <section className="bg-cream border-[1.5px] border-ink rounded-card shadow-brut-sm px-4 pt-3">
            <h2 className="text-label text-muted font-sans">{t('plan.learn')}</h2>
            <ul className="divide-y divide-line">
              {gaps.map(([s, need]) => (
                <li key={s} className="flex items-center gap-3 py-3.5">
                  <span className="w-7 h-7 rounded-full bg-mango-tint text-mango flex items-center justify-center">
                    <AlertCircle size={16} aria-hidden />
                  </span>
                  <div>
                    <div className="text-body font-semibold">{s}</div>
                    <div className="text-caption text-muted">{t(need)}</div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
        <section className="bg-cream border-[1.5px] border-ink rounded-card shadow-brut-sm px-4 pt-3">
          <h2 className="text-label text-muted font-sans">{t('plan.have')}</h2>
          <ul className="divide-y divide-line">
            {have.map((s) => (
              <li key={s} className="flex items-center gap-3 py-3.5">
                <span className="w-7 h-7 rounded-full bg-green text-white flex items-center justify-center">
                  <Check size={15} strokeWidth={2.6} aria-hidden />
                </span>
                <span className="text-body">{s}</span>
                {learned.includes(s) && (
                  <button type="button" onClick={() => toggle(s)} className="ml-auto text-caption text-muted underline focus-ring rounded">
                    Undo
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
      <MobileFooter className="lg:static lg:border-0 lg:bg-transparent">
        <Button block disabled={gaps.length === 0} onClick={() => gaps[0] && toggle(gaps[0][0])}>
          {t('plan.mark')}
          {gaps[0] ? `: ${gaps[0][0]}` : ''}
        </Button>
      </MobileFooter>
    </div>
  );
}
