import { useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Calendar, Check, Clock, FileText, Flag, MapPin, Minus, PhilippinePeso, Plus, Route as RouteIcon, ShieldCheck, Sparkles, Star, User } from 'lucide-react';
import { Logo, Swoosh } from '../components/Brand';
import { Trail } from '../components/Trail';
import { Avatar, Button, IconTile, LangToggle, MatchBars, Toast, VerifiedBadge, cx } from '../components/ui';
import { useT } from '../i18n';
import { useDemo } from '../store';

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('max-w-[1200px] mx-auto px-5 md:px-10 xl:px-0', className)}>{children}</div>;
}

function FloatCard({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx('absolute bg-white rounded-[16px] shadow-float px-4 py-3.5 text-ink', className)}>{children}</div>;
}

function HeroVisual() {
  const t = useT();
  return (
    <div className="relative w-[560px] h-[520px] origin-top-left scale-[0.62] sm:scale-[0.8] lg:scale-[0.9] xl:scale-100" aria-hidden>
      <svg viewBox="0 0 560 520" className="absolute inset-0 w-full h-full">
        <path d="M30 500 C 90 470, 130 440, 170 410 S 270 310, 320 265 S 460 110, 520 40" fill="none" stroke="#5DB250" strokeWidth="4" strokeLinecap="round" strokeDasharray="1 12" />
        {[
          [30, 500],
          [170, 410],
          [320, 265],
          [520, 40],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="11" fill={i < 3 ? '#5DB250' : '#fff'} stroke={i < 3 ? '#023B2A' : '#5DB250'} strokeWidth="4" />
        ))}
      </svg>
      <FloatCard className="left-0 top-[370px] w-[230px]">
        <div className="flex items-center gap-2.5">
          <Avatar initials="PR" size={36} />
          <div>
            <div className="text-label">{t('l.card.profile')}</div>
            <div className="text-caption text-muted">{t('l.card.profileD')}</div>
          </div>
        </div>
      </FloatCard>
      <FloatCard className="left-[190px] top-[190px] w-[290px]">
        <div className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-[10px] bg-deep text-white text-caption font-semibold flex items-center justify-center">BH</span>
          <div className="flex-1">
            <div className="text-label">Back Office Associate</div>
            <div className="text-caption text-muted">BlueHarbor CX</div>
          </div>
          <div className="text-right">
            <div className="font-display font-bold text-[20px] text-green leading-[22px]">86%</div>
            <div className="text-caption text-muted">{t('match.short')}</div>
          </div>
        </div>
        <VerifiedBadge className="mt-2.5" />
      </FloatCard>
      <FloatCard className="left-[330px] top-[330px] w-[210px]">
        <div className="flex items-center gap-2.5">
          <IconTile icon={Check} size={32} />
          <div>
            <div className="text-label">{t('l.card.passed')}</div>
            <div className="text-caption text-muted">{t('l.card.passedD')}</div>
          </div>
        </div>
      </FloatCard>
      <FloatCard className="left-[330px] top-[40px] w-[190px] !bg-lime">
        <div className="flex items-center gap-2.5">
          <IconTile icon={Star} size={32} tone="white" />
          <div>
            <div className="text-label text-deep">{t('l.card.hired')}</div>
            <div className="text-caption text-deep/80">{t('l.card.hiredD')}</div>
          </div>
        </div>
      </FloatCard>
    </div>
  );
}

