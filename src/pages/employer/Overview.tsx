import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Check, ChevronRight, FileText, Lock, Plus, Route as RouteIcon, Star, Users } from 'lucide-react';
import { PageHead } from '../../layouts/EmployerShell';
import { Button, Card, IconTile, StatusPill } from '../../components/ui';
import { useDemo, useEmployer, useTrack } from '../../store';
import { BLUEHARBOR_ID, PRICING, UNLISTED_ON_TRACK } from '../../data/seed';
import { useTrackRows, atRisk, inCohort, Th, Td, Table, Kpi } from './shared';

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
