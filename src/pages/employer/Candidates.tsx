import { useState } from 'react';
import { Lock, ShieldCheck } from 'lucide-react';
import { PageHead } from '../../layouts/EmployerShell';
import { Button, ProgressBar, StatusPill, cx } from '../../components/ui';
import { useDemo } from '../../store';
import { UNLISTED_ON_TRACK } from '../../data/seed';
import { useTrackRows, inCohort, Th, Td, Table, Tabs, Person, Note } from './shared';

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
