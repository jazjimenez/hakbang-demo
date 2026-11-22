import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Award, Check, Lock, Plus, ShieldCheck } from 'lucide-react';
import { PageHead } from '../../layouts/EmployerShell';
import { Button, Card, Checkbox, VerifiedBadge, cx } from '../../components/ui';
import { peso, useDemo, useEmployer, useTrack } from '../../store';
import { BLUEHARBOR_ID } from '../../data/seed';
import { COURSES } from '../../data/courses';
import type { Module, Track } from '../../data/types';
import { useToast, Th, Td } from './shared';

/* ---------------- E03 Post an opening / training track (new or edit) ---------------- */

const SKILL_OPTIONS = ['Customer service', 'English communication', 'Basic Excel formulas', 'Data entry', 'Process documentation', 'Typing 35 wpm', 'Call handling', 'Attention to detail'];

const BLANK_MODULES: Module[] = [
  { id: 'm1', title: 'Customer service basics', format: 'Online test', passMark: '80%', due: 'May 15', when: 'Week 1' },
  { id: 'm2', title: 'Ticket handling', format: 'Online reading and test', passMark: '80%', due: 'May 22', when: 'Week 2' },
  { id: 'm3', title: 'Final assessment', format: 'Face-to-face, Ortigas', passMark: 'Pass', due: 'May 29', when: 'Week 3' },
];

