import { useEffect, useState } from 'react';
import { Award, GraduationCap, Lock, ShieldCheck, Star } from 'lucide-react';
import { PageHead } from '../../layouts/EmployerShell';
import { Avatar, Button, CloseButton, Modal, ProgressBar, StatusPill, cx } from '../../components/ui';
import { useCourseSkills, useDemo } from '../../store';
import { BLUEHARBOR_ID, MAIN_TRACK_ID, PAOLO_ID, UNLISTED_ON_TRACK } from '../../data/seed';
import { boostedMatch, courseById } from '../../data/courses';
import type { Application, JobSeeker } from '../../data/types';
import { useTrackRows, inCohort, Th, Td, Table, Tabs, Person, Note } from './shared';

/* ---------------- E04 Candidates ---------------- */

/** Completed Hakbang Learn courses for any candidate (Paolo's are live in the store). */
function useCertificates(seeker: JobSeeker) {
  const records = useDemo((s) => s.courseRecords);
  return seeker.id === PAOLO_ID ? records.map((r) => ({ id: r.courseId, score: r.score, date: r.completedAt })) : (seeker.certificates ?? []).map((id) => ({ id, score: 100, date: 'Mar 2027' }));
}

function LearningCell({ seeker, onOpen }: { seeker: JobSeeker; onOpen: () => void }) {
  const certs = useCertificates(seeker);
  return (
    <button type="button" onClick={onOpen} className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-full border-[1.5px] border-ink/25 bg-cream text-caption font-semibold hover:border-ink focus-ring" data-guide={seeker.id === PAOLO_ID ? 'candidate-paolo' : undefined}>
      <GraduationCap size={14} className={certs.length ? 'text-green' : 'text-muted'} aria-hidden />
      {certs.length} course{certs.length === 1 ? '' : 's'}
    </button>
  );
}

