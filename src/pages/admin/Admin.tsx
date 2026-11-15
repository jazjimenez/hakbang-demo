import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Flag } from 'lucide-react';
import { PageHead } from '../../layouts/EmployerShell';
import { Button, Card, StatusPill, Toast, cx } from '../../components/ui';
import { useDemo } from '../../store';
import type { VerificationChecklist } from '../../data/types';

const ROWS: [keyof VerificationChecklist, string, (ok: boolean) => string][] = [
  ['bir2303', 'BIR Certificate of Registration (Form 2303)', (ok) => (ok ? 'TIN and registered name match the application' : 'Not uploaded yet')],
  ['secOrDti', 'SEC registration', (ok) => (ok ? 'Company registration number matches' : 'Not uploaded yet')],
  ['businessPermit', 'Mayor’s or business permit', (ok) => (ok ? '2027 permit uploaded, valid until Dec 31, 2027' : 'Not uploaded yet')],
  ['termsReviewed', 'Track hiring terms reviewed', () => 'Commitment to hire, allowance, and criteria are clear. No fees charged to trainees.'],
  ['partnerAgreement', 'Partner agreement signed', (ok) => (ok ? 'E-signed by Carla Mendoza' : 'Sent Mar 1, waiting for e-signature')],
];

/* ---------------- A01 Verification queue ---------------- */