export function NewTrack() {
  const nav = useNavigate();
  const { trackId } = useParams();
  const bh = useEmployer(BLUEHARBOR_ID)!;
  const existing = useTrack(trackId);
  const upsert = useDemo((s) => s.upsertTrack);
  const approve = useDemo((s) => s.approveEmployer);
  const toast = useToast();
  const [id] = useState(() => existing?.id ?? `bh-${Date.now().toString(36)}`);
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState(existing?.title ?? 'Customer Service Associate Track');
  const [location, setLocation] = useState(existing?.location ?? 'Ortigas Center, Pasig');
  const [position, setPosition] = useState(existing?.job?.position ?? 'Customer Service Associate');
  const [salaryMin, setSalaryMin] = useState(String(existing?.job?.salaryMin ?? 19000));
  const [salaryMax, setSalaryMax] = useState(String(existing?.job?.salaryMax ?? 23000));
  const [jobType, setJobType] = useState(existing?.job?.type ?? 'Regular, full-time');
  const [skills, setSkills] = useState<string[]>(existing?.requiredSkills.length ? existing.requiredSkills : ['Customer service', 'English communication']);
  const [prep, setPrep] = useState<string[]>(existing?.prepCourseIds ?? ['cs-essentials']);
  const [modules, setModules] = useState<Module[]>(existing?.modules.length ? existing.modules : BLANK_MODULES);
  const [weeks, setWeeks] = useState(String(existing?.lengthWeeks ?? 3));
  const [sessions, setSessions] = useState(existing?.scheduleLong ?? 'Sat–Sun, 9 AM to 3 PM');
  const [allowance, setAllowance] = useState(String(existing?.allowancePhp ?? 2000));
  const [slots, setSlots] = useState(String(existing?.slots ?? 15));
  const [commit, setCommit] = useState(true);
  const live = existing?.status === 'live';
  const num = (v: string) => Number(v.replace(/[^\d]/g, '')) || 0;

  const build = (status: Track['status']): Track => ({
    id,
    employerId: BLUEHARBOR_ID,
    title,
    shortTitle: title.replace(/ Track$/, ''),
    location,
    locationShort: location.split(',')[0],
    lengthWeeks: num(weeks) || 3,
    allowancePhp: num(allowance) || undefined,
    schedule: sessions.split(',')[0],
    scheduleLong: sessions,
    slots: num(slots) || 15,
    status,
    hiringCommitment: 'regular',
    criteria: ['crit.score80', 'crit.f2f', 'crit.attendance'],
    modules,
    startDate: 'May 15, 2027',
    requiredSkills: skills,
    // Paolo's demo match for a new BlueHarbor track: same location, weekend schedule
    match: { total: 80, skills: 0.75, location: 0.95, schedule: 1 },
    job: { position, salaryMin: num(salaryMin), salaryMax: num(salaryMax), type: jobType },
    prepCourseIds: prep,
    createdInDemo: existing?.createdInDemo ?? !existing,
  });

  const steps = ['Role, job and skills', 'Modules and schedule', 'Hiring terms and publish'];
  const input = 'mt-1.5 w-full h-12 rounded-input border-[1.5px] border-ink/25 px-3.5 text-body bg-cream focus:border-ink';
  const field = (label: string, value: string, set: (v: string) => void, opts?: { span?: boolean; prefix?: string }) => (
    <label className={cx('block', opts?.span && 'sm:col-span-2')}>
      <span className="text-caption text-muted">{label}</span>
      <input className={input} value={value} onChange={(e) => set(e.target.value)} />
    </label>
  );

  return (
    <>
      <PageHead
        title={existing ? `Edit: ${existing.shortTitle}` : 'Post a new opening'}
        sub="A training track with a job at the end. Job seekers see the job, the pay and the hiring terms before they apply."
        actions={
          <Button
            variant="secondary"
            onClick={() => {
              upsert(build(live ? 'live' : 'draft'));
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
                <span className={cx('w-7 h-7 rounded-full flex items-center justify-center text-caption border-[1.5px] border-ink', st === 'next' ? 'bg-cream text-muted' : 'bg-green text-white')}>
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
          {step === 1 && (
            <>
              <Card className="p-6">
                <h2 className="text-h-s">The training</h2>
                <div className="mt-4 grid sm:grid-cols-2 gap-4">
                  {field('Track title', title, setTitle, { span: true })}
                  {field('Training location', location, setLocation)}
                  {field('Slots', slots, setSlots)}
                </div>
              </Card>
              <Card className="p-6">
                <h2 className="text-h-s">The job at the end</h2>
                <p className="mt-1 text-body-s text-muted">Shown on the track so job seekers know exactly what they’re training for.</p>
                <div className="mt-4 grid sm:grid-cols-2 gap-4">
                  {field('Position', position, setPosition)}
                  {field('Employment type', jobType, setJobType)}
                  {field('Monthly salary from (₱)', salaryMin, setSalaryMin)}
                  {field('Monthly salary to (₱)', salaryMax, setSalaryMax)}
                </div>
              </Card>
              <Card className="p-6">
                <h2 className="text-h-s">Skills you’ll match on</h2>
                <p className="mt-1 text-body-s text-muted">Matching uses skills, location and schedule only. Name and school never count.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {SKILL_OPTIONS.map((s) => {
                    const on = skills.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        aria-pressed={on}
                        onClick={() => setSkills(on ? skills.filter((x) => x !== s) : [...skills, s])}
                        className={cx('inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full text-label border-[1.5px] focus-ring', on ? 'bg-ink text-cream border-ink' : 'bg-cream border-ink/25')}
                      >
                        {on && <Check size={14} aria-hidden />}
                        {s}
                      </button>
                    );
                  })}
                </div>
                <h3 className="mt-5 text-title">Recommend prep courses (Hakbang Learn)</h3>
                <p className="mt-1 text-body-s text-muted">Applicants who finish these get the skills on their profile, and you see the certificate.</p>
                <div className="mt-3 grid sm:grid-cols-2 gap-2">
                  {COURSES.map((c) => (
                    <Checkbox key={c.id} checked={prep.includes(c.id)} onChange={(v) => setPrep(v ? [...prep, c.id] : prep.filter((x) => x !== c.id))}>
                      <span className="font-semibold">{c.title}</span> <span className="text-muted">· {c.providerName}</span>
                    </Checkbox>
                  ))}
                </div>
              </Card>
            </>
          )}
          {step === 2 && (
            <>
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-h-s">Modules</h2>
                  <span className="text-caption text-muted">Trainees see these in order. Training runs on your side; you post results.</span>
                </div>
                <div className="mt-4 border-[1.5px] border-ink rounded-[16px] overflow-x-auto">
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
                              className="w-full bg-transparent focus:bg-paper rounded px-1"
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
                  className="mt-3 w-full h-11 rounded-[14px] border-2 border-dashed border-ink/25 text-label text-green flex items-center justify-center gap-1.5 hover:border-green focus-ring"
                >
                  <Plus size={16} aria-hidden /> Add module
                </button>
              </Card>
              <Card className="p-6">
                <h2 className="text-h-s">Schedule and support</h2>
                <div className="mt-4 grid sm:grid-cols-4 gap-4">
                  {field('Length (weeks)', weeks, setWeeks)}
                  {field('Sessions', sessions, setSessions)}
                  {field('Allowance (₱ total)', allowance, setAllowance)}
                  {field('Slots', slots, setSlots)}
                </div>
              </Card>
            </>
          )}
          {step === 3 && (
            <Card className="p-6 space-y-5">
              <div>
                <h2 className="text-h-s">Hiring commitment</h2>
                <p className="mt-2 text-body-s text-muted">Shown to job seekers above the Apply button (decision D4).</p>
                <div className="mt-3 rounded-[16px] border-[1.5px] border-green bg-mint p-4 text-body-s">
                  {bh.name} will hire every trainee who passes as <b>{position}</b>, {jobType.toLowerCase()}, at {peso(num(salaryMin))}–{peso(num(salaryMax))} a month, with SSS, PhilHealth and Pag-IBIG.
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
              {!bh.verified && (
                <div className="flex flex-wrap items-center gap-3 bg-mango-tint text-mango-ink rounded-[14px] px-4 py-3 text-body-s">
                  <Lock size={16} aria-hidden />
                  <span className="flex-1">Publishing unlocks after Hakbang verifies your company (decision D7). Your draft is safe.</span>
                  <button
                    type="button"
                    onClick={() => {
                      approve(BLUEHARBOR_ID);
                      toast.show('Demo: Hakbang admin approved BlueHarbor.');
                    }}
                    className="underline font-semibold focus-ring rounded"
                  >
                    Demo: approve now
                  </button>
                </div>
              )}
            </Card>
          )}
          <div className="flex justify-end gap-3">
            {step > 1 && (
              <Button variant="secondary" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)} data-guide="post-next">
                Next: {steps[step].toLowerCase()}
              </Button>
            ) : (
              <Button
                icon={bh.verified ? undefined : Lock}
                disabled={!bh.verified || !commit}
                data-guide="post-publish"
                onClick={() => {
                  upsert(build('live'));
                  nav('/employer/tracks', { state: { published: id } });
                }}
              >
                {live ? 'Save and keep live' : 'Publish opening'}
              </Button>
            )}
          </div>
        </div>
        {/* live preview */}
        <div className="rounded-card bg-deep p-5 text-white border-[1.5px] border-ink shadow-brut-lime xl:sticky xl:top-6">
          <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-lime">How job seekers will see it</div>
          <div className="mt-3 bg-cream text-ink rounded-[14px] border-[1.5px] border-ink p-4">
            <div className="text-h-s font-display">{title}</div>
            <VerifiedBadge className="mt-2" />
            <div className="mt-2 text-caption text-muted">
              {weeks} weeks{num(allowance) ? `, ${peso(num(allowance))} allowance` : ''}, {sessions.split(',')[0]}, {location.split(',')[0]}
            </div>
            <div className="mt-3 rounded-[10px] bg-mint px-3 py-2">
              <div className="font-mono text-[10px] uppercase tracking-wider text-green">Job waiting</div>
              <div className="text-label">{position}</div>
              <div className="text-caption">
                {peso(num(salaryMin))}–{peso(num(salaryMax))}/month · {jobType}
              </div>
            </div>
            {prep.length > 0 && (
              <div className="mt-2 flex items-center gap-1.5 text-caption text-muted">
                <Award size={13} aria-hidden /> {prep.length} prep course{prep.length > 1 ? 's' : ''}
              </div>
            )}
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-caption text-white/75">
            <ShieldCheck size={14} aria-hidden /> {bh.verified ? 'Verified: you can publish' : 'Verification pending'}
          </p>
        </div>
      </div>
      {toast.el}
    </>
  );
}
