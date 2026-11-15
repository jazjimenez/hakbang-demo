import { useState } from 'react';
import { Check, Clock, Download, FileText, ReceiptText, ShieldCheck } from 'lucide-react';
import { PageHead } from '../../layouts/EmployerShell';
import { Button, StatusPill, cx } from '../../components/ui';
import { peso, useDemo } from '../../store';
import { PRICING } from '../../data/seed';
import { useToast, Th, Td, Table, Person, Note, Kpi, ComposeModal, type ComposeSpec } from './shared';

/* ---------------- E07 Billing ---------------- */

export function Billing() {
  const hires = useDemo((s) => s.hires);
  const apps = useDemo((s) => s.applications);
  const seekers = useDemo((s) => s.seekers);
  const toast = useToast();
  const [compose, setCompose] = useState<ComposeSpec | null>(null);
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
      'Hakbang demo invoice (fictional),BlueHarbor CX Solutions Inc.,April 2027',
      'Hire,Position,Start date,Fee (PHP)',
      ...confirmed.map((r) => `${r.seeker.name},${r.h.position},${r.h.startDate},${r.h.feePhp}`),
      `Total,,,${total}`,
      'Terms: 30 days. 90-day replacement guarantee on every hire.',
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'hakbang-invoice-april-2027-demo.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <>
      <PageHead
        title="Hires and billing"
        sub="April 2027 · invoice issued Apr 30"
        actions={
          <Button variant="secondary" size="md" icon={Download} onClick={download}>
            Download invoice
          </Button>
        }
      />
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Kpi label="Confirmed hires" value={String(confirmed.length)} sub="Billed this month" icon={Check} />
        <Kpi label="Waiting for trainee" value={String(waiting.length)} sub="Not billed yet" icon={Clock} />
        <Kpi label="April total" value={peso(total)} sub={`${confirmed.length} hires at the ${peso(PRICING.pilotRate)} pilot rate`} icon={ReceiptText} />
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
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        setCompose({
                          title: `Request a replacement for ${seeker.firstName}`,
                          to: 'Hakbang partner team',
                          text: `${seeker.name} (${h.position}) left within the 90-day guarantee. Please match us with the next qualified trainee from the batch. Reason: `,
                          send: 'Request replacement',
                          done: 'Replacement requested. Covered by the 90-day guarantee, no extra fee.',
                        })
                      }
                    >
                      Replace hire
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        setCompose({
                          title: `Remind ${seeker.firstName} to confirm`,
                          to: seeker.name,
                          text: `Hi ${seeker.firstName}! Congratulations again on your hire. Please open Hakbang and confirm that you signed your contract so we can finalise your start on ${h.startDate}.`,
                          send: 'Send reminder',
                          done: `Reminder sent to ${seeker.firstName}.`,
                        })
                      }
                    >
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
      {compose && <ComposeModal spec={compose} onClose={() => setCompose(null)} onSent={toast.show} />}
      {toast.el}
    </>
  );
}
