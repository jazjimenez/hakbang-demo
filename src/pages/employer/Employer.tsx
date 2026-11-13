import { useState, type ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  AlertCircle,
  Check,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Lock,
  PhilippinePeso,
  Plus,
  ReceiptText,
  Route as RouteIcon,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react';
import { PageHead } from '../../layouts/EmployerShell';
import { Avatar, Button, Card, Checkbox, CloseButton, IconTile, LaunchTag, Modal, ProgressBar, StatusPill, Toast, VerifiedBadge, cx } from '../../components/ui';
import { isPassed, peso, useDemo, useEmployer, useTrack } from '../../store';
import { BLUEHARBOR_ID, MAIN_TRACK_ID, PRICING, UNLISTED_ON_TRACK } from '../../data/seed';
import type { Application, JobSeeker, Module, Score, VerificationChecklist } from '../../data/types';

/* ---------------- shared helpers ---------------- */

type Row = { app: Application; seeker: JobSeeker };

function useTrackRows(trackId = MAIN_TRACK_ID): Row[] {
  const apps = useDemo((s) => s.applications);
  const seekers = useDemo((s) => s.seekers);
  return apps.filter((a) => a.trackId === trackId).map((app) => ({ app, seeker: seekers.find((x) => x.id === app.seekerId)! }));
}

const atRisk = (a: Application) => a.status === 'in-track' && (a.scores.m1 === 'retake' || a.scores.m2 === 'retake' || (typeof a.scores.m1 === 'number' && !isPassed(a.scores.m1)));
const inCohort = (a: Application) => ['in-track', 'passed', 'hired-pending-trainee', 'hired-confirmed', 'accepted'].includes(a.status) && a.acceptedAt?.startsWith('Apr');

function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  return { msg, show: setMsg, el: <Toast message={msg} onDone={() => setMsg(null)} /> };
}

function Th({ children, className }: { children?: ReactNode; className?: string }) {
  return <th className={cx('text-left text-caption text-muted font-medium px-4 py-3 whitespace-nowrap', className)}>{children}</th>;
}
function Td({ children, className }: { children?: ReactNode; className?: string }) {
  return <td className={cx('px-4 py-3.5 text-body-s align-middle', className)}>{children}</td>;
}
function Table({ children, minWidth = 880 }: { children: ReactNode; minWidth?: number }) {
  return (
    <div className="bg-white border border-line rounded-card overflow-x-auto">
      <table className="w-full border-collapse" style={{ minWidth }}>
        {children}
      </table>
    </div>
  );
}