function Faq({ q, a, defaultOpen }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className={cx('rounded-[18px] border bg-white', open ? 'border-green' : 'border-line')}>
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="w-full flex items-center gap-4 text-left px-6 py-5 focus-ring rounded-[18px]">
        <span className="flex-1 text-title">{q}</span>
        <span className={cx('w-[30px] h-[30px] rounded-full flex items-center justify-center shrink-0', open ? 'bg-green text-white' : 'bg-paper text-ink')}>
          {open ? <Minus size={16} /> : <Plus size={16} />}
        </span>
      </button>
      {open && <p className="px-6 pb-5 -mt-1 text-body text-muted">{a}</p>}
    </div>
  );
}

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
    <div className="bg-paper">
      {/* HERO */}
      <section className="relative bg-deep text-white overflow-hidden">
        <Swoosh className="w-[1300px] -right-[160px] top-[120px]" opacity={0.14} />
        <Container>
          <header className="relative h-[94px] flex items-center gap-8">
            <Link to="/" aria-label="Hakbang home" className="focus-ring rounded">
              <Logo reversed height={32} />
            </Link>
            <nav aria-label="Primary" className="hidden lg:flex gap-7 text-label text-white/85">
              <button type="button" onClick={() => scrollTo('how')} className="hover:text-white focus-ring rounded">
                {t('l.nav.seekers')}
              </button>
              <button type="button" onClick={() => scrollTo('employers')} className="hover:text-white focus-ring rounded">
                {t('l.nav.employers')}
              </button>
              <button type="button" onClick={() => scrollTo('how')} className="hover:text-white focus-ring rounded">
                {t('l.nav.how')}
              </button>
              <button type="button" onClick={() => scrollTo('faq')} className="hover:text-white focus-ring rounded">
                FAQ
              </button>
            </nav>
            <div className="ml-auto flex items-center gap-3 sm:gap-4">
              <LangToggle short className="!bg-white/10 !border-white/20 [&_button[aria-pressed=false]]:text-white" />
              <Link to="/demo" className="hidden sm:inline text-label text-white/90 hover:text-white focus-ring rounded">
                {t('l.nav.login')}
              </Link>
              <Button variant="lime" size="md" onClick={seeker} className="!h-[46px] sm:!h-[50px]">
                {t('l.nav.signup')}
              </Button>
            </div>
          </header>

          <div className="relative grid lg:grid-cols-[600px_1fr] gap-6 lg:gap-10 pt-10 lg:pt-[106px] pb-6 lg:pb-[140px]">
            <div>
              <span className="inline-flex items-center gap-2 h-7 px-3 rounded-full bg-white/10 text-caption">
                <span className="w-2 h-2 rounded-full bg-lime" aria-hidden />
                {t('l.badge')}
              </span>
              <h1 className="mt-6 font-display font-extrabold text-[44px] leading-[46px] sm:text-[56px] sm:leading-[58px] xl:text-hero tracking-[-0.02em]">{t('l.hero')}</h1>
              <p className="mt-6 text-[17px] leading-[26px] text-white/85 max-w-[560px]">{t('l.heroSub')}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button variant="lime" onClick={seeker}>
                  {t('l.find')}
                </Button>
                <Button variant="onDarkOutline" onClick={() => scrollTo('employers')}>
                  {t('l.forEmp')}
                </Button>
              </div>
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2.5 text-body-s text-white/90">
                {['l.trust1', 'l.trust2', 'l.trust3'].map((k) => (
                  <li key={k} className="flex items-center gap-1.5">
                    <Check size={16} className="text-lime" aria-hidden />
                    {t(k)}
                  </li>
                ))}
              </ul>
              <Link to="/demo" className="mt-6 inline-flex text-label text-lime underline underline-offset-4 focus-ring rounded">
                {t('l.tryDemo')} →
              </Link>
            </div>
            <div className="h-[330px] sm:h-[420px] lg:h-[470px] xl:h-[520px] -mx-2 lg:mx-0">
              <HeroVisual />
            </div>
          </div>
        </Container>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-16 lg:py-24 scroll-mt-4">
        <Container>
          <h2 className="font-display font-bold text-[30px] leading-[36px] lg:text-[40px] lg:leading-[44px] tracking-[-0.01em]">{t('l.steps')}</h2>
          <p className="mt-3 text-body text-muted">{t('l.stepsSub')}</p>
          <ol className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {(
              [
                ['l.s1', 'l.s1D', User],
                ['l.s2', 'l.s2D', Sparkles],
                ['l.s3', 'l.s3D', RouteIcon],
                ['l.s4', 'l.s4D', Star],
              ] as const
            ).map(([h, d, Icon], i) => (
              <li key={h} className={cx('rounded-card p-6 border', i === 3 ? 'bg-deep text-white border-deep' : 'bg-white border-line')}>
                <div className="flex items-center justify-between">
                  <span className={cx('w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-[18px]', i === 3 ? 'bg-lime text-deep' : 'bg-mint text-green')}>{i + 1}</span>
                  <Icon size={24} className={i === 3 ? 'text-lime' : 'text-green'} aria-hidden />
                </div>
                <h3 className="mt-4 text-h-s">{t(h)}</h3>
                <p className={cx('mt-2.5 text-body-s', i === 3 ? 'text-white/80' : 'text-muted')}>{t(d)}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* SAFETY */}
      <section className="pb-16 lg:pb-24">
        <Container className="grid lg:grid-cols-[440px_1fr] gap-10 lg:gap-14 items-center">
          <div>
            <h2 className="font-display font-bold text-[30px] leading-[36px] lg:text-[40px] lg:leading-[44px] tracking-[-0.01em]">{t('l.safety')}</h2>
            <p className="mt-3 text-body text-muted">{t('l.safetySub')}</p>
          </div>
          <ul className="space-y-3.5">
            {(
              [
                ['l.p1', 'l.p1D', ShieldCheck],
                ['l.p2', 'l.p2D', FileText],
                ['l.p3', 'l.p3D', Flag],
              ] as const
            ).map(([h, d, Icon]) => (
              <li key={h} className="flex gap-4 bg-white border border-line rounded-card p-5 sm:px-6">
                <IconTile icon={Icon} />
                <div>
                  <h3 className="text-title">{t(h)}</h3>
                  <p className="mt-1 text-body-s text-muted">{t(d)}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* FEATURES BENTO */}
      <section className="bg-white py-16 lg:py-24">
        <Container>
          <h2 className="font-display font-bold text-[30px] leading-[36px] lg:text-[40px] lg:leading-[44px] tracking-[-0.01em]">{t('l.features')}</h2>
          <p className="mt-3 text-body text-muted">{t('l.featuresSub')}</p>
          <div className="mt-10 grid gap-5">
            <div className="grid gap-5 lg:grid-cols-[1.44fr_1fr]">
            <div className="rounded-panel bg-paper p-7">
              <h3 className="text-h-m">{t('l.f.profile')}</h3>
              <p className="mt-1.5 text-body-s text-muted">{t('l.f.profileD')}</p>
              <div className="mt-5 bg-white border border-line rounded-[16px] p-4 flex items-center gap-3.5">
                <Avatar initials="PR" />
                <div className="flex-1 min-w-0">
                  <div className="text-title">Paolo Reyes</div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {['Customer service', 'MS Word', 'Basic Excel'].map((s) => (
                      <span key={s} className="h-7 px-2.5 rounded-full border border-line text-caption inline-flex items-center">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-mint text-green px-2.5 h-6 text-caption">
                  <Sparkles size={12} aria-hidden /> AI
                </span>
              </div>
            </div>
            <div className="rounded-panel bg-deep text-white p-7">
              <h3 className="text-h-m">{t('l.f.match')}</h3>
              <p className="mt-1.5 text-body-s text-white/80">{t('l.f.matchD')}</p>
              <div className="mt-5 rounded-[16px] bg-white/10 p-4 flex items-center gap-4">
                <div>
                  <div className="font-display font-bold text-[30px] leading-[31px] text-lime">86%</div>
                  <div className="text-caption">{t('match.short')}</div>
                </div>
                <MatchBars dark match={{ skills: 0.8, location: 0.95, schedule: 1 }} labels={['Skills', t('l.f.location'), 'Schedule']} />
              </div>
            </div>
            </div>
            <div className="grid gap-5 lg:grid-cols-[1fr_1.44fr]">
            <div className="rounded-panel bg-mint p-7">
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
                  <span key={l} className="inline-flex items-center gap-1.5 bg-white rounded-full h-8 px-3 text-label">
                    <Icon size={15} className="text-green" aria-hidden />
                    {l}
                  </span>
                ))}
              </div>
              <VerifiedBadge className="mt-3 !bg-transparent !px-0" />
            </div>
            <div className="rounded-panel bg-paper p-7">
              <h3 className="text-h-m">{t('l.f.progress')}</h3>
              <p className="mt-1.5 text-body-s text-muted">{t('l.f.progressD')}</p>
              <div className="mt-5 bg-white border border-line rounded-[16px] px-2 py-4">
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
            </div>
          </div>
        </Container>
      </section>

      {/* EMPLOYERS */}
      <section id="employers" className="bg-deep text-white py-16 lg:py-24 relative overflow-hidden scroll-mt-4">
        <Container className="grid lg:grid-cols-[1fr_440px] gap-12 lg:gap-14 items-center relative">
          <div>
            <span className="inline-flex items-center h-7 px-3 rounded-full bg-white/10 text-caption text-lime">{t('l.emp.tag')}</span>
            <h2 className="mt-5 font-display font-bold text-[30px] leading-[36px] lg:text-[40px] lg:leading-[44px] tracking-[-0.01em]">{t('l.emp.title')}</h2>
            <p className="mt-3 text-body text-white/85">{t('l.emp.sub')}</p>
            <ul className="mt-6 space-y-4">
              {['l.emp.b1', 'l.emp.b2', 'l.emp.b3'].map((k) => (
                <li key={k} className="flex gap-3 text-body">
                  <Check size={18} className="text-lime mt-0.5 shrink-0" aria-hidden />
                  {t(k)}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="lime" onClick={employer}>
                {t('l.emp.pilot')}
              </Button>
              <Button variant="onDarkOutline" onClick={() => setToast('Demo: the contact form is not part of this prototype.')}>
                {t('l.emp.talk')}
              </Button>
            </div>
          </div>
          <div className="bg-white text-ink rounded-panel p-7 shadow-float">
            <h3 className="text-h-s">{t('l.price.title')}</h3>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display font-bold text-[38px] leading-[38px] text-green">₱2,500</span>
              <span className="text-body-s text-muted">{t('l.price.per')}</span>
            </div>
            <dl className="mt-4 divide-y divide-line border-t border-line">
              {(
                [
                  ['l.price.standard', '₱5,000'],
                  ['l.price.volume', '₱4,000'],
                  ['l.price.posting', t('l.price.free')],
                ] as const
              ).map(([k, v]) => (
                <div key={k} className="flex justify-between py-3.5">
                  <dt className="text-body-s text-muted">{t(k)}</dt>
                  <dd className="text-title">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-2 text-caption text-muted">{t('l.price.note')}</p>
          </div>
        </Container>
      </section>

      {/* SCHOOLS / PESO */}
      <section className="bg-mint">
        <Container className="py-12 flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
          <IconTile icon={Building2} size={64} tone="white" />
          <div className="flex-1">
            <h2 className="text-h-m">{t('l.peso')}</h2>
            <p className="mt-1.5 text-body text-muted">{t('l.pesoD')}</p>
          </div>
          <Button onClick={() => setToast('Demo: partner sign-up is not part of this prototype.')}>{t('l.pesoCta')}</Button>
        </Container>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 lg:py-24 scroll-mt-4">
        <Container className="grid lg:grid-cols-[360px_1fr] gap-10 lg:gap-[64px]">
          <div>
            <h2 className="font-display font-bold text-[30px] leading-[36px] lg:text-[40px] lg:leading-[44px] tracking-[-0.01em]">{t('l.faq')}</h2>
            <p className="mt-3 text-body text-muted">{t('l.faqSub')}</p>
          </div>
          <div className="space-y-3">
            <Faq q={t('l.q1')} a={t('l.a1')} defaultOpen />
            <Faq q={t('l.q2')} a={t('l.a2')} />
            <Faq q={t('l.q3')} a={t('l.a3')} />
            <Faq q={t('l.q4')} a={t('l.a4')} />
          </div>
        </Container>
      </section>

      {/* CTA BAND */}
      <section className="pb-16">
        <Container>
          <div className="relative overflow-hidden rounded-panel bg-lime px-7 py-10 md:px-14 md:py-[52px] flex flex-col md:flex-row md:items-center gap-6">
            <Swoosh className="w-[640px] -right-[120px] -top-[60px]" color="#023B2A" opacity={0.12} />
            <div className="relative flex-1">
              <h2 className="font-display font-extrabold text-[30px] leading-[34px] md:text-[40px] md:leading-[48px] text-deep">{t('l.cta')}</h2>
              <p className="mt-2 text-body text-deep/80">{t('l.ctaSub')}</p>
            </div>
            <Button className="relative !bg-deep hover:!bg-black" onClick={seeker}>
              {t('l.ctaBtn')}
            </Button>
          </div>
        </Container>
      </section>

      {/* FOOTER */}
      <footer className="bg-deep text-white">
        <Container className="pt-16 pb-10">
          <div className="grid gap-10 md:grid-cols-[320px_1fr]">
            <div>
              <Logo reversed height={34} />
              <p className="mt-3 text-body-s text-white/75">{t('l.tagline')}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              <FooterCol title={t('l.ft.seekers')} items={[[t('l.nav.how'), () => scrollTo('how')], [t('l.ft.tracks'), () => nav('/matches')], [t('l.nav.signup'), seeker], [t('l.nav.login'), () => nav('/demo')]]} />
              <FooterCol title={t('l.ft.employers')} items={[[t('l.emp.pilot'), employer], [t('l.ft.pricing'), () => scrollTo('employers')], [t('l.ft.empLogin'), () => { setRole('employer'); nav('/employer/overview'); }]]} />
              <FooterCol title={t('l.ft.partners')} items={[[t('l.ft.career'), () => setToast('Demo: partner portal not included.')], [t('l.ft.peso'), () => setToast('Demo: partner portal not included.')]]} />
              <FooterCol title={t('l.ft.help')} items={[['FAQ', () => scrollTo('faq')], [t('l.ft.report'), () => nav('/report')], [t('l.ft.privacy'), () => nav('/consent')], [t('l.ft.terms'), () => setToast('Demo: Terms of Use page not included.')]]} />
            </div>
          </div>
          <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 text-caption text-white/70">
            <span>{t('l.copyright')}</span>
            <LangToggle short className="!bg-white/10 !border-white/20 [&_button[aria-pressed=false]]:text-white self-start" />
          </div>
        </Container>
      </footer>
      <Toast message={toast} onDone={() => setToast(null)} />
    </div>
  );
}

function FooterCol({ title, items }: { title: string; items: [string, () => void][] }) {
  return (
    <div>
      <h3 className="text-label font-sans text-lime">{title}</h3>
      <ul className="mt-3 space-y-2.5">
        {items.map(([l, fn]) => (
          <li key={l}>
            <button type="button" onClick={fn} className="text-body-s text-white/80 hover:text-white text-left focus-ring rounded">
              {l}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
