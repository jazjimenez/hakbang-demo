import { useState, type CSSProperties, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Building2, Globe2, Home as HomeIcon, Calendar, Check, Clock, FileText, Flag, MapPin, Minus, PhilippinePeso, Plus, Route as RouteIcon, ShieldCheck, Sparkles, Star, User } from 'lucide-react';
import { Logo, NavBrand, Swoosh } from '../components/Brand';
import { Trail } from '../components/Trail';
import { CountUp, Reveal } from '../components/Motion';
import { Accent, Avatar, Button, Eyebrow, IconTile, LangToggle, MatchBars, Toast, VerifiedBadge, cx } from '../components/ui';
import { useT } from '../i18n';
import { useDemo } from '../store';
import { LFS, PLAN } from '../data/facts';

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('max-w-[1200px] mx-auto px-5 md:px-10 xl:px-0', className)}>{children}</div>;
}

const H2 = 'font-display font-extrabold text-[34px] leading-[36px] lg:text-[52px] lg:leading-[52px] tracking-[-0.035em]';

/* ---------------- Hero staircase ---------------- */

const STEP_H = [120, 215, 310, 405];
const STEP_FILL = ['#0A4A35', '#0D563D', '#0F6345', '#127050'];

function Staircase() {
  const t = useT();
  const labels = ['x.s1', 'x.s2', 'x.s3', 'x.s4'].map((k) => t(k));
  return (
    <div className="absolute left-0 top-0 w-[560px] h-[520px] origin-top-left scale-[0.62] sm:scale-[0.8] lg:scale-[0.9] xl:scale-100" aria-hidden>
      <svg viewBox="0 0 560 520" className="absolute inset-0 w-full h-full overflow-visible">
        <defs>
          <pattern id="hk-hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="10" stroke="#ffffff" strokeOpacity=".05" strokeWidth="4" />
          </pattern>
        </defs>
        {STEP_H.map((h, i) => {
          const last = i === STEP_H.length - 1;
          return (
            <g key={i} className="hk-rise-step" style={d(200 + i * 150)}>
              {/* steps run past the box so they meet the bottom of the hero */}
              <rect x={i * 140} y={520 - h} width={140} height={h + 400} fill={STEP_FILL[i]} />
              <rect x={i * 140} y={520 - h} width={140} height={h + 400} fill="url(#hk-hatch)" />
              <rect x={i * 140} y={520 - h} width={140} height={7} fill="#5DB250" />
              {/* riser seam */}
              {i > 0 && <rect x={i * 140} y={520 - h} width={1.5} height={h + 400} fill="#023B2A" opacity=".55" />}
              {/* floor markings: numerals sit in one clean row, under every card */}
              <text
                x={i * 140 + 14}
                y={482}
                fontFamily="Bricolage Grotesque, sans-serif"
                fontWeight={800}
                fontSize={64}
                letterSpacing={-2}
                fill={last ? '#5DB250' : 'none'}
                stroke={last ? 'none' : '#ffffff'}
                strokeOpacity=".4"
                strokeWidth={1.4}
              >
                0{i + 1}
              </text>
              <rect x={i * 140 + 16} y={494} width={18} height={2} fill={last ? '#5DB250' : '#ffffff'} opacity={last ? 1 : 0.4} />
              <text x={i * 140 + 40} y={499} fontFamily="IBM Plex Mono, monospace" fontWeight={600} fontSize={10.5} letterSpacing={1.6} fill="#ffffff" fillOpacity={last ? 0.95 : 0.6}>
                {labels[i].toUpperCase()}
              </text>
            </g>
          );
        })}
      </svg>

      {/* hand-drawn note */}
      <div className="absolute left-[110px] top-[22px] hk-rise" style={d(1900)}>
        <span className="font-serif italic text-[26px] text-lime leading-none whitespace-nowrap">{t('x.note')}</span>
        <svg width="90" height="44" viewBox="0 0 90 44" className="absolute -right-[96px] top-[2px]" fill="none">
          <path d="M2 28 C 30 2, 60 2, 84 22" stroke="#5DB250" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 6" />
          <path d="M74 14 L85 23 L72 27" stroke="#5DB250" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* each card stands on its own tread (bottom = step height), never over a numeral */}
      <StepCard step={0} left={12} width={220} delay={800}>
        <Avatar initials="PR" size={36} />
        <div>
          <div className="text-label">{t('l.card.profile')}</div>
          <div className="text-caption text-muted">{t('l.card.profileD')}</div>
        </div>
      </StepCard>
      <StepCard step={1} left={152} width={252} delay={1000}>
        <span className="w-9 h-9 rounded-[8px] bg-deep text-white text-caption font-semibold flex items-center justify-center shrink-0">BH</span>
        <div className="flex-1 min-w-0">
          <div className="text-label truncate">Back Office Associate</div>
          <div className="text-caption text-muted flex items-center gap-1">
            BlueHarbor CX <ShieldCheck size={13} className="text-green" aria-label="Verified" />
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono font-semibold text-[19px] text-green leading-[22px]">86%</div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted">{t('match.short')}</div>
        </div>
      </StepCard>
      <StepCard step={2} left={292} width={200} delay={1200}>
        <IconTile icon={Check} size={32} />
        <div>
          <div className="text-label">{t('l.card.passed')}</div>
          <div className="text-caption text-muted">{t('l.card.passedD')}</div>
        </div>
      </StepCard>
      <StepCard step={3} left={372} width={188} delay={1450} lime>
        <IconTile icon={Star} size={32} tone="white" />
        <div>
          <div className="text-label text-deep">{t('l.card.hired')}</div>
          <div className="text-caption text-deep/80">{t('l.card.hiredD')}</div>
        </div>
      </StepCard>
    </div>
  );
}