function Tabs<T extends string>({ value, onChange, tabs }: { value: T; onChange: (v: T) => void; tabs: [T, string][] }) {
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

function Person({ seeker, sub }: { seeker: JobSeeker; sub?: string }) {
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

function Note({ icon: Icon, children }: { icon: typeof ShieldCheck; children: ReactNode }) {
  return (
    <p className="mt-5 flex items-center gap-3 bg-mint rounded-[14px] px-4 py-3 text-body-s">
      <Icon size={18} className="text-green shrink-0" aria-hidden />
      {children}
    </p>
  );
}

function Kpi({ label, value, sub, icon: Icon }: { label: string; value: string; sub: string; icon: typeof Users }) {
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

const scoreCell = (s: Score | undefined) => {
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

/* ---------------- E01 Verification ---------------- */

const CHECKLIST: [keyof VerificationChecklist, string, string, string][] = [
  ['bir2303', 'BIR Certificate of Registration (Form 2303)', 'Uploaded Feb 26', 'Upload BIR 2303'],
  ['secOrDti', 'SEC or DTI registration', 'Uploaded Feb 26', 'Upload SEC or DTI registration'],
  ['businessPermit', 'Mayor’s or business permit', 'Upload a PDF or photo', 'Upload business permit'],
  ['partnerAgreement', 'Signed partner agreement', 'Review and e-sign', 'Review and e-sign agreement'],
  ['termsReviewed', 'Hakbang team review', 'Starts when all documents are in', ''],
];

export function Verify() {
  const bh = useEmployer(BLUEHARBOR_ID)!;
  const setV = useDemo((s) => s.setVerification);
  const setRole = useDemo((s) => s.setRole);
  const nav = useNavigate();
  const v = bh.verification;
  const done = CHECKLIST.filter(([k]) => v[k]).length;
  const nextItem = CHECKLIST.find(([k]) => !v[k] && k !== 'termsReviewed');
  const docsIn = !nextItem;
  return (
    <>
      <PageHead
        title={bh.verified ? 'Your company is verified' : 'Get verified to post training tracks'}
        sub={
          bh.verified
            ? 'You can post new tracks. Job seekers see the Verified employer badge on every track.'
            : 'Job seekers only see companies that pass verification. It usually takes 2 to 3 business days. Your pilot track stays live while your 2027 permit is reviewed.'
        }
      />
      <div className="grid xl:grid-cols-[1fr_420px] gap-5 items-start">
        <div className="space-y-5">
          <Card className="p-6">
            <h2 className="text-h-s">Company details</h2>
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              {[
                ['Registered business name', bh.legalName],
                ['Industry', bh.industry],
                ['Office address', bh.address],
                ['Hiring contact', `${bh.contact}, ${bh.contactEmail}`],
              ].map(([l, val]) => (
                <label key={l} className="block">
                  <span className="text-caption text-muted">{l}</span>
                  <input defaultValue={val} className="mt-1.5 w-full h-12 rounded-input border border-line px-3.5 text-body focus:outline-none focus:border-green" />
                </label>
              ))}
            </div>
          </Card>
          <div className="rounded-card bg-mint p-6">
            <h2 className="flex items-center gap-2 text-h-s">
              <PhilippinePeso size={20} className="text-green" aria-hidden /> No hire, no fee
            </h2>
            <div className="mt-4 grid sm:grid-cols-3 gap-3">
              {[
                [peso(PRICING.pilotRate), `per hire, your first batch of ${PRICING.pilotBatch}`],
                [peso(PRICING.standardRate), 'standard rate per hire'],
                [peso(PRICING.volumeRate), `per hire above ${PRICING.volumeThreshold} hires a quarter`],
              ].map(([p, d]) => (
                <div key={p} className="bg-white rounded-[14px] p-4">
                  <div className="font-display font-bold text-h-m text-green">{p}</div>
                  <div className="mt-1 text-caption text-muted">{d}</div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-body-s">Billed monthly with 30-day terms. Every hire has a {PRICING.guaranteeDays}-day replacement guarantee.</p>
          </div>
        </div>

        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-h-s">Verification checklist</h2>
              <StatusPill tone="mint">{bh.verified ? 'Verified' : `${done} of 5 done`}</StatusPill>
            </div>
            <ProgressBar className="mt-3" value={done / 5} height={6} />
            <ul className="mt-4 space-y-3.5">
              {CHECKLIST.map(([k, l, sub]) => {
                const ok = v[k];
                const review = k === 'termsReviewed';
                return (
                  <li key={k} className="flex gap-3">
                    {ok ? (
                      <span className="w-6 h-6 rounded-full bg-green text-white flex items-center justify-center shrink-0">
                        <Check size={14} strokeWidth={3} aria-hidden />
                      </span>
                    ) : review ? (
                      <span className="w-6 h-6 rounded-full border border-line text-muted flex items-center justify-center shrink-0">
                        <Clock size={13} aria-hidden />
                      </span>
                    ) : (
                      <span className="w-6 h-6 rounded-full border-2 border-line shrink-0" aria-hidden />
                    )}
                    <div>
                      <div className="text-label">{l}</div>
                      <div className="text-caption text-muted">{ok ? (review ? 'Approved by Hakbang' : k === 'businessPermit' || k === 'partnerAgreement' ? 'Done Apr 22' : sub) : review && docsIn ? 'In review, usually 2 business days' : sub}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
            {!bh.verified &&
              (nextItem ? (
                <Button block className="mt-5" onClick={() => setV(bh.id, nextItem[0], true)}>
                  {nextItem[3]}
                </Button>
              ) : (
                <div className="mt-5 space-y-2">
                  <Button block disabled>
                    Waiting for Hakbang review
                  </Button>
                  <button
                    type="button"
                    className="w-full text-caption text-green underline focus-ring rounded"
                    onClick={() => {
                      setRole('admin');
                      nav('/admin/verification');
                    }}
                  >
                    Demo: open the admin verification queue
                  </button>
                </div>
              ))}
          </Card>
          {bh.verified ? (
            <Link to="/employer/tracks/new" className="flex items-center gap-3 rounded-card border border-green bg-mint p-4 hover:bg-[#dcefe0] focus-ring">
              <IconTile icon={Plus} tone="green" size={36} />
              <div className="flex-1">
                <div className="text-label">Post a track</div>
                <div className="text-caption text-muted">Unlocked. Your next track can go live today.</div>
              </div>
              <ChevronRight size={18} className="text-green" aria-hidden />
            </Link>
          ) : (
            <div className="flex items-center gap-3 rounded-card border border-dashed border-line p-4 text-muted">
              <Lock size={18} aria-hidden />
              <div>
                <div className="text-label text-ink">Post a track</div>
                <div className="text-caption">Unlocks after verification. You can draft one now.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ---------------- E02 Overview ---------------- */

export function Overview() {
  const nav = useNavigate();
  const bh = useEmployer(BLUEHARBOR_ID)!;
  const rows = useTrackRows();
  const draft = useTrack('bh-cs-draft');
  const waiting = rows.filter((r) => r.app.status === 'applied').length;
  const cohort = rows.filter((r) => inCohort(r.app));
  const inTrack = cohort.length + UNLISTED_ON_TRACK;
  const onPace = cohort.filter((r) => !atRisk(r.app)).length + UNLISTED_ON_TRACK;
  const toPost = rows.filter((r) => r.app.status === 'in-track' && (r.app.scores.m2 === 'in-progress' || r.app.scores.m1 === 'in-progress')).length;
  const passed = rows.filter((r) => r.app.status === 'passed').length;
  const risk = rows.filter((r) => atRisk(r.app)).length;
  const hired = useDemo((s) => s.hires.filter((h) => h.billed).length);
  const applied = rows.some((r) => r.app.seekerId === 'paolo');

  const attention: [typeof Users, number, string, string, 'mint' | 'mango'][] = [
    [Users, waiting, 'candidates waiting for your answer', '/employer/candidates', 'mint'],
    [FileText, toPost, 'module results to post', '/employer/trainees', 'mint'],
    [Check, passed, 'trainees passed, confirm their hire', '/employer/trainees', 'mint'],
    [AlertCircle, risk, 'trainee at risk after a missed session', '/employer/trainees', 'mango'],
  ];
  return (
    <>
      <PageHead
        title="Good morning, Carla"
        sub="Back Office Associate, batch 1, week 3 of 4"
        actions={
          <Button icon={bh.verified ? Plus : Lock} onClick={() => nav(bh.verified ? '/employer/tracks/new' : '/employer/verify')}>
            New track
          </Button>
        }
      />
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Kpi label="Matched candidates" value={String(41 + (applied ? 1 : 0))} sub="18 new this week" icon={Users} />
        <Kpi label="Trainees in track" value={`${inTrack} / 20`} sub={inTrack >= 20 ? 'All slots filled' : `${20 - inTrack} slot open`} icon={RouteIcon} />
        <Kpi label="On pace to finish" value={`${onPace} of 20`} sub={`${Math.round((onPace / 20) * 100)}% completion so far`} icon={Check} />
        <Kpi label="Pilot hire target" value={`${PRICING.pilotHireTarget} of 20`} sub={`70% of the batch · ${hired} hired so far`} icon={Star} />
      </div>
      <div className="mt-5 grid xl:grid-cols-[440px_1fr] gap-5 items-start">
        <Card className="p-6">
          <h2 className="text-h-s">Needs your attention</h2>
          <ul className="mt-3 divide-y divide-line">
            {attention.map(([Icon, n, l, to, tone]) => (
              <li key={l}>
                <Link to={to} className="flex items-center gap-3 py-3 focus-ring rounded">
                  <IconTile icon={Icon} size={34} tone={tone} />
                  <span className="text-body-s flex-1">
                    <b className="font-display text-[18px] mr-1.5">{n}</b>
                    {l}
                  </span>
                  <ChevronRight size={18} className="text-muted" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
        <div>
          <h2 className="text-h-s mb-3">Your tracks</h2>
          <Table minWidth={560}>
            <thead className="bg-paper">
              <tr>
                <Th>Track</Th>
                <Th>Status</Th>
                <Th>Trainees</Th>
                <Th>Next step</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              <tr>
                <Td className="text-label">Back Office Associate</Td>
                <Td>
                  <StatusPill tone="green">Live</StatusPill>
                </Td>
                <Td>{inTrack}</Td>
                <Td>Face-to-face assessment, May 1</Td>
              </tr>
              {draft && (
                <tr>
                  <Td className="text-label">{draft.shortTitle}</Td>
                  <Td>{draft.status === 'live' ? <StatusPill tone="green">Live</StatusPill> : <StatusPill tone="grey">Draft</StatusPill>}</Td>
                  <Td>{draft.status === 'live' ? 0 : '—'}</Td>
                  <Td>
                    {draft.status === 'live' ? (
                      'Matching candidates'
                    ) : (
                      <Link to="/employer/tracks/new" className="text-green underline focus-ring rounded">
                        Finish the schedule
                      </Link>
                    )}
                  </Td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
}

/* ---------------- E03 Create track wizard ---------------- */

export function NewTrack() {
  const nav = useNavigate();
  const bh = useEmployer(BLUEHARBOR_ID)!;
  const draft = useTrack('bh-cs-draft')!;
  const update = useDemo((s) => s.updateTrack);
  const toast = useToast();
  const [step, setStep] = useState(2);
  const [title, setTitle] = useState(draft.title);
  const [location, setLocation] = useState(draft.location);
  const [modules, setModules] = useState<Module[]>(
    draft.modules.length
      ? draft.modules
      : [
          { id: 'm1', title: 'Customer service basics', format: 'Online test', passMark: '80%', due: 'May 15', when: 'Week 1' },
          { id: 'm2', title: 'Ticket handling', format: 'Online reading and test', passMark: '80%', due: 'May 22', when: 'Week 2' },
          { id: 'm3', title: 'Final assessment', format: 'Face-to-face, Ortigas', passMark: 'Pass', due: 'May 29', when: 'Week 3' },
        ],
  );
  const [weeks, setWeeks] = useState(String(draft.lengthWeeks));
  const [sessions, setSessions] = useState('Sat–Sun, 9 AM to 3 PM');
  const [allowance, setAllowance] = useState(String(draft.allowancePhp ?? 2000));
  const [slots, setSlots] = useState(String(draft.slots));
  const [commit, setCommit] = useState(true);
  const live = draft.status === 'live';

  const save = (status?: 'live') => {
    update(draft.id, {
      title,
      shortTitle: title.replace(/ Track$/, ''),
      location,
      locationShort: location.split(',')[0],
      modules,
      lengthWeeks: Number(weeks) || 3,
      allowancePhp: Number(allowance.replace(/[^\d]/g, '')) || undefined,
      slots: Number(slots) || 15,
      startDate: 'May 15, 2027',
      requiredSkills: ['Customer service', 'English communication'],
      match: { total: 78, skills: 0.85, location: 0.9, schedule: 1 },
      ...(status ? { status } : {}),
    });
  };
  const steps = ['Role and location', 'Modules and schedule', 'Hiring terms and review'];
  const input = 'mt-1.5 w-full h-12 rounded-input border border-line px-3.5 text-body bg-white focus:outline-none focus:border-green';

  return (
    <>
      <PageHead
        title="New training track"
        sub={title}
        actions={
          <Button
            variant="secondary"
            onClick={() => {
              save();
              toast.show('Draft saved.');
            }}
          >
            Save draft
          </Button>
        }
      />
      <ol className="flex flex-wrap items-center gap-3 mb-6">
        {steps.map((l, i) => {
          const n = i + 1;
          const st = n < step ? 'done' : n === step ? 'current' : 'next';
          return (
            <li key={l} className="flex items-center gap-3">
              <button type="button" onClick={() => setStep(n)} className="flex items-center gap-2.5 focus-ring rounded-full" aria-current={st === 'current' ? 'step' : undefined}>
                <span
                  className={cx(
                    'w-7 h-7 rounded-full flex items-center justify-center text-caption',
                    st === 'done' && 'bg-green text-white',
                    st === 'current' && 'bg-green text-white',
                    st === 'next' && 'bg-white border border-line text-muted',
                  )}
                >
                  {st === 'done' ? <Check size={14} strokeWidth={3} aria-hidden /> : n}
                </span>
                <span className={cx('text-label', st === 'next' ? 'text-muted' : 'text-ink')}>{l}</span>
              </button>
              {i < 2 && <span className={cx('hidden sm:block w-12 h-0.5 rounded', n < step ? 'bg-lime' : 'bg-line')} aria-hidden />}
            </li>
          );
        })}
      </ol>
      <div className="grid xl:grid-cols-[1fr_340px] gap-5 items-start">
        <div className="space-y-5">
          {!bh.verified && (
            <p className="flex items-center gap-3 bg-mango-tint text-mango-ink rounded-[14px] px-4 py-3 text-body-s">
              <Lock size={16} aria-hidden /> You can draft now. Publishing unlocks after verification (decision D7).
            </p>
          )}
          {step === 1 && (
            <Card className="p-6 grid sm:grid-cols-2 gap-4">
              <label className="block sm:col-span-2">
                <span className="text-caption text-muted">Track title</span>
                <input className={input} value={title} onChange={(e) => setTitle(e.target.value)} />
              </label>
              <label className="block">
                <span className="text-caption text-muted">Role after hiring</span>
                <input className={input} defaultValue="Customer Service Associate" />
              </label>
              <label className="block">
                <span className="text-caption text-muted">Training location</span>
                <input className={input} value={location} onChange={(e) => setLocation(e.target.value)} />
              </label>
            </Card>
          )}
          {step === 2 && (
            <>
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-h-s">Modules</h2>
                  <span className="text-caption text-muted">Trainees see these in order</span>
                </div>
                <div className="mt-4 border border-line rounded-[16px] overflow-x-auto">
                  <table className="w-full min-w-[560px]">
                    <thead className="bg-paper">
                      <tr>
                        <Th className="w-10"> </Th>
                        <Th>Module</Th>
                        <Th>Format</Th>
                        <Th>Pass mark</Th>
                        <Th>When</Th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {modules.map((m, i) => (
                        <tr key={i}>
                          <Td className="font-display font-bold text-title">{i + 1}</Td>
                          <Td>
                            <input
                              aria-label={`Module ${i + 1} title`}
                              value={m.title}
                              onChange={(e) => setModules(modules.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))}
                              className="w-full bg-transparent focus:outline-none focus:bg-paper rounded px-1"
                            />
                          </Td>
                          <Td>{m.format}</Td>
                          <Td>{m.passMark}</Td>
                          <Td>{m.when}</Td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setModules([
                      ...modules.slice(0, -1),
                      { id: 'm2', title: 'New module', format: 'Online test', passMark: '80%', due: 'TBD', when: `Week ${modules.length}` },
                      modules[modules.length - 1],
                    ])
                  }
                  className="mt-3 w-full h-11 rounded-[14px] border-2 border-dashed border-line text-label text-green flex items-center justify-center gap-1.5 hover:border-green focus-ring"
                >
                  <Plus size={16} aria-hidden /> Add module
                </button>
              </Card>
              <Card className="p-6">
                <h2 className="text-h-s">Schedule and support</h2>
                <div className="mt-4 grid sm:grid-cols-4 gap-4">
                  {(
                    [
                      ['Length (weeks)', weeks, setWeeks],
                      ['Sessions', sessions, setSessions],
                      ['Allowance (₱ total)', allowance, setAllowance],
                      ['Slots', slots, setSlots],
                    ] as const
                  ).map(([l, val, set]) => (
                    <label key={l} className="block">
                      <span className="text-caption text-muted">{l}</span>
                      <input className={input} value={val} onChange={(e) => set(e.target.value)} />
                    </label>
                  ))}
                </div>
              </Card>
            </>
          )}
          {step === 3 && (
            <Card className="p-6 space-y-5">
              <div>
                <h2 className="text-h-s">Hiring commitment</h2>
                <p className="mt-2 text-body-s text-muted">Shown to job seekers above the Apply button (decision D4).</p>
                <div className="mt-3 rounded-[16px] border border-green bg-mint p-4 text-body-s">
                  {bh.name} will hire every trainee who passes, on a regular contract with SSS, PhilHealth, and Pag-IBIG.
                </div>
              </div>
              <div>
                <h3 className="text-title">How trainees get hired</h3>
                <ul className="mt-2 space-y-1.5 text-body-s">
                  {['80% or higher on every module test', 'Pass the face-to-face assessment', 'Complete attendance'].map((c) => (
                    <li key={c} className="flex items-center gap-2">
                      <Check size={16} className="text-green" aria-hidden /> {c}
                    </li>
                  ))}
                </ul>
              </div>
              <Checkbox checked={commit} onChange={setCommit}>
                We commit to hire every trainee who meets these criteria. Trainees never pay any fee.
              </Checkbox>
            </Card>
          )}
          <div className="flex justify-end gap-3">
            {step > 1 && (
              <Button variant="secondary" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)}>Next: {steps[step].toLowerCase()}</Button>
            ) : live ? (
              <Button onClick={() => nav('/employer/overview')}>Done</Button>
            ) : (
              <Button
                icon={bh.verified ? undefined : Lock}
                disabled={!bh.verified || !commit}
                onClick={() => {
                  save('live');
                  toast.show('Track is live. Matched job seekers can see it now.');
                }}
              >
                Publish track
              </Button>
            )}
          </div>
        </div>
        <div className="rounded-card bg-deep p-5 text-white xl:sticky xl:top-6">
          <div className="text-caption text-lime">How job seekers will see it</div>
          <div className="mt-3 bg-white text-ink rounded-[16px] p-4">
            <div className="text-h-s font-display">{title}</div>
            <VerifiedBadge className="mt-2" />
            <div className="mt-2 text-caption text-muted">
              {weeks} weeks{allowance ? `, ₱${Number(allowance.replace(/[^\d]/g, '') || 0).toLocaleString()} allowance` : ''}, {sessions.split(',')[0]}, {location.split(',')[0]}
            </div>
          </div>
          {live && <p className="mt-3 text-caption text-lime">Live now</p>}
        </div>
      </div>
      {toast.el}
    </>
  );
}

/* ---------------- E04 Candidates ---------------- */

export function Candidates() {
  const rows = useTrackRows();
  const accept = useDemo((s) => s.accept);
  const decline = useDemo((s) => s.decline);
  const [tab, setTab] = useState<'waiting' | 'accepted' | 'declined'>('waiting');
  const [sel, setSel] = useState<string[]>([]);
  const groups = {
    waiting: rows.filter((r) => r.app.status === 'applied'),
    accepted: rows.filter((r) => !['applied', 'declined'].includes(r.app.status) && inCohort(r.app)),
    declined: rows.filter((r) => r.app.status === 'declined'),
  };
  const list = [...groups[tab]].sort((a, b) => b.app.match.total - a.app.match.total);
  const acceptedTotal = groups.accepted.length + UNLISTED_ON_TRACK;
  return (
    <>
      <PageHead
        title="Matched candidates"
        sub={`Back Office Associate, batch 1 starts Apr 10. ${Math.min(acceptedTotal, 20)} of 20 slots filled.`}
        actions={
          tab === 'waiting' && (
            <Button
              variant="secondary"
              size="md"
              disabled={sel.length === 0}
              onClick={() => {
                sel.forEach(accept);
                setSel([]);
              }}
            >
              Accept selected{sel.length ? ` (${sel.length})` : ''}
            </Button>
          )
        }
      />
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          ['waiting', `Waiting ${groups.waiting.length}`],
          ['accepted', `Accepted ${acceptedTotal}`],
          ['declined', `Declined ${groups.declined.length}`],
        ]}
      />
      <Table minWidth={980}>
        <thead className="bg-paper">
          <tr>
            {tab === 'waiting' && <Th className="w-10"> </Th>}
            <Th>Candidate</Th>
            <Th>Course</Th>
            <Th>Location</Th>
            <Th>Availability</Th>
            <Th>Contact</Th>
            <Th>Match and why</Th>
            <Th> </Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {list.map(({ app, seeker }) => (
            <tr key={app.id} className={cx(seeker.id === 'paolo' && tab === 'waiting' && 'bg-mint/40')}>
              {tab === 'waiting' && (
                <Td>
                  <input
                    type="checkbox"
                    aria-label={`Select ${seeker.name}`}
                    checked={sel.includes(app.id)}
                    onChange={(e) => setSel(e.target.checked ? [...sel, app.id] : sel.filter((x) => x !== app.id))}
                    className="w-[18px] h-[18px] accent-green"
                  />
                </Td>
              )}
              <Td>
                <Person seeker={seeker} sub={`Applied ${app.appliedAt}`} />
              </Td>
              <Td>{seeker.course}</Td>
              <Td>{seeker.city}</Td>
              <Td>{seeker.availability}</Td>
              <Td>
                {app.status === 'applied' || app.status === 'declined' ? (
                  <span className="inline-flex items-center gap-1 text-muted text-caption">
                    <Lock size={13} aria-hidden /> Hidden until accepted
                  </span>
                ) : (
                  <span className="text-caption">+63 917 ••• {String(1000 + seeker.name.length * 317).slice(-4)}</span>
                )}
              </Td>
              <Td>
                <div className="flex items-center gap-3 min-w-[190px]">
                  <span className="font-display font-bold text-h-m text-green w-12">{app.match.total}%</span>
                  <dl className="space-y-0.5 text-caption flex-1">
                    {(
                      [
                        ['Skills', app.match.skills],
                        ['Location', app.match.location],
                        ['Schedule', app.match.schedule],
                      ] as const
                    ).map(([l, v]) => (
                      <div key={l} className="flex items-center gap-2">
                        <dt className="w-[52px] text-muted">{l}</dt>
                        <dd className="flex-1" aria-label={`${Math.round(v * 100)}%`}>
                          <ProgressBar value={v} track="bg-line" />
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Td>
              <Td>
                {tab === 'waiting' ? (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => accept(app.id)}>
                      Accept
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => decline(app.id)}>
                      Decline
                    </Button>
                  </div>
                ) : tab === 'accepted' ? (
                  <StatusPill tone={app.status === 'in-track' ? 'mint' : 'green'}>{app.status === 'in-track' ? 'In track' : app.status === 'passed' ? 'Passed' : 'Hired'}</StatusPill>
                ) : (
                  <StatusPill tone="grey">Declined</StatusPill>
                )}
              </Td>
            </tr>
          ))}
          {list.length === 0 && (
            <tr>
              <td colSpan={8} className="text-center text-muted py-10 text-body-s">
                {tab === 'waiting' ? 'No candidates waiting. New matches appear here when job seekers apply.' : 'Nobody here yet.'}
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      {tab === 'accepted' && <p className="mt-3 text-caption text-muted">+{UNLISTED_ON_TRACK} more accepted trainees not listed in this demo.</p>}
      <Note icon={ShieldCheck}>Ranked by skills, location, and schedule only. School and name never affect the score.</Note>
    </>
  );
}

/* ---------------- E05 Trainees + E06 / E08 modals ---------------- */

type TFilter = 'all' | 'on' | 'passed' | 'risk';

export function Trainees({ modal }: { modal?: 'hire' | 'endorse' }) {
  const nav = useNavigate();
  const { id } = useParams();
  const rows = useTrackRows().filter((r) => inCohort(r.app));
  const show = useDemo((s) => s.showLaunch);
  const toast = useToast();
  const [tab, setTab] = useState<TFilter>('all');
  const [posting, setPosting] = useState(false);
  const [viewing, setViewing] = useState<string | null>(null);
  const status = (a: Application) => (atRisk(a) ? 'risk' : a.status === 'in-track' ? 'on' : 'passed');
  const counts = {
    on: rows.filter((r) => status(r.app) === 'on').length + UNLISTED_ON_TRACK,
    passed: rows.filter((r) => status(r.app) === 'passed').length,
    risk: rows.filter((r) => status(r.app) === 'risk').length,
  };
  const list = rows.filter((r) => tab === 'all' || status(r.app) === tab);
  const endorseTarget = rows.find((r) => r.seeker.id === 'paolo' && isPassed(r.app.scores.m1)) ?? rows.find((r) => isPassed(r.app.scores.m1));
  const pendingResults = rows.filter((r) => r.app.status === 'in-track' && (r.app.scores.m1 === 'in-progress' || r.app.scores.m2 === 'in-progress' || (isPassed(r.app.scores.m1) && isPassed(r.app.scores.m2) && r.app.f2f !== 'passed')));
  const nextModule = pendingResults.some((r) => r.app.scores.m1 === 'in-progress') ? 'Module 1' : pendingResults.some((r) => r.app.scores.m2 === 'in-progress') ? 'Module 2' : 'assessment';

  const pill = (a: Application) => {
    if (a.status === 'hired-pending-trainee') return <StatusPill tone="mango">Waiting for trainee</StatusPill>;
    if (a.status === 'hired-confirmed') return <StatusPill tone="green">Hired</StatusPill>;
    if (a.status === 'passed') return <StatusPill tone="green">Passed</StatusPill>;
    if (atRisk(a)) return <StatusPill tone="mango">At risk</StatusPill>;
    return <StatusPill tone="mint">On track</StatusPill>;
  };
  const action = (r: Row) => {
    const a = r.app;
    if (a.status === 'passed')
      return (
        <Button size="sm" onClick={() => nav(`/employer/trainees/${a.id}/hire`)}>
          Mark as hired
        </Button>
      );
    if (a.status === 'hired-pending-trainee' || a.status === 'hired-confirmed')
      return (
        <Button size="sm" variant="secondary" to="/employer/billing">
          Billing
        </Button>
      );
    if (atRisk(a))
      return (
        <Button size="sm" variant="secondary" onClick={() => toast.show(`Message sent to ${r.seeker.firstName} (demo).`)}>
          Message
        </Button>
      );
    return (
      <Button size="sm" variant="secondary" onClick={() => setViewing(a.id)}>
        View
      </Button>
    );
  };
  const viewRow = rows.find((r) => r.app.id === viewing);

  return (
    <>
      <PageHead
        title="Trainee progress"
        sub="Back Office Associate, batch 1, week 3 of 4"
        actions={
          <>
            <Button variant="secondary" size="md" disabled={pendingResults.length === 0} onClick={() => setPosting(true)}>
              Post {nextModule} results
            </Button>
            <Button size="md" onClick={() => toast.show('Weekly report sent to all trainees (demo).')}>
              Send weekly report
            </Button>
          </>
        }
      />
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          ['all', `All ${rows.length + UNLISTED_ON_TRACK}`],
          ['on', `On track ${counts.on}`],
          ['passed', `Passed ${counts.passed}`],
          ['risk', `At risk ${counts.risk}`],
        ]}
      />
      <Table minWidth={920}>
        <thead className="bg-paper">
          <tr>
            <Th>Trainee</Th>
            <Th>Module 1</Th>
            <Th>Module 2</Th>
            <Th>Attendance</Th>
            <Th>Face-to-face, May 1</Th>
            <Th>Status</Th>
            <Th> </Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {list.map((r) => (
            <tr key={r.app.id} className={cx(r.seeker.id === 'paolo' && 'bg-mint/40')}>
              <Td>
                <Person seeker={r.seeker} />
              </Td>
              <Td>{scoreCell(r.app.scores.m1)}</Td>
              <Td>{scoreCell(r.app.scores.m2)}</Td>
              <Td>{r.app.attendance}</Td>
              <Td>{r.app.f2f === 'passed' ? 'Passed' : r.app.f2f === 'scheduled' ? 'Scheduled' : 'Not yet'}</Td>
              <Td>{pill(r.app)}</Td>
              <Td>
                <div className="flex items-center gap-2 justify-end">
                  {show && isPassed(r.app.scores.m1) && (
                    <Link to={`/employer/trainees/${r.app.id}/endorse`} aria-label={`Endorse ${r.seeker.name}`} title="Add endorsement" className="w-9 h-9 rounded-[10px] border border-line flex items-center justify-center text-green hover:bg-mint focus-ring">
                      <Star size={16} aria-hidden />
                    </Link>
                  )}
                  {action(r)}
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
      {tab !== 'passed' && tab !== 'risk' && <p className="mt-3 text-caption text-muted">+{UNLISTED_ON_TRACK} more trainees on track, not listed in this demo.</p>}
      {show && (
        <Card className="mt-5 p-4 flex items-center gap-4">
          <IconTile icon={Star} size={40} />
          <div className="flex-1">
            <div className="text-label">Add endorsements for passed modules</div>
            <div className="text-caption text-muted">They stay on each trainee’s profile even if they are not hired.</div>
          </div>
          <LaunchTag />
          {endorseTarget && (
            <Button size="sm" variant="secondary" onClick={() => nav(`/employer/trainees/${endorseTarget.app.id}/endorse`)}>
              Endorse {endorseTarget.seeker.firstName}
            </Button>
          )}
        </Card>
      )}
      {posting && <PostResults rows={pendingResults} onClose={() => setPosting(false)} onDone={(m) => toast.show(m)} />}
      {viewRow && <ViewTrainee row={viewRow} onClose={() => setViewing(null)} />}
      {modal === 'hire' && id && <HireModal appId={id} />}
      {modal === 'endorse' && id && show && <EndorseModal appId={id} />}
      {toast.el}
    </>
  );
}

function ViewTrainee({ row, onClose }: { row: Row; onClose: () => void }) {
  const track = useTrack(row.app.trackId)!;
  return (
    <Modal onClose={onClose} labelledBy="view-title" width={520}>
      <div className="flex items-start gap-3">
        <Avatar initials={row.seeker.initials} size={44} />
        <div className="flex-1">
          <h2 id="view-title" className="text-h-m">
            {row.seeker.name}
          </h2>
          <p className="text-body-s text-muted">
            {row.seeker.course}, {row.seeker.school} · {row.seeker.city}
          </p>
        </div>
        <CloseButton onClick={onClose} />
      </div>
      <ul className="mt-5 divide-y divide-line border-y border-line">
        {track.modules.map((m, i) => (
          <li key={m.id} className="flex justify-between py-3 text-body-s">
            <span>
              Module {i + 1}: {m.title}
            </span>
            <span>{m.id === 'm3' ? (row.app.f2f === 'passed' ? 'Passed' : row.app.f2f === 'scheduled' ? 'Scheduled May 1' : 'Not yet') : scoreCell(row.app.scores[m.id])}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-caption text-muted">Training runs on your side (readings, online tests, face-to-face). Post results here and the trainee sees them in My Track.</p>
    </Modal>
  );
}

function PostResults({ rows, onClose, onDone }: { rows: Row[]; onClose: () => void; onDone: (m: string) => void }) {
  const post = useDemo((s) => s.postScore);
  const f2f = useDemo((s) => s.postF2F);
  const which = (a: Application): 'm1' | 'm2' | 'f2f' => (a.scores.m1 === 'in-progress' ? 'm1' : a.scores.m2 === 'in-progress' ? 'm2' : 'f2f');
  const [vals, setVals] = useState<Record<string, string>>(() =>
    Object.fromEntries(rows.map((r) => [r.app.id, which(r.app) === 'm1' ? (r.seeker.id === 'paolo' ? '88' : '86') : which(r.app) === 'm2' ? (r.seeker.id === 'paolo' ? '91' : '87') : 'pass'])),
  );
  return (
    <Modal onClose={onClose} labelledBy="post-title" width={560}>
      <div className="flex items-start justify-between">
        <div>
          <h2 id="post-title" className="text-h-m">
            Post results
          </h2>
          <p className="text-body-s text-muted">Trainees see these in My Track right away. Pass mark is 80%.</p>
        </div>
        <CloseButton onClick={onClose} />
      </div>
      <ul className="mt-5 divide-y divide-line border-y border-line">
        {rows.map((r) => {
          const w = which(r.app);
          return (
            <li key={r.app.id} className="flex items-center gap-3 py-3">
              <Person seeker={r.seeker} sub={w === 'f2f' ? 'Face-to-face assessment' : w === 'm1' ? 'Module 1 test' : 'Module 2 test'} />
              <div className="ml-auto">
                {w === 'f2f' ? (
                  <select
                    aria-label={`Assessment result for ${r.seeker.name}`}
                    value={vals[r.app.id]}
                    onChange={(e) => setVals({ ...vals, [r.app.id]: e.target.value })}
                    className="h-10 rounded-input border border-line px-3 text-body-s bg-white"
                  >
                    <option value="pass">Passed</option>
                    <option value="fail">Not yet</option>
                  </select>
                ) : (
                  <label className="flex items-center gap-1.5">
                    <input
                      aria-label={`Score for ${r.seeker.name}`}
                      inputMode="numeric"
                      value={vals[r.app.id]}
                      onChange={(e) => setVals({ ...vals, [r.app.id]: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                      className="w-16 h-10 rounded-input border border-line px-3 text-body-s text-right"
                    />
                    <span className="text-body-s text-muted">%</span>
                  </label>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            rows.forEach((r) => {
              const w = which(r.app);
              const v = vals[r.app.id];
              if (w === 'f2f') f2f(r.app.id, v === 'pass');
              else post(r.app.id, w, Number(v) || 0);
            });
            onClose();
            onDone(`Posted results for ${rows.length} trainee${rows.length > 1 ? 's' : ''}.`);
          }}
        >
          Post results
        </Button>
      </div>
    </Modal>
  );
}

function HireModal({ appId }: { appId: string }) {
  const nav = useNavigate();
  const app = useDemo((s) => s.applications.find((a) => a.id === appId));
  const seeker = useDemo((s) => s.seekers.find((x) => x.id === app?.seekerId));
  const hires = useDemo((s) => s.hires.filter((h) => h.billed).length);
  const markHired = useDemo((s) => s.markHired);
  const [position, setPosition] = useState('Back Office Associate');
  const [start, setStart] = useState('May 17, 2027');
  const [contract, setContract] = useState('Regular, with SSS, PhilHealth, and Pag-IBIG');
  const [signed, setSigned] = useState(false);
  const close = () => nav('/employer/trainees');
  if (!app || !seeker) return null;
  const fee = hires < PRICING.pilotBatch ? PRICING.pilotRate : PRICING.standardRate;
  const canHire = app.status === 'passed';
  const input = 'mt-1.5 w-full h-12 rounded-input border border-line px-3.5 text-body bg-white focus:outline-none focus:border-green';
  return (
    <Modal onClose={close} labelledBy="hire-title" width={560}>
      <div className="flex items-start gap-3">
        <Avatar initials={seeker.initials} size={36} />
        <div className="flex-1">
          <h2 id="hire-title" className="text-h-m">
            Mark {seeker.name} as hired?
          </h2>
          <p className="text-body-s text-muted">{canHire ? 'Passed all modules and the face-to-face assessment.' : 'This trainee has not passed every module yet.'}</p>
        </div>
      </div>
      <div className="mt-5 grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-caption text-muted">Position</span>
          <input className={input} value={position} onChange={(e) => setPosition(e.target.value)} />
        </label>
        <label className="block">
          <span className="text-caption text-muted">Start date</span>
          <input className={input} value={start} onChange={(e) => setStart(e.target.value)} />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-caption text-muted">Contract</span>
          <input className={input} value={contract} onChange={(e) => setContract(e.target.value)} />
        </label>
      </div>
      <div className="mt-4 rounded-[16px] bg-mint p-4">
        <div className="flex items-center justify-between">
          <span className="text-title">Success fee, {fee === PRICING.pilotRate ? 'pilot rate' : 'standard rate'}</span>
          <span className="font-display font-bold text-h-m text-green">{peso(fee)}</span>
        </div>
        <p className="mt-1 text-caption text-muted">
          Billed only after {seeker.firstName} confirms the signed contract. Covered by the {PRICING.guaranteeDays}-day replacement guarantee.
        </p>
      </div>
      <div className="mt-4">
        <Checkbox checked={signed} onChange={setSigned}>
          A job contract was offered and signed.
        </Checkbox>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={close}>
          Cancel
        </Button>
        <Button
          disabled={!signed || !canHire}
          onClick={() => {
            markHired(app.id, { position, startDate: start.replace(/, \d{4}$/, ''), contract });
            nav('/employer/billing');
          }}
        >
          Mark as hired
        </Button>
      </div>
    </Modal>
  );
}

const ENDORSE_SKILLS = ['Process documentation', 'Attention to detail', 'Basic Excel', 'Data entry', 'Teamwork', 'Customer service'];

function EndorseModal({ appId }: { appId: string }) {
  const nav = useNavigate();
  const app = useDemo((s) => s.applications.find((a) => a.id === appId));
  const seeker = useDemo((s) => s.seekers.find((x) => x.id === app?.seekerId));
  const track = useTrack(app?.trackId);
  const add = useDemo((s) => s.addEndorsement);
  const passedMods = track?.modules.filter((m) => m.id !== 'm3' && app && isPassed(app.scores[m.id])) ?? [];
  const already = app?.endorsements.map((e) => e.moduleId) ?? [];
  const firstOpen = passedMods.find((m) => !already.includes(m.id)) ?? passedMods[0];
  const [mod, setMod] = useState<Module['id'] | undefined>(firstOpen?.id);
  const [skills, setSkills] = useState<string[]>(mod === 'm1' ? ['Basic Excel', 'Attention to detail'] : ['Process documentation', 'Attention to detail']);
  const [note, setNote] = useState(mod === 'm1' ? 'Maingat at consistent sa data entry. Pinakamabilis sa batch.' : 'Malinaw mag-document ng process steps.');
  const close = () => nav('/employer/trainees');
  if (!app || !seeker || !track) return null;
  const m = track.modules.find((x) => x.id === mod);
  const score = mod ? app.scores[mod] : undefined;
  return (
    <Modal onClose={close} labelledBy="endorse-title" width={560}>
      <div className="flex items-start gap-3">
        <IconTile icon={Star} tone="lime" size={40} className="!rounded-full" />
        <div className="flex-1">
          <h2 id="endorse-title" className="text-h-m">
            Endorse {seeker.name}
          </h2>
          <p className="text-body-s text-muted">{m ? `Module ${track.modules.indexOf(m) + 1}: ${m.title}, passed with ${score}%` : 'No passed modules yet.'}</p>
        </div>
        <LaunchTag />
      </div>
      {passedMods.length > 1 && (
        <div className="mt-4 flex gap-2" role="radiogroup" aria-label="Module">
          {passedMods.map((pm) => (
            <button
              key={pm.id}
              type="button"
              role="radio"
              aria-checked={mod === pm.id}
              onClick={() => setMod(pm.id)}
              className={cx('h-9 px-3.5 rounded-full text-label border focus-ring', mod === pm.id ? 'bg-deep text-white border-deep' : 'bg-white border-line')}
            >
              Module {track.modules.indexOf(pm) + 1}
              {already.includes(pm.id) && ' ✓'}
            </button>
          ))}
        </div>
      )}
      <fieldset className="mt-5">
        <legend className="text-caption text-muted">Skills {seeker.firstName} showed in this module</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {ENDORSE_SKILLS.map((s) => {
            const on = skills.includes(s);
            return (
              <button
                key={s}
                type="button"
                aria-pressed={on}
                onClick={() => setSkills(on ? skills.filter((x) => x !== s) : [...skills, s])}
                className={cx('inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full text-label border focus-ring', on ? 'bg-green text-white border-green' : 'bg-white border-line')}
              >
                {on && <Check size={14} aria-hidden />}
                {s}
              </button>
            );
          })}
        </div>
      </fieldset>
      <label className="block mt-5">
        <span className="flex justify-between text-caption text-muted">
          <span>Short note, shown on their profile</span>
          <span>{note.length} of 200</span>
        </span>
        <textarea value={note} maxLength={200} onChange={(e) => setNote(e.target.value)} rows={2} className="mt-1.5 w-full rounded-input border-2 border-green px-3.5 py-3 text-body focus:outline-none" />
      </label>
      <Note icon={ShieldCheck}>This stays on {seeker.firstName}’s profile even if they are not hired. Other verified employers can see it.</Note>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={close}>
          Cancel
        </Button>
        <Button
          disabled={!mod || skills.length === 0}
          onClick={() => {
            add(app.id, { moduleId: mod!, skills, note, date: app.scoreDates[mod!] ?? 'Apr 24' });
            close();
          }}
        >
          Add endorsement
        </Button>
      </div>
    </Modal>
  );
}

/* ---------------- E07 Billing ---------------- */

export function Billing() {
  const hires = useDemo((s) => s.hires);
  const apps = useDemo((s) => s.applications);
  const seekers = useDemo((s) => s.seekers);
  const toast = useToast();
  const rows = hires.map((h) => {
    const app = apps.find((a) => a.id === h.applicationId)!;
    return { h, app, seeker: seekers.find((x) => x.id === app.seekerId)! };
  });
  rows.sort((a, b) => Number(a.h.billed) - Number(b.h.billed));
  const confirmed = rows.filter((r) => r.h.billed);
  const waiting = rows.filter((r) => !r.h.billed);
  const total = confirmed.reduce((n, r) => n + r.h.feePhp, 0);

  const download = () => {
    const lines = [
      'Hakbang demo invoice (fictional),BlueHarbor CX Solutions Inc.,May 2027',
      'Hire,Position,Start date,Fee (PHP)',
      ...confirmed.map((r) => `${r.seeker.name},${r.h.position},${r.h.startDate},${r.h.feePhp}`),
      `Total,,,${total}`,
      'Terms: 30 days. 90-day replacement guarantee on every hire.',
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'hakbang-invoice-may-2027-demo.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <>
      <PageHead
        title="Hires and billing"
        sub="May 2027"
        actions={
          <Button variant="secondary" size="md" icon={Download} onClick={download}>
            Download invoice
          </Button>
        }
      />
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Kpi label="Confirmed hires" value={String(confirmed.length)} sub="Billed this month" icon={Check} />
        <Kpi label="Waiting for trainee" value={String(waiting.length)} sub="Not billed yet" icon={Clock} />
        <Kpi label="May total" value={peso(total)} sub={`${confirmed.length} hires at the ${peso(PRICING.pilotRate)} pilot rate`} icon={ReceiptText} />
        <Kpi label="Under guarantee" value={String(confirmed.length)} sub={`All within ${PRICING.guaranteeDays} days`} icon={ShieldCheck} />
      </div>
      <div className="mt-5">
        <Table minWidth={860}>
          <thead className="bg-paper">
            <tr>
              <Th>Hire</Th>
              <Th>Start date</Th>
              <Th>Status</Th>
              <Th>Fee</Th>
              <Th>Guarantee</Th>
              <Th> </Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map(({ h, seeker }) => (
              <tr key={h.applicationId} className={cx(seeker.id === 'paolo' && 'bg-mint/40')}>
                <Td>
                  <Person seeker={seeker} sub={h.position} />
                </Td>
                <Td>{h.startDate}</Td>
                <Td>{h.billed ? <StatusPill tone="green">Confirmed</StatusPill> : <StatusPill tone="mango">Waiting for {seeker.firstName} to confirm</StatusPill>}</Td>
                <Td>{h.billed ? peso(h.feePhp) : <span className="text-muted">Not billed</span>}</Td>
                <Td>{h.billed ? `${h.guaranteeDaysLeft ?? PRICING.guaranteeDays} days left` : `Starts ${h.startDate}`}</Td>
                <Td>
                  {h.billed ? (
                    <Button size="sm" variant="secondary" onClick={() => toast.show('Replacement request started (demo). Covered by the 90-day guarantee.')}>
                      Replace hire
                    </Button>
                  ) : (
                    <Button size="sm" variant="secondary" onClick={() => toast.show(`Reminder sent to ${seeker.firstName} (demo).`)}>
                      Remind
                    </Button>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <Note icon={FileText}>One invoice per month with 30-day terms. A hire is billed only after both you and the trainee confirm the contract.</Note>
      {toast.el}
    </>
  );
}