function CandidateProfile({ seeker, app, onClose }: { seeker: JobSeeker; app: Application; onClose: () => void }) {
  const certs = useCertificates(seeker);
  const markSeen = useDemo((s) => s.markSeen);
  const courseSkills = new Set(certs.flatMap((c) => courseById(c.id)?.skills ?? []));
  useEffect(() => {
    if (seeker.id === PAOLO_ID) markSeen('candidateProfile');
  }, [seeker.id, markSeen]);
  const hidden = app.status === 'applied' || app.status === 'declined';
  return (
    <Modal onClose={onClose} labelledBy="cand-title" width={600}>
      <div className="flex items-start gap-3">
        <Avatar initials={seeker.initials} size={48} />
        <div className="flex-1">
          <h2 id="cand-title" className="text-h-m">
            {seeker.name}
          </h2>
          <p className="text-body-s text-muted">
            {seeker.course}, {seeker.school} {seeker.gradYear} · {seeker.city}
          </p>
          <p className="text-caption text-muted">{hidden ? 'Contact number hidden until you accept (decision D1).' : `+63 917 ••• ${String(1000 + seeker.name.length * 317).slice(-4)}`}</p>
        </div>
        <CloseButton onClick={onClose} />
      </div>
      <h3 className="mt-5 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Skills</h3>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {seeker.skills.map((s) =>
          courseSkills.has(s) ? (
            <span key={s} className="inline-flex items-center gap-1 h-8 px-3 rounded-full bg-mint text-green border-[1.5px] border-green text-caption font-semibold" title="Verified by a completed course">
              <Award size={13} aria-hidden /> {s}
            </span>
          ) : (
            <span key={s} className="inline-flex items-center h-8 px-3 rounded-full border-[1.5px] border-ink/25 text-caption">
              {s}
            </span>
          ),
        )}
      </div>
      <h3 className="mt-5 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Hakbang Learn certificates</h3>
      {certs.length === 0 ? (
        <p className="mt-2 text-body-s text-muted">No courses completed yet.</p>
      ) : (
        <ul className="mt-2 space-y-2" data-testid="candidate-certs">
          {certs.map((c) => {
            const course = courseById(c.id)!;
            return (
              <li key={c.id} className="flex items-center gap-3 rounded-[12px] bg-paper border border-ink/15 px-3.5 py-2.5">
                <span className="w-8 h-8 rounded-full bg-lime border-[1.5px] border-ink flex items-center justify-center shrink-0">
                  <Award size={15} className="text-deep" aria-hidden />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-label truncate">{course.title}</span>
                  <span className="block text-caption text-muted">
                    {course.providerName} · {c.date} · {c.score}% · {course.skills.join(', ')}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      )}
      {app.endorsements.length > 0 && (
        <>
          <h3 className="mt-5 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Endorsements</h3>
          <ul className="mt-2 space-y-1.5">
            {app.endorsements.map((e) => (
              <li key={e.id} className="flex gap-2 text-body-s">
                <Star size={15} className="text-green mt-0.5" aria-hidden /> “{e.note}”
              </li>
            ))}
          </ul>
        </>
      )}
      <p className="mt-5 flex items-center gap-2 bg-mint rounded-[12px] px-3.5 py-2.5 text-caption">
        <ShieldCheck size={15} className="text-green" aria-hidden /> Certificates come from Hakbang Learn and can’t be self-reported.
      </p>
    </Modal>
  );
}

export function Candidates() {
  const myTracks = useDemo((s) => s.tracks.filter((t) => t.employerId === BLUEHARBOR_ID && t.status === 'live'));
  // open on the opening where Paolo is waiting, so the newest applicant is right there
  const paoloWaiting = useDemo((s) => s.applications.find((a) => a.seekerId === PAOLO_ID && a.status === 'applied' && myTracks.some((t) => t.id === a.trackId))?.trackId);
  const [trackId, setTrackId] = useState(paoloWaiting ?? MAIN_TRACK_ID);
  const track = myTracks.find((t) => t.id === trackId) ?? myTracks[0];
  const rows = useTrackRows(track?.id);
  const courseSkills = useCourseSkills();
  const [viewing, setViewing] = useState<string | null>(null);
  const liveMatch = (seekerId: string, a: Application) => (seekerId === PAOLO_ID && track ? boostedMatch(a.match, track.requiredSkills, courseSkills) : a.match);
  const accept = useDemo((s) => s.accept);
  const decline = useDemo((s) => s.decline);
  const [tab, setTab] = useState<'waiting' | 'accepted' | 'declined'>('waiting');
  const [sel, setSel] = useState<string[]>([]);
  const groups = {
    waiting: rows.filter((r) => r.app.status === 'applied'),
    accepted: rows.filter((r) => !['applied', 'declined'].includes(r.app.status) && inCohort(r.app)),
    declined: rows.filter((r) => r.app.status === 'declined'),
  };
  const list = [...groups[tab]].sort((a, b) => liveMatch(b.seeker.id, b.app).total - liveMatch(a.seeker.id, a.app).total);
  const isMain = track?.id === MAIN_TRACK_ID;
  const acceptedTotal = groups.accepted.length + (isMain ? UNLISTED_ON_TRACK : 0);
  const viewRow = rows.find((r) => r.app.id === viewing);
  return (
    <>
      <PageHead
        title="Matched candidates"
        sub={isMain ? `Back Office Associate, batch 1 starts Apr 10. ${Math.min(acceptedTotal, 20)} of 20 slots filled.` : `${track?.title ?? ''}: ${acceptedTotal} of ${track?.slots ?? 0} slots filled.`}
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
      {myTracks.length > 1 && (
        <label className="mb-4 flex items-center gap-3 text-body-s">
          <span className="text-muted">Opening</span>
          <select value={track?.id} onChange={(e) => setTrackId(e.target.value)} className="h-10 rounded-input border-[1.5px] border-ink bg-cream px-3 text-body-s font-semibold">
            {myTracks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </label>
      )}
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
            <Th>Degree</Th>
            <Th>Learning</Th>
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
                <button type="button" onClick={() => setViewing(app.id)} className="text-left rounded focus-ring hover:underline">
                  <Person seeker={seeker} sub={`Applied ${app.appliedAt}`} />
                </button>
              </Td>
              <Td>{seeker.course}</Td>
              <Td>
                <LearningCell seeker={seeker} onOpen={() => setViewing(app.id)} />
              </Td>
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
                  <span className="font-display font-bold text-h-m text-green w-12">{liveMatch(seeker.id, app).total}%</span>
                  <dl className="space-y-0.5 text-caption flex-1">
                    {(
                      [
                        ['Skills', liveMatch(seeker.id, app).skills],
                        ['Location', app.match.location],
                        ['Schedule', app.match.schedule],
                      ] as const
                    ).map(([l, v]) => (
                      <div key={l} className="flex items-center gap-2">
                        <dt className="w-[52px] text-muted">{l}</dt>
                        <dd className="flex-1">
                          <ProgressBar value={v} label={`${seeker.name}: ${l}`} track="bg-line" />
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Td>
              <Td>
                {tab === 'waiting' ? (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => accept(app.id)} data-guide={seeker.id === 'paolo' ? 'accept-paolo' : undefined}>
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
              <td colSpan={9} className="text-center text-muted py-10 text-body-s">
                {tab === 'waiting' ? 'No candidates waiting. New matches appear here when job seekers apply.' : 'Nobody here yet.'}
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      {tab === 'accepted' && isMain && <p className="mt-3 text-caption text-muted">+{UNLISTED_ON_TRACK} more accepted trainees not listed in this demo.</p>}
      {viewRow && <CandidateProfile seeker={viewRow.seeker} app={viewRow.app} onClose={() => setViewing(null)} />}
      <Note icon={ShieldCheck}>Ranked by skills, location, and schedule only. School and name never affect the score.</Note>
    </>
  );
}
