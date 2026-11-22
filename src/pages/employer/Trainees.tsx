import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Check, ShieldCheck, Star } from 'lucide-react';
import { PageHead } from '../../layouts/EmployerShell';
import { Avatar, Button, Card, Checkbox, CloseButton, IconTile, LaunchTag, Modal, StatusPill, cx } from '../../components/ui';
import { isPassed, peso, useDemo, useTrack } from '../../store';
import { PRICING, UNLISTED_ON_TRACK } from '../../data/seed';
import type { Application, Module } from '../../data/types';
import { type Row, useTrackRows, atRisk, inCohort, useToast, Th, Td, Table, Tabs, Person, Note, scoreCell , ComposeModal, type ComposeSpec } from './shared';

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
  const [compose, setCompose] = useState<ComposeSpec | null>(null);
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
        <Button size="sm" onClick={() => nav(`/employer/trainees/${a.id}/hire`)} data-guide={r.seeker.id === 'paolo' ? 'hire-paolo' : undefined}>
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
        <Button
          size="sm"
          variant="secondary"
          onClick={() =>
            setCompose({
              title: `Message ${r.seeker.firstName}`,
              to: r.seeker.name,
              text: `Hi ${r.seeker.firstName}, we missed you at Saturday's session. Your Module 2 retake is due Apr 24. Can we help you catch up? Reply here and we'll set a time.`,
              send: 'Send message',
              done: `Message sent to ${r.seeker.firstName}.`,
            })
          }
        >
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
            <Button
              size="md"
              onClick={() =>
                setCompose({
                  title: 'Weekly report to trainees',
                  to: 'All 20 trainees, Back Office Associate batch 1',
                  text: 'Week 3 of 4 is done. Module 2 test closes Saturday Apr 24, 11:59 PM (80% to pass). Face-to-face assessment is May 1 at BlueHarbor Ortigas, bring a valid ID. You are doing great, keep going!',
                  send: 'Send report',
                  done: 'Weekly report sent to all trainees.',
                })
              }
            >
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
      {compose && <ComposeModal spec={compose} onClose={() => setCompose(null)} onSent={toast.show} />}
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
  const input = 'mt-1.5 w-full h-12 rounded-input border border-line px-3.5 text-body bg-white focus:border-green';
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
          data-guide="hire-paolo"
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
        <textarea value={note} maxLength={200} onChange={(e) => setNote(e.target.value)} rows={2} className="mt-1.5 w-full rounded-input border-2 border-green px-3.5 py-3 text-body" />
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
