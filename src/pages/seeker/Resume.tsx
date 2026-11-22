import { Fragment, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, BookOpen, Check, ChevronRight, Sparkles } from 'lucide-react';
import { MobileFooter } from '../../layouts/SeekerShell';
import { Button, LaunchTag, ScoreRing, TopBar, cx, useIsDesktop } from '../../components/ui';
import { useT } from '../../i18n';
import { useDemo, usePaolo } from '../../store';

/**
 * Resume content stays in English in both languages (resumes are written in English).
 * D6: the AI never invents numbers — rewrites use [number] placeholders the user fills in.
 */
const FIXES = [
  {
    key: 'resume.fix1',
    sub: 'resume.fix1D',
    why: 'resume.fix1Why',
    before: 'Assisted customers at the store and handled returns.',
    after: ['Assisted ', null, ' customers a day and processed ', null, ' returns and exchanges per week.'] as (string | null)[],
  },
  {
    key: 'resume.fix2',
    sub: 'resume.fix2D',
    why: 'resume.fix2Why',
    before: 'Skills: Customer service, MS Word, English communication.',
    after: ['Skills: Customer service, MS Word, MS Excel (basic formulas), data entry, documentation, English communication.'],
  },
  {
    key: 'resume.fix3',
    sub: 'resume.fix3D',
    why: 'resume.fix3Why',
    before:
      'I am a hardworking and passionate fresh graduate who is eager to learn new things and grow in a company where I can apply my knowledge and skills, and contribute to the success of the organization while developing myself professionally.',
    after: ['Business Administration graduate with retail customer service experience. Looking for a back-office role where accuracy and clear documentation matter.'],
  },
];

const useScore = () => {
  const fixes = useDemo((s) => s.resumeFixes);
  return { fixes, score: 72 + fixes.length * 6 };
};

function filledText(parts: (string | null)[], values: string[]) {
  let i = 0;
  return parts.map((p) => (p === null ? (values[i++]?.trim() || '[number]') : p)).join('');
}

function ResumePreview({ values }: { values: Record<number, string[]> }) {
  const p = usePaolo();
  const { fixes } = useScore();
  const custom = useDemo((s) => s.resumeCustom);
  const line = (n: number) => (!fixes.includes(n) ? FIXES[n].before : custom[n] ?? filledText(FIXES[n].after, values[n] ?? []));
  return (
    <article className="bg-cream border-[1.5px] border-ink rounded-panel shadow-brut p-8 shadow-float text-[13px] leading-[19px] font-sans" lang="en" aria-label="Resume preview">
      <h2 className="font-display font-bold text-[22px]">{p.name}</h2>
      <p className="text-muted">
        {p.city} · {p.email} · +63 917 ••• 4821
      </p>
      <h3 className="mt-5 text-label uppercase tracking-wide text-green font-sans">Objective</h3>
      <p className={cx('mt-1', fixes.includes(2) && 'bg-mint rounded px-1')}>{line(2)}</p>
      <h3 className="mt-4 text-label uppercase tracking-wide text-green font-sans">Experience</h3>
      <p className="mt-1 font-semibold">Sales Associate, SM Megamall (part-time)</p>
      <p className="text-muted">Jun 2024 – Jan 2025</p>
      <ul className="mt-1 list-disc pl-5">
        <li className={cx(fixes.includes(0) && 'bg-mint rounded px-1')}>{line(0)}</li>
        <li>Kept the stock room organised and helped with weekly inventory counts.</li>
      </ul>
      <h3 className="mt-4 text-label uppercase tracking-wide text-green font-sans">Education</h3>
      <p className="mt-1">
        {p.course}, {p.school}, {p.gradYear}
      </p>
      <h3 className="mt-4 text-label uppercase tracking-wide text-green font-sans">Skills</h3>
      <p className={cx('mt-1', fixes.includes(1) && 'bg-mint rounded px-1')}>{line(1)}</p>
    </article>
  );
}

