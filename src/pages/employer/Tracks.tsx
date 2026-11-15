import { Link, useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { PageHead } from '../../layouts/EmployerShell';
import { Button, StatusPill, cx } from '../../components/ui';
import { peso, useDemo } from '../../store';
import { BLUEHARBOR_ID } from '../../data/seed';
import { Table, Td, Th } from './shared';

/** Employer's openings (training tracks with a job at the end). */
export function Tracks() {
  const tracks = useDemo((s) => s.tracks.filter((t) => t.employerId === BLUEHARBOR_ID));
  const apps = useDemo((s) => s.applications);
  const published = (useLocation().state as { published?: string } | null)?.published;
  return (
    <>
      <PageHead
        title="Your openings"
        sub="Each opening is a free training track with a job at the end."
        actions={
          <Button icon={Plus} to="/employer/tracks/new" data-guide="post-open">
            Post a new opening
          </Button>
        }
      />
      <Table minWidth={760}>
        <thead className="bg-paper">
          <tr>
            <Th>Opening</Th>
            <Th>Job and pay</Th>
            <Th>Status</Th>
            <Th>Applicants</Th>
            <Th> </Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {tracks.map((t) => (
            <tr key={t.id} className={cx(t.id === published && 'bg-mint/60')}>
              <Td className="text-label">{t.title}</Td>
              <Td>{t.job ? `${t.job.position} · ${peso(t.job.salaryMin)}–${peso(t.job.salaryMax)}` : '—'}</Td>
              <Td>{t.status === 'live' ? <StatusPill tone="green">Live</StatusPill> : <StatusPill tone="grey">Draft</StatusPill>}</Td>
              <Td>{apps.filter((a) => a.trackId === t.id).length}</Td>
              <Td>
                <Link to={`/employer/tracks/${t.id}/edit`} className="text-green underline focus-ring rounded">
                  Edit
                </Link>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
      {published && <p className="mt-4 text-body-s text-green">Published. Matched job seekers can see it in their Matches now.</p>}
    </>
  );
}
