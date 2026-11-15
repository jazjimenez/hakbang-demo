import { Link, useNavigate } from 'react-router-dom';
import { Check, ChevronRight, Clock, Lock, PhilippinePeso, Plus } from 'lucide-react';
import { PageHead } from '../../layouts/EmployerShell';
import { Button, Card, IconTile, ProgressBar, StatusPill } from '../../components/ui';
import { peso, useDemo, useEmployer } from '../../store';
import { BLUEHARBOR_ID, PRICING } from '../../data/seed';
import type { VerificationChecklist } from '../../data/types';

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