function StepCard({ step, left, width, delay, lime, children }: { step: number; left: number; width: number; delay: number; lime?: boolean; children: ReactNode }) {
  return (
    <div
      className={cx('absolute rounded-[12px] border-[1.5px] border-ink shadow-brut-sm px-3.5 py-3 text-ink hk-drop flex items-center gap-2.5', lime ? 'bg-lime' : 'bg-cream')}
      style={{ left, width, bottom: STEP_H[step] - 1, '--d': `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

/** Stepped edge between sections: the staircase again, at page scale. */
function StepEdge({ fill, className }: { fill: string; className?: string }) {
  return (
    <svg viewBox="0 0 1440 48" preserveAspectRatio="none" className={cx('block w-full h-[28px] md:h-[48px]', className)} aria-hidden>
      <path d="M0 48 H1440 V0 H1080 V12 H720 V24 H360 V36 H0 Z" fill={fill} />
    </svg>
  );
}

function Ticker() {
  const t = useT();
  const items = ['x.ticker1', 'x.ticker2', 'x.ticker3', 'x.ticker4', 'x.ticker5'].map((k) => t(k));
  const row = (
    <div className="flex shrink-0 items-center">
      {items.map((s) => (
        <span key={s} className="flex items-center gap-6 px-6 font-mono text-[13px] font-semibold uppercase tracking-[0.12em] whitespace-nowrap">
          {s}
          <span className="text-lime" aria-hidden>
            ✦
          </span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="bg-ink text-cream py-3.5 overflow-hidden" role="note" aria-label={items.join(', ')}>
      <div className="hk-marquee" aria-hidden>
        {row}
        {row}
      </div>
    </div>
  );
}

function Stamp() {
  const t = useT();
  return (
    <div className="relative w-[132px] h-[132px] shrink-0" aria-hidden>
      <svg viewBox="0 0 132 132" className="absolute inset-0 hk-spin">
        <defs>
          <path id="hk-stamp-circle" d="M66 66 m-50 0 a50 50 0 1 1 100 0 a50 50 0 1 1 -100 0" />
        </defs>
        <text fontFamily="IBM Plex Mono, monospace" fontWeight={600} fontSize={10} fill="#15201A">
          {/* textLength stretches either language to exactly one lap of the ring */}
          <textPath href="#hk-stamp-circle" textLength={306} lengthAdjust="spacing">
            {t('x.stamp')}
          </textPath>
        </text>
      </svg>
      <span className="absolute inset-[34px] rounded-full bg-lime border-[1.5px] border-ink flex items-center justify-center">
        <Check size={30} strokeWidth={2.6} className="text-deep" />
      </span>
    </div>
  );
}

function Faq({ q, a, defaultOpen, n }: { q: string; a: string; defaultOpen?: boolean; n: number }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className={cx('rounded-[16px] border-[1.5px] border-ink bg-cream transition-shadow duration-300', open ? 'shadow-brut' : 'shadow-none hover:shadow-brut-sm')}>
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="w-full flex items-center gap-4 text-left px-5 sm:px-6 py-5 focus-ring rounded-[16px]">
        <span className="font-mono text-[12px] text-muted w-6 shrink-0">0{n}</span>
        <span className="flex-1 text-title">{q}</span>
        <span className={cx('w-[30px] h-[30px] rounded-full border-[1.5px] border-ink flex items-center justify-center shrink-0 transition-all duration-300', open ? 'bg-lime rotate-180' : 'bg-cream')}>
          {open ? <Minus size={16} /> : <Plus size={16} />}
        </span>
      </button>
      <div className={cx('grid transition-[grid-template-rows] duration-300 ease-out', open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')} aria-hidden={!open}>
        <div className="overflow-hidden">
          <p className={cx('pl-[60px] sm:pl-[64px] pr-6 pb-5 -mt-1 text-body text-muted transition-opacity duration-300', open ? 'opacity-100' : 'opacity-0')}>{a}</p>
        </div>
      </div>
    </div>
  );
}


/* ---------------- Story: the problem (sourced) ---------------- */

function Problem() {
  const t = useT();
  const lang = useDemo((s) => s.lang);
  const youthJobless = Math.round(100 - LFS.youthEmploymentRate);
  const stats = [
    { value: <CountUp to={LFS.unemploymentRate} decimals={1} suffix="%" />, label: t('x.stat1'), detail: t('x.stat1d', { prev: LFS.unemploymentRatePrev }) },
    { value: <CountUp to={LFS.unemployed / 1_000_000} decimals={2} suffix="M" />, label: t('x.stat2'), detail: t('x.stat2d', { lf: (LFS.laborForce / 1_000_000).toFixed(1) }) },
    { value: <CountUp to={youthJobless} />, label: t('x.stat3'), detail: t('x.stat3d', { now: LFS.youthEmploymentRate, prev: LFS.youthEmploymentRatePrev }) },
  ];
  return (
    <section id="problem" className="py-20 lg:py-28 scroll-mt-4">
      <Container>
        <Reveal>
          <Eyebrow n="01">{t('x.problem')}</Eyebrow>
          <h2 className={cx(H2, 'mt-4 max-w-[860px] [&_em]:text-red')}>
            <Accent text={t('x.problemTitle')} />
          </h2>
          <p className="mt-4 text-body text-muted max-w-[640px]">{t('x.problemSub')}</p>
        </Reveal>
        <Reveal stagger className="mt-10 grid md:grid-cols-3 gap-5">
          {stats.map((st, i) => (
            <div key={i} className={cx('rounded-[20px] border-[1.5px] border-ink p-6', i === 2 ? 'bg-ink text-cream shadow-brut-lime' : 'bg-cream shadow-brut')}>
              <div className={cx('font-display font-extrabold text-[56px] leading-[56px] tracking-[-0.04em] tabular-nums', i === 2 ? 'text-lime' : 'text-red')}>{st.value}</div>
              <div className="mt-2 text-title">{st.label}</div>
              <div className={cx('mt-1 text-body-s', i === 2 ? 'text-cream/70' : 'text-muted')}>{st.detail}</div>
            </div>
          ))}
        </Reveal>
        {/* the loop Hakbang breaks */}
        <Reveal className="mt-8 rounded-[20px] border-[1.5px] border-dashed border-ink/40 p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          <span className="font-mono text-[12px] md:text-[13px] font-semibold uppercase tracking-[0.08em] text-muted line-through decoration-red decoration-2">{t('x.loop')}</span>
          <ArrowRight size={20} className="hidden md:block text-green shrink-0" aria-hidden />
          <span className="text-body font-semibold">{t('x.loopBreak')}</span>
        </Reveal>
        <p className="mt-4 font-mono text-[11px] text-muted">
          {t('x.source')}: {lang === 'fil' ? LFS.month.fil : LFS.month.en}.{' '}
          <a href={LFS.sourceUrl} target="_blank" rel="noreferrer" className="underline hover:text-green">
            {LFS.sourceLabel}
          </a>
        </p>
      </Container>
    </section>
  );
}

/* ---------------- Story: impact, with a calculator ---------------- */

const fmtPeso = (n: number) => (n >= 1e9 ? `₱${(n / 1e9).toFixed(2)}B` : n >= 1e6 ? `₱${(n / 1e6).toFixed(1)}M` : `₱${Math.round(n).toLocaleString('en-PH')}`);

function Impact() {
  const t = useT();
  const [grads, setGrads] = useState(5000);
  const hires = Math.round(grads * PLAN.hireRate);
  const wages = hires * PLAN.monthlySalary * 12;
  const share = (hires / LFS.unemployed) * 100;
  const rate = (hires / LFS.laborForce) * 100;
  const tiers: [typeof User, string, string][] = [
    [User, 'x.i1', 'x.i1d'],
    [HomeIcon, 'x.i2', 'x.i2d'],
    [Globe2, 'x.i3', 'x.i3d'],
  ];
  return (
    <section id="impact" className="py-20 lg:py-28 scroll-mt-4">
      <Container>
        <Reveal>
          <Eyebrow n="05">{t('x.impact')}</Eyebrow>
          <h2 className={cx(H2, 'mt-4 max-w-[820px] [&_em]:text-green')}>
            <Accent text={t('x.impactTitle')} />
          </h2>
          <p className="mt-4 text-body text-muted max-w-[620px]">{t('x.impactSub')}</p>
        </Reveal>
        {/* three tiers that grow like steps */}
        <Reveal stagger className="mt-10 grid md:grid-cols-3 gap-5 md:items-end">
          {tiers.map(([Icon, h, d], i) => (
            <div key={h} className="md:mb-[var(--lift)]" style={{ '--lift': `${i * 28}px` } as CSSProperties}>
              <div className={cx('rounded-[20px] border-[1.5px] border-ink p-6 h-full', i === 2 ? 'bg-deep text-white shadow-brut-lime' : i === 1 ? 'bg-mint shadow-brut' : 'bg-cream shadow-brut')}>
                <Icon size={26} className={i === 2 ? 'text-lime' : 'text-green'} aria-hidden />
                <h3 className="mt-3 text-h-m">{t(h)}</h3>
                <p className={cx('mt-2 text-body-s', i === 2 ? 'text-white/80' : 'text-muted')}>{t(d)}</p>
              </div>
            </div>
          ))}
        </Reveal>

        {/* calculator */}
        <Reveal className="mt-10 rounded-[24px] border-[1.5px] border-ink bg-cream shadow-brut p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-end gap-5 md:gap-10">
            <label className="flex-1">
              <span className="text-title">{t('x.calcTitle')}</span>
              <span className="mt-2 block font-display font-extrabold text-[44px] leading-[44px] tracking-[-0.03em] text-green tabular-nums">{grads.toLocaleString('en-PH')}</span>
              <span className="block text-body-s text-muted">{t('x.calcGrads')}</span>
              <input
                type="range"
                min={100}
                max={50000}
                step={100}
                value={grads}
                onChange={(e) => setGrads(Number(e.target.value))}
                className="mt-4 w-full accent-[#005D41] h-2"
                aria-label={t('x.calcGrads')}
                data-testid="impact-slider"
              />
            </label>
          </div>
          <dl className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(
              [
                [hires.toLocaleString('en-PH'), t('x.calcHires')],
                [fmtPeso(wages), t('x.calcWages')],
                [`${share.toFixed(2)}%`, t('x.calcShare')],
                [`−${rate.toFixed(3)} pts`, t('x.calcRate')],
              ] as const
            ).map(([v, l], i) => (
              <div key={l} className={cx('rounded-[16px] border-[1.5px] border-ink p-4', i === 0 ? 'bg-lime' : 'bg-paper')}>
                <dt className="sr-only">{l}</dt>
                <dd className="font-mono font-semibold text-[26px] leading-[30px] tabular-nums" data-testid={`impact-${i}`}>
                  {v}
                </dd>
                <dd className={cx('mt-1 text-caption', i === 0 ? 'text-deep/80' : 'text-muted')}>{l}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 text-caption text-muted">
            {t('x.calcNote', { rate: Math.round(PLAN.hireRate * 100), pay: PLAN.monthlySalary.toLocaleString('en-PH'), src: `${LFS.sourceLabel}` })}{' '}
            {t('x.pilotLine')}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}

/* ---------------- Page ---------------- */

export default function Landing() {
  const t = useT();
  const nav = useNavigate();
  const setRole = useDemo((s) => s.setRole);
  const [toast, setToast] = useState<string | null>(null);
  const seeker = () => {
    setRole('seeker');
    nav('/signup');
  };
  const employer = () => {
    setRole('employer');
    nav('/employer/verify');
  };

  return (
    <div className="bg-paper text-ink">
      {/* HERO */}
      <section className="relative bg-deep text-white overflow-hidden">
        <Swoosh className="w-[1300px] -right-[160px] top-[120px] hk-drift" opacity={0.08} />
        <Container>
          <header className="relative h-[80px] sm:h-[94px] flex items-center gap-3 sm:gap-8">
            <NavBrand to="/" reversed size={26} className="sm:!hidden" />
            <NavBrand to="/" reversed size={34} className="!hidden sm:!inline-flex" />
            <nav aria-label="Primary" className="hidden lg:flex gap-7 font-mono text-[12px] font-semibold uppercase tracking-[0.1em] text-white/75">
              {(
                [
                  [t('l.nav.seekers'), 'how'],
                  [t('l.nav.employers'), 'employers'],
                  [t('l.nav.how'), 'how'],
                  ['FAQ', 'faq'],
                ] as const
              ).map(([l, id]) => (
                <button key={l} type="button" onClick={() => scrollTo(id)} className="hover:text-lime focus-ring rounded transition-colors">
                  {l}
                </button>
              ))}
            </nav>
            <div className="ml-auto flex items-center gap-2 sm:gap-4">
              <LangToggle short className="!bg-white/10 !border-white/20 [&_button[aria-pressed=false]]:text-white" />
              <Link to="/demo" className="hidden sm:inline text-label text-white/90 hover:text-lime focus-ring rounded">
                {t('l.nav.login')}
              </Link>
              <Button variant="lime" size="md" onClick={seeker} className="!px-3.5 sm:!px-5 !h-10 sm:!h-11">
                {t('l.nav.signup')}
              </Button>
            </div>
          </header>

          <div className="relative grid grid-cols-1 lg:grid-cols-[minmax(0,600px)_minmax(0,1fr)] gap-6 lg:gap-10 pt-10 lg:pt-[84px] pb-16 lg:pb-[150px]">
            <div>
              <div className="hk-rise inline-flex items-center gap-2.5 h-8 px-3 rounded-[8px] border border-white/20 bg-white/5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em]">
                <span className="w-2 h-2 rounded-full bg-lime hk-pulse-dot" aria-hidden />
                {t('l.badge')}
              </div>
              <h1 style={d(80)} className="hk-rise mt-7 font-display font-extrabold text-[50px] leading-[48px] sm:text-[68px] sm:leading-[64px] xl:text-[86px] xl:leading-[80px] tracking-[-0.045em] [&_em]:text-lime">
                <Accent text={t('l.hero')} />
              </h1>
              <p style={d(180)} className="hk-rise mt-7 text-[17px] leading-[27px] text-white/80 max-w-[500px]">
                {t('l.heroSub')}
              </p>
              <div style={d(280)} className="hk-rise mt-9 flex flex-wrap gap-3.5">
                <Button variant="lime" onClick={seeker}>
                  {t('l.find')} <ArrowUpRight size={18} aria-hidden />
                </Button>
                <Button variant="onDarkOutline" onClick={() => scrollTo('employers')}>
                  {t('l.forEmp')}
                </Button>
              </div>
              <ul style={d(380)} className="hk-rise mt-8 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11.5px] uppercase tracking-[0.08em] text-white/70">
                {['l.trust1', 'l.trust2', 'l.trust3'].map((k) => (
                  <li key={k} className="flex items-center gap-1.5">
                    <Check size={14} className="text-lime" aria-hidden />
                    {t(k)}
                  </li>
                ))}
              </ul>
              <Link to="/demo" style={d(460)} className="hk-rise group mt-7 inline-flex items-center gap-2 font-serif italic text-[22px] text-lime focus-ring rounded">
                {t('l.tryDemo')}
                <span className="inline-block transition-transform group-hover:translate-x-1.5" aria-hidden>
                  →
                </span>
              </Link>
            </div>
            <div className="relative min-w-0 h-[330px] sm:h-[420px] lg:h-[470px] xl:h-[520px]">
              <Staircase />
            </div>
          </div>
        </Container>
        <StepEdge fill="#15201A" className="absolute bottom-0 left-0" />
      </section>

      <Ticker />

      <Problem />

      {/* HOW IT WORKS */}
      <section id="how" className="py-20 lg:py-28 scroll-mt-4">
        <Container>
          <Reveal>
            <Eyebrow n="02">{t('x.how')}</Eyebrow>
            <h2 className={cx(H2, 'mt-4 max-w-[760px] [&_em]:text-green')}>
              <Accent text={t('l.steps')} />
            </h2>
            <p className="mt-4 text-body text-muted max-w-[520px]">{t('l.stepsSub')}</p>
          </Reveal>
          <Reveal as="ol" stagger className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:items-end">
            {(
              [
                ['l.s1', 'l.s1D', User],
                ['l.s2', 'l.s2D', Sparkles],
                ['l.s3', 'l.s3D', RouteIcon],
                ['l.s4', 'l.s4D', Star],
              ] as const
            ).map(([h, dsc, Icon], i) => (
              // each card sits one step higher than the last
              <li key={h} className="lg:mb-[var(--lift)]" style={{ '--lift': `${i * 36}px` } as CSSProperties}>
                <div
                  className={cx(
                    'group h-full rounded-[18px] border-[1.5px] border-ink p-6 transition-transform duration-200 hover:-translate-y-1',
                    i === 3 ? 'bg-deep text-white shadow-brut-lime' : 'bg-cream shadow-brut',
                  )}
                >
                  <div className="flex items-start justify-between">
                    <span className={cx('font-display font-extrabold text-[64px] leading-[56px] tracking-[-0.04em] hk-outline', i === 3 ? 'hk-outline-lime' : 'hk-outline-ink')}>0{i + 1}</span>
                    <Icon size={24} className={cx('mt-1 transition-transform duration-300 group-hover:rotate-[-10deg] group-hover:scale-110', i === 3 ? 'text-lime' : 'text-green')} aria-hidden />
                  </div>
                  <div className={cx('mt-5 font-mono text-[10.5px] uppercase tracking-[0.14em]', i === 3 ? 'text-lime' : 'text-muted')}>
                    {t('x.step')} {i + 1}/4
                  </div>
                  <h3 className="mt-1.5 text-h-s">{t(h)}</h3>
                  <p className={cx('mt-2 text-body-s', i === 3 ? 'text-white/75' : 'text-muted')}>{t(dsc)}</p>
                </div>
              </li>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* SAFETY */}
      <section className="pb-20 lg:pb-28">
        <Container className="grid lg:grid-cols-[460px_1fr] gap-12 lg:gap-16 items-center">
          <Reveal>
            <Eyebrow n="03">{t('x.safety')}</Eyebrow>
            <h2 className={cx(H2, 'mt-4 [&_em]:text-red')}>
              <Accent text={t('l.safety')} />
            </h2>
            <p className="mt-4 text-body text-muted">{t('l.safetySub')}</p>
            <div className="mt-8">
              <Stamp />
            </div>
          </Reveal>
          <Reveal as="ul" stagger className="space-y-4">
            {(
              [
                ['l.p1', 'l.p1D', ShieldCheck],
                ['l.p2', 'l.p2D', FileText],
                ['l.p3', 'l.p3D', Flag],
              ] as const
            ).map(([h, dsc, Icon], i) => (
              <li key={h}>
                <div className="flex gap-4 bg-cream border-[1.5px] border-ink rounded-[18px] p-5 sm:px-6 shadow-brut-sm transition-all duration-200 hover:shadow-brut hover:-translate-x-0.5 hover:-translate-y-0.5">
                  <span className="font-mono text-[12px] text-muted pt-3 w-6 shrink-0">0{i + 1}</span>
                  <IconTile icon={Icon} />
                  <div>
                    <h3 className="text-title">{t(h)}</h3>
                    <p className="mt-1 text-body-s text-muted">{t(dsc)}</p>
                  </div>
                </div>
              </li>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* FEATURES BENTO */}
      <section className="bg-cream border-y-[1.5px] border-ink py-20 lg:py-28">
        <Container>
          <Reveal>
            <Eyebrow n="04">{t('x.features')}</Eyebrow>
            <h2 className={cx(H2, 'mt-4 [&_em]:text-green')}>
              <Accent text={t('l.features')} />
            </h2>
            <p className="mt-4 text-body text-muted">{t('l.featuresSub')}</p>
          </Reveal>
          <div className="mt-12 grid gap-6">
            <Reveal stagger className="grid gap-6 lg:grid-cols-[1.44fr_1fr]">
              <div className="rounded-[22px] bg-paper border-[1.5px] border-ink shadow-brut p-7">
                <h3 className="text-h-m">{t('l.f.profile')}</h3>
                <p className="mt-1.5 text-body-s text-muted">{t('l.f.profileD')}</p>
                <div className="mt-5 bg-cream border-[1.5px] border-ink rounded-[14px] p-4 flex items-center gap-3.5">
                  <Avatar initials="PR" />
                  <div className="flex-1 min-w-0">
                    <div className="text-title">Paolo Reyes</div>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {['Customer service', 'MS Word', 'Basic Excel'].map((s) => (
                        <span key={s} className="h-7 px-2.5 rounded-full border border-ink/30 text-caption inline-flex items-center">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="hk-sticker inline-flex items-center gap-1 rounded-[6px] bg-lime border border-ink px-2 h-6 font-mono text-[11px] font-semibold">
                    <Sparkles size={12} aria-hidden /> AI
                  </span>
                </div>
              </div>
              <div className="rounded-[22px] bg-deep text-white border-[1.5px] border-ink shadow-brut-lime p-7">
                <h3 className="text-h-m">{t('l.f.match')}</h3>
                <p className="mt-1.5 text-body-s text-white/75">{t('l.f.matchD')}</p>
                <div className="mt-5 rounded-[14px] bg-white/10 p-4 flex items-center gap-4">
                  <div>
                    <CountUp to={86} suffix="%" className="block font-mono font-semibold text-[30px] leading-[31px] text-lime" />
                    <div className="font-mono text-[10px] uppercase tracking-wider">{t('match.short')}</div>
                  </div>
                  <div className="hk-bars flex-1 flex">
                    <MatchBars dark match={{ skills: 0.8, location: 0.95, schedule: 1 }} labels={['Skills', t('l.f.location'), 'Schedule']} />
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal stagger className="grid gap-6 lg:grid-cols-[1fr_1.44fr]">
              <div className="rounded-[22px] bg-mint border-[1.5px] border-ink shadow-brut p-7">
                <h3 className="text-h-m">{t('l.f.tracks')}</h3>
                <p className="mt-1.5 text-body-s text-muted">{t('l.f.tracksD')}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {(
                    [
                      [Calendar, t('l.f.4weeks')],
                      [PhilippinePeso, t('allowance', { amt: '₱3,000' })],
                      [Clock, t('l.f.satsun')],
                      [MapPin, 'Ortigas'],
                    ] as const
                  ).map(([Icon, l]) => (
                    <span key={l} className="inline-flex items-center gap-1.5 bg-cream border border-ink/30 rounded-full h-8 px-3 text-label">
                      <Icon size={15} className="text-green" aria-hidden />
                      {l}
                    </span>
                  ))}
                </div>
                <VerifiedBadge className="mt-3 !bg-transparent !px-0" />
              </div>
              <div className="rounded-[22px] bg-paper border-[1.5px] border-ink shadow-brut p-7">
                <h3 className="text-h-m">{t('l.f.progress')}</h3>
                <p className="mt-1.5 text-body-s text-muted">{t('l.f.progressD')}</p>
                <div className="hk-trail mt-5 bg-cream border-[1.5px] border-ink rounded-[14px] px-2 py-4">
                  <Trail
                    orientation="horizontal"
                    size={24}
                    compact
                    steps={[
                      { key: 'a', label: 'Applied', state: 'done' },
                      { key: 'm1', label: 'Module 1', state: 'done' },
                      { key: 'm2', label: 'Module 2', state: 'current' },
                      { key: 'as', label: t('l.f.assessment'), state: 'upcoming' },
                      { key: 'h', label: t('l.f.hired'), state: 'upcoming' },
                    ]}
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <Impact />

      {/* EMPLOYERS */}
      <section id="employers" className="bg-deep text-white py-20 lg:py-28 relative overflow-hidden scroll-mt-4">
        <Container className="grid lg:grid-cols-[1fr_420px] gap-14 lg:gap-20 items-center relative">
          <Reveal>
            <Eyebrow n="06" dark>
              {t('l.emp.tag')}
            </Eyebrow>
            <h2 className={cx(H2, 'mt-4 [&_em]:text-lime')}>
              <Accent text={t('l.emp.title')} />
            </h2>
            <p className="mt-4 text-body text-white/80 max-w-[560px]">{t('l.emp.sub')}</p>
            <Reveal as="ul" stagger className="mt-7 space-y-3.5">
              {['l.emp.b1', 'l.emp.b2', 'l.emp.b3'].map((k) => (
                <li key={k} className="flex gap-3 text-body">
                  <span className="mt-0.5 w-5 h-5 rounded-[5px] bg-lime text-deep flex items-center justify-center shrink-0">
                    <Check size={14} strokeWidth={3} aria-hidden />
                  </span>
                  {t(k)}
                </li>
              ))}
            </Reveal>
            <div className="mt-9 flex flex-wrap gap-3.5">
              <Button variant="lime" onClick={employer}>
                {t('l.emp.pilot')} <ArrowUpRight size={18} aria-hidden />
              </Button>
              <Button variant="onDarkOutline" onClick={() => nav('/contact?topic=employer')}>
                {t('l.emp.talk')}
              </Button>
            </div>
          </Reveal>

          {/* pricing as a receipt */}
          <Reveal delay={150} className="[filter:drop-shadow(7px_7px_0_#5DB250)]">
            <div className="hk-receipt bg-cream text-ink px-7 pt-7 pb-10 rotate-[1.5deg] hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center justify-between font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                <span>{t('x.receipt')}</span>
                <span>#2027-PILOT</span>
              </div>
              <h3 className="mt-4 text-h-s">{t('l.price.title')}</h3>
              <div className="mt-3 flex items-baseline gap-2">
                <CountUp to={2500} prefix="₱" duration={1400} className="font-mono font-semibold text-[42px] leading-[42px] text-green tabular-nums tracking-tight" />
                <span className="text-body-s text-muted">{t('l.price.per')}</span>
              </div>
              <dl className="mt-5 font-mono text-[13px]">
                {(
                  [
                    ['l.price.standard', '₱5,000'],
                    ['l.price.volume', '₱4,000'],
                    ['l.price.posting', t('l.price.free')],
                  ] as const
                ).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3 py-3 border-t border-dashed border-ink/40">
                    <dt className="text-muted">{t(k)}</dt>
                    <dd className="font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-2 pt-3 border-t-[1.5px] border-ink text-caption text-muted">{t('l.price.note')}</p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* SCHOOLS / PESO */}
      <section className="bg-lime border-y-[1.5px] border-ink">
        <Container>
          <Reveal className="py-12 flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
            <span className="w-16 h-16 rounded-[14px] bg-cream border-[1.5px] border-ink shadow-brut-sm flex items-center justify-center shrink-0">
              <Building2 size={30} className="text-green" aria-hidden />
            </span>
            <div className="flex-1">
              <h2 className="text-h-m text-deep">{t('l.peso')}</h2>
              <p className="mt-1.5 text-body text-deep/80">{t('l.pesoD')}</p>
            </div>
            <Button variant="secondary" onClick={() => nav('/contact?topic=school')}>
              {t('l.pesoCta')}
            </Button>
          </Reveal>
        </Container>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 lg:py-28 scroll-mt-4">
        <Container className="grid lg:grid-cols-[380px_1fr] gap-10 lg:gap-[64px]">
          <Reveal>
            <Eyebrow n="07">{t('x.faq')}</Eyebrow>
            <h2 className={cx(H2, 'mt-4 [&_em]:text-green')}>
              <Accent text={t('l.faq')} />
            </h2>
            <p className="mt-4 text-body text-muted">{t('l.faqSub')}</p>
          </Reveal>
          <Reveal stagger className="space-y-3.5">
            <Faq n={1} q={t('l.q1')} a={t('l.a1')} defaultOpen />
            <Faq n={2} q={t('l.q2')} a={t('l.a2')} />
            <Faq n={3} q={t('l.q3')} a={t('l.a3')} />
            <Faq n={4} q={t('l.q4')} a={t('l.a4')} />
          </Reveal>
        </Container>
      </section>

      {/* CTA BAND */}
      <section className="pb-20">
        <Container>
          <Reveal className="relative overflow-hidden rounded-[26px] bg-ink text-cream border-[1.5px] border-ink shadow-brut-lime px-7 pt-12 pb-40 md:px-14 md:py-16 flex flex-col md:flex-row md:items-center gap-8">
            {/* mini staircase */}
            <svg viewBox="0 0 240 160" className="absolute right-0 bottom-0 w-[260px] md:w-[360px]" aria-hidden>
              {[40, 80, 120, 160].map((h, i) => (
                <g key={i}>
                  <rect x={i * 60} y={160 - h} width={60} height={h} fill={STEP_FILL[i]} />
                  <rect x={i * 60} y={160 - h} width={60} height={4} fill="#5DB250" />
                </g>
              ))}
            </svg>
            <div className="relative flex-1">
              <h2 className="font-display font-extrabold text-[38px] leading-[38px] md:text-[60px] md:leading-[58px] tracking-[-0.04em] [&_em]:text-lime">
                <Accent text={t('l.cta')} />
              </h2>
              <p className="mt-3 text-body text-cream/75">{t('l.ctaSub')}</p>
            </div>
            <Button variant="lime" className="relative self-start md:self-center md:mr-[220px] xl:mr-[260px]" onClick={seeker}>
              {t('l.ctaBtn')} <ArrowUpRight size={18} aria-hidden />
            </Button>
          </Reveal>
        </Container>
      </section>

      {/* FOOTER */}
      <footer className="bg-deep text-white overflow-hidden">
        <Container className="pt-16 pb-6">
          <div className="grid gap-10 md:grid-cols-[320px_1fr]">
            <div>
              <Logo reversed height={34} />
              <p className="mt-3 font-serif italic text-[20px] text-white/80">{t('l.tagline')}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              <FooterCol title={t('l.ft.seekers')} items={[[t('l.nav.how'), () => scrollTo('how')], [t('l.ft.tracks'), () => nav('/matches')], [t('l.nav.signup'), seeker], [t('l.nav.login'), () => nav('/demo')]]} />
              <FooterCol
                title={t('l.ft.employers')}
                items={[
                  [t('l.emp.pilot'), employer],
                  [t('l.ft.pricing'), () => scrollTo('employers')],
                  [
                    t('l.ft.empLogin'),
                    () => {
                      setRole('employer');
                      nav('/employer/overview');
                    },
                  ],
                ]}
              />
              <FooterCol title={t('l.ft.partners')} items={[[t('l.ft.career'), () => nav('/contact?topic=school')], [t('l.ft.peso'), () => nav('/contact?topic=school')]]} />
              <FooterCol title={t('l.ft.help')} items={[['FAQ', () => scrollTo('faq')], [t('l.ft.report'), () => nav('/report')], [t('l.ft.privacy'), () => nav('/legal/privacy')], [t('l.ft.terms'), () => nav('/legal/terms')], ['Photo credits', () => nav('/legal/credits')]]} />
            </div>
          </div>
          <div className="mt-12 pt-6 border-t border-white/15 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.08em] text-white/60">
            <span>{t('l.copyright')}</span>
            <LangToggle short className="!bg-white/10 !border-white/20 [&_button[aria-pressed=false]]:text-white self-start" />
          </div>
        </Container>
        <div className="select-none pointer-events-none font-display font-extrabold text-[25vw] leading-[0.78] tracking-[-0.06em] text-white/[0.06] text-center -mb-[3vw] whitespace-nowrap" aria-hidden>
          Hakbang
        </div>
      </footer>
      <Toast message={toast} onDone={() => setToast(null)} />
    </div>
  );
}

function FooterCol({ title, items }: { title: string; items: [string, () => void][] }) {
  return (
    <div>
      <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-lime">{title}</h3>
      <ul className="mt-3.5 space-y-2.5">
        {items.map(([l, fn]) => (
          <li key={l}>
            <button type="button" onClick={fn} className="text-body-s text-white/80 hover:text-lime text-left focus-ring rounded transition-colors">
              {l}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