function ReviewBody() {
  const t = useT();
  const nav = useNavigate();
  const p = usePaolo();
  const { fixes, score } = useScore();
  const open = FIXES.map((_, i) => i).filter((i) => !fixes.includes(i));
  return (
    <div className="space-y-4">
      <div className="bg-cream border-[1.5px] border-ink rounded-card shadow-brut-sm px-4 py-3.5 flex items-center justify-between">
        <div>
          <div className="text-caption text-muted">{t('resume.preferred')}</div>
          <div className="text-title">{p.preferredJob}</div>
        </div>
        <Link to="/matches" className="text-label text-green focus-ring rounded">
          {t('resume.change')}
        </Link>
      </div>
      <div className="bg-cream border-[1.5px] border-ink rounded-card shadow-brut-sm p-4 flex items-center gap-4">
        <ScoreRing value={score / 100} size={84} stroke={10} label={score} />
        <div>
          <div className="text-h-s font-display">{t('resume.score', { n: score })}</div>
          <div className="text-body-s text-muted">{t('resume.scoreD', { a: open.length })}</div>
        </div>
      </div>
      <section className="bg-cream border-[1.5px] border-ink rounded-card shadow-brut-sm px-4 pt-3">
        <h2 className="text-label text-green font-sans">{t('resume.working')}</h2>
        <ul className="divide-y divide-line">
          <li className="flex items-start gap-3 py-3">
            <span className="w-7 h-7 rounded-full bg-mint text-green flex items-center justify-center shrink-0">
              <Check size={15} aria-hidden />
            </span>
            <div>
              <div className="text-body font-semibold">{t('resume.working1')}</div>
              <div className="text-caption text-muted">{t('resume.working1D')}</div>
            </div>
          </li>
          {fixes.map((i) => (
            <li key={i} className="flex items-start gap-3 py-3">
              <span className="w-7 h-7 rounded-full bg-mint text-green flex items-center justify-center shrink-0">
                <Check size={15} aria-hidden />
              </span>
              <div className="text-body text-muted line-through decoration-1">{t(FIXES[i].key)}</div>
            </li>
          ))}
        </ul>
      </section>
      {open.length > 0 && (
        <section className="bg-cream border-[1.5px] border-ink rounded-card shadow-brut-sm px-4 pt-3">
          <h2 className="text-label text-mango-ink font-sans">{t('resume.fix')}</h2>
          <ul className="divide-y divide-line">
            {open.map((i) => (
              <li key={i}>
                <Link to={`/resume-review/fix/${i + 1}`} className="flex items-center gap-3 py-3 focus-ring rounded">
                  <span className="w-7 h-7 rounded-full bg-mango-tint text-mango flex items-center justify-center shrink-0">
                    <AlertCircle size={16} aria-hidden />
                  </span>
                  <div className="flex-1">
                    <div className="text-body font-semibold">{t(FIXES[i].key)}</div>
                    <div className="text-caption text-muted">{t(FIXES[i].sub)}</div>
                  </div>
                  <ChevronRight size={18} className="text-muted" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <section className="bg-cream border-[1.5px] border-ink rounded-card shadow-brut-sm px-4 pt-3">
        <h2 className="text-label text-muted font-sans">{t('resume.missing')}</h2>
        <ul className="divide-y divide-line">
          <li>
            <Link to="/tracks/back-office/skill-gap" className="flex items-center gap-3 py-3 focus-ring rounded">
              <BookOpen size={20} className="text-green" aria-hidden />
              <div className="flex-1">
                <div className="text-body font-semibold">Basic Excel formulas</div>
                <div className="text-caption text-muted">{t('resume.missing1D')}</div>
              </div>
              <ChevronRight size={18} className="text-muted" aria-hidden />
            </Link>
          </li>
          <li className="flex items-center gap-3 py-3">
            <BookOpen size={20} className="text-green" aria-hidden />
            <div>
              <div className="text-body font-semibold">{t('resume.missing2')}</div>
              <div className="text-caption text-muted">{t('resume.missing2D')}</div>
            </div>
          </li>
        </ul>
      </section>
      <p className="flex items-center gap-2 text-caption text-muted">
        <Sparkles size={14} aria-hidden /> {t('resume.ai')}
      </p>
      {open.length > 0 && (
        <Button block className="lg:hidden" onClick={() => nav(`/resume-review/fix/${open[0] + 1}`)}>
          {t('resume.start')}
        </Button>
      )}
    </div>
  );
}

/* ---------------- S17 / D08 ---------------- */

export function ResumeReview() {
  const t = useT();
  const nav = useNavigate();
  const desktop = useIsDesktop();
  const { fixes } = useScore();
  const open = FIXES.map((_, i) => i).filter((i) => !fixes.includes(i));
  const values = useDemo((s) => s.resumeValues);
  if (desktop)
    return (
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-display">{t('resume.top')}</h1>
          <LaunchTag />
        </div>
        <p className="mt-2 text-body text-muted">{t('resume.forJob')}</p>
        <div className="mt-6 grid grid-cols-[1fr_440px] gap-8 items-start">
          <ResumePreview values={values} />
          <div>
            <ReviewBody />
            {open.length > 0 && (
              <Button block className="mt-4" onClick={() => nav(`/resume-review/fix/${open[0] + 1}`)}>
                {t('resume.start')}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  return (
    <div className="flex-1">
      <TopBar title={t('resume.top')} back="/profile" tag={<LaunchTag />} />
      <div className="px-5 pb-8">
        <ReviewBody />
      </div>
    </div>
  );
}

/* ---------------- S18 Fix detail ---------------- */

export function ResumeFix() {
  const t = useT();
  const nav = useNavigate();
  const desktop = useIsDesktop();
  const n = Math.min(3, Math.max(1, Number(useParams().n) || 1));
  const fix = FIXES[n - 1];
  const { fixes } = useScore();
  const apply = useDemo((s) => s.applyResumeFix);
  const saved = useDemo((s) => s.resumeValues[n - 1]);
  const setValues = useDemo((s) => s.setResumeValues);
  const setCustomStore = useDemo((s) => s.setResumeCustom);
  const holes = fix.after.filter((x) => x === null).length;
  const [vals, setVals] = useState<string[]>(saved ?? Array(holes).fill(''));
  const [editing, setEditing] = useState(false);
  const [custom, setCustom] = useState(filledText(fix.after, vals));
  const done = fixes.includes(n - 1);
  const next = () => {
    const remaining = FIXES.map((_, i) => i).filter((i) => !fixes.includes(i) && i !== n - 1);
    nav(remaining.length ? `/resume-review/fix/${remaining[0] + 1}` : '/resume-review');
  };
  const use = () => {
    setValues(n - 1, vals);
    if (editing) setCustomStore(n - 1, custom);
    apply(n - 1);
    next();
  };

  let hole = 0;
  return (
    <div className={cx('flex-1 flex flex-col', desktop && 'max-w-[640px] mx-auto w-full')}>
      <TopBar title={t('resume.fixN', { n })} back="/resume-review" tag={<LaunchTag />} />
      <div className="px-5 pb-6 flex-1">
        <div className="flex gap-1.5" aria-hidden>
          {[1, 2, 3].map((i) => (
            <span key={i} className={cx('h-1.5 flex-1 rounded-full', i <= n ? 'bg-lime' : 'bg-line')} />
          ))}
        </div>
        <h1 className="mt-4 text-h-l">{t(fix.key)}</h1>
        <p className="mt-2 text-body-s text-muted">{t(fix.why)}</p>
        <div className="mt-5 bg-cream border-[1.5px] border-ink rounded-card shadow-brut-sm p-4" lang="en">
          <div className="text-caption text-muted">{t('resume.now')}</div>
          <p className="mt-2 text-body">{fix.before}</p>
        </div>
        <div className="mt-4 bg-mint border border-green rounded-card p-4">
          <div className="flex items-center gap-1.5 text-caption text-green font-semibold">
            <Sparkles size={14} aria-hidden /> {t('resume.suggestion')}
          </div>
          {editing ? (
            <textarea
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              rows={4}
              aria-label={t('resume.edit')}
              className="mt-2 w-full rounded-input border border-green bg-white p-3 text-body"
              lang="en"
            />
          ) : (
            <p className="mt-2 text-[17px] leading-[26px]" lang="en">
              {fix.after.map((part, i) => {
                if (part !== null) return <Fragment key={i}>{part}</Fragment>;
                const idx = hole++;
                return (
                  <input
                    key={i}
                    aria-label={`${t('resume.fillIn')} ${idx + 1}`}
                    placeholder="[number]"
                    inputMode="numeric"
                    value={vals[idx] ?? ''}
                    onChange={(e) => setVals(vals.map((v, j) => (j === idx ? e.target.value : v)))}
                    className="inline-block w-[92px] mx-0.5 px-1.5 rounded-[6px] border-b-2 border-mango bg-white text-mango-ink font-semibold placeholder:text-mango focus:outline-none focus:ring-2 focus:ring-mango/40"
                  />
                );
              })}
            </p>
          )}
          {holes > 0 && !editing && <p className="mt-3 text-caption font-semibold">{t('resume.replace')}</p>}
        </div>
        {done && (
          <p className="mt-4 text-caption text-green flex items-center gap-1.5">
            <Check size={14} aria-hidden /> {t('resume.applied')}
          </p>
        )}
      </div>
      <MobileFooter className="lg:static lg:border-0 lg:bg-transparent">
        <Button block onClick={use}>
          {editing ? t('review.save') : t('resume.use')}
        </Button>
        <Button block variant="secondary" onClick={() => {
            if (editing) return next();
            setCustom(filledText(fix.after, vals));
            setEditing(true);
          }}>
          {editing ? t('resume.next') : t('resume.edit')}
        </Button>
      </MobileFooter>
    </div>
  );
}