export function Queue() {
  const employers = useDemo((s) => s.employers);
  const setV = useDemo((s) => s.setVerification);
  const approve = useDemo((s) => s.approveEmployer);
  const hold = useDemo((s) => s.holdEmployer);
  const setRole = useDemo((s) => s.setRole);
  const nav = useNavigate();
  const [selId, setSelId] = useState(employers[0].id);
  const [note, setNote] = useState('Please upload your 2027 business permit to finish verification.');
  const [toast, setToast] = useState<string | null>(null);
  const sel = employers.find((e) => e.id === selId)!;
  const docs = (e: (typeof employers)[number]) => (['bir2303', 'secOrDti', 'businessPermit', 'partnerAgreement'] as const).filter((k) => e.verification[k]).length;
  const pending = employers.filter((e) => !e.verified || !e.verification.termsReviewed);

  return (
    <>
      <PageHead title="Verification queue" sub={`${pending.length} employers waiting. Target: 2 business days. Includes annual 2027 permit renewals.`} />
      <div className="grid xl:grid-cols-[340px_1fr] gap-5 items-start">
        <Card className="overflow-hidden">
          <ul className="divide-y divide-line">
            {employers.map((e) => (
              <li key={e.id}>
                <button
                  type="button"
                  aria-current={e.id === selId ? 'true' : undefined}
                  onClick={() => setSelId(e.id)}
                  className={cx('w-full text-left flex items-center gap-3 px-4 py-4 focus-ring', e.id === selId ? 'bg-mint border-l-4 border-green' : 'hover:bg-paper border-l-4 border-transparent')}
                >
                  <div className="flex-1">
                    <div className="text-label">{e.legalName.replace(/ (Inc\.|Corp\.)$/, '')}</div>
                    <div className="text-caption text-muted">
                      Submitted {e.submittedAt} · {e.verified && e.verification.termsReviewed ? 'Verified' : e.verified ? 'Renewal' : 'Pending'}
                    </div>
                  </div>
                  {e.verified && e.verification.termsReviewed ? (
                    <StatusPill tone="green">Verified</StatusPill>
                  ) : (
                    <StatusPill tone={docs(e) === 4 ? 'mint' : e.id === selId ? 'green' : 'grey'}>{docs(e)} of 4 docs</StatusPill>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <span className="w-12 h-12 rounded-[12px] text-white flex items-center justify-center text-label" style={{ background: sel.tile }}>
              {sel.initials}
            </span>
            <div className="flex-1">
              <h2 className="text-h-m">{sel.legalName}</h2>
              <p className="text-body-s text-muted">
                {sel.industry}, {sel.address}. Contact: {sel.contact}
              </p>
            </div>
            {sel.verified && sel.verification.termsReviewed && <StatusPill tone="green">Verified</StatusPill>}
          </div>
          <ul className="mt-5 space-y-3">
            {ROWS.map(([k, l, sub]) => {
              const ok = sel.verification[k];
              return (
                <li key={k}>
                  <label className={cx('flex items-center gap-3.5 rounded-[14px] px-4 py-3.5 cursor-pointer border', ok ? 'bg-mint border-mint' : 'bg-white border-line')}>
                    <input type="checkbox" className="sr-only peer" checked={ok} onChange={(e) => setV(sel.id, k, e.target.checked)} />
                    <span
                      className={cx(
                        'w-[22px] h-[22px] rounded-[6px] flex items-center justify-center shrink-0 border-2 peer-focus-visible:ring-2 peer-focus-visible:ring-green peer-focus-visible:ring-offset-2',
                        ok ? 'bg-green border-green text-white' : 'border-muted/50 bg-white',
                      )}
                      aria-hidden
                    >
                      {ok && <Check size={14} strokeWidth={3} />}
                    </span>
                    <span>
                      <span className="block text-label">{l}</span>
                      <span className="block text-caption text-muted">{sub(ok)}</span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
          <label className="block mt-5">
            <span className="text-caption text-muted">Note to employer</span>
            <input value={note} onChange={(e) => setNote(e.target.value)} className="mt-1.5 w-full h-12 rounded-input border border-line px-3.5 text-body focus:outline-none focus:border-green" />
          </label>
          <div className="mt-5 flex flex-wrap justify-end gap-3">
            <Button variant="danger" onClick={() => setToast('Rejected (demo). The employer is notified with your note.')}>
              Reject
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                hold(sel.id);
                setToast(`${sel.name} put on hold. Note sent.`);
              }}
            >
              Put on hold
            </Button>
            <Button
              data-guide={sel.id === 'blueharbor' ? 'approve' : undefined}
              onClick={() => {
                approve(sel.id);
                setToast(`${sel.name} approved and verified.`);
              }}
            >
              Approve and verify
            </Button>
          </div>
          {sel.id === 'blueharbor' && sel.verified && sel.verification.termsReviewed && (
            <p className="mt-4 text-body-s text-right">
              <button
                type="button"
                className="text-green underline focus-ring rounded"
                onClick={() => {
                  setRole('employer');
                  nav('/employer/verify');
                }}
              >
                See it as Carla: “Post a track” is unlocked →
              </button>
            </p>
          )}
        </Card>
      </div>
      <Toast message={toast} onDone={() => setToast(null)} />
    </>
  );
}

/* ---------------- Reports (from job seekers) ---------------- */

export function Reports() {
  const reports = useDemo((s) => s.reports);
  const tracks = useDemo((s) => s.tracks);
  return (
    <>
      <PageHead title="Reports" sub="Every report is reviewed within 48 hours. Employers who ask for money are removed." />
      {reports.length === 0 ? (
        <Card className="p-10 text-center">
          <Flag size={28} className="mx-auto text-muted" aria-hidden />
          <p className="mt-3 text-body text-muted">No reports yet. Reports submitted from the job seeker app appear here.</p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <ul className="divide-y divide-line">
            {[...reports].reverse().map((r) => (
              <li key={r.id} className="px-5 py-4 flex gap-4 items-start">
                <span className="w-9 h-9 rounded-[10px] bg-red-tint text-red flex items-center justify-center shrink-0">
                  <Flag size={17} aria-hidden />
                </span>
                <div className="flex-1">
                  <div className="text-label">{r.reason}</div>
                  <div className="text-caption text-muted">
                    Paolo Reyes · {r.at}
                    {r.trackId && ` · ${tracks.find((t) => t.id === r.trackId)?.title ?? ''}`}
                  </div>
                  {r.details && <p className="mt-1.5 text-body-s">{r.details}</p>}
                </div>
                <StatusPill tone="mango">Due in 48h</StatusPill>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}

export function Employers() {
  const employers = useDemo((s) => s.employers);
  return (
    <>
      <PageHead title="Employers" sub="Pilot partners in Metro Manila." />
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead className="bg-paper text-caption text-muted">
            <tr>
              <th className="text-left font-medium px-4 py-3">Company</th>
              <th className="text-left font-medium px-4 py-3">Industry</th>
              <th className="text-left font-medium px-4 py-3">Contact</th>
              <th className="text-left font-medium px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line text-body-s">
            {employers.map((e) => (
              <tr key={e.id}>
                <td className="px-4 py-3.5 text-label">{e.legalName}</td>
                <td className="px-4 py-3.5">{e.industry}</td>
                <td className="px-4 py-3.5">{e.contact}</td>
                <td className="px-4 py-3.5">{e.verified ? <StatusPill tone="green">Verified</StatusPill> : <StatusPill tone="mango">Pending</StatusPill>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

export function AdminTracks() {
  const tracks = useDemo((s) => s.tracks);
  const employers = useDemo((s) => s.employers);
  return (
    <>
      <PageHead title="Tracks" sub="Every track must come from a verified employer before it goes live." />
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead className="bg-paper text-caption text-muted">
            <tr>
              <th className="text-left font-medium px-4 py-3">Track</th>
              <th className="text-left font-medium px-4 py-3">Employer</th>
              <th className="text-left font-medium px-4 py-3">Slots</th>
              <th className="text-left font-medium px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line text-body-s">
            {tracks.map((t) => (
              <tr key={t.id}>
                <td className="px-4 py-3.5 text-label">{t.title}</td>
                <td className="px-4 py-3.5">{employers.find((e) => e.id === t.employerId)?.name}</td>
                <td className="px-4 py-3.5">{t.slots}</td>
                <td className="px-4 py-3.5">{t.status === 'live' ? <StatusPill tone="green">Live</StatusPill> : <StatusPill tone="grey">Draft</StatusPill>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
