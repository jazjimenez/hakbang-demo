import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Lock, Plus } from 'lucide-react';
import { PageHead } from '../../layouts/EmployerShell';
import { Button, Card, Checkbox, VerifiedBadge, cx } from '../../components/ui';
import { useDemo, useEmployer, useTrack } from '../../store';
import { BLUEHARBOR_ID } from '../../data/seed';
import type { Module } from '../../data/types';
import { useToast, Th, Td } from './shared';

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
