import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Building2, Check, ChevronRight, FileText, Lock, Plus, Sparkles, Upload as UploadIcon, Users, X } from 'lucide-react';
import { Logo, NavBrand, Swoosh } from '../../components/Brand';
import { Accent, Button, Checkbox, Field, IconTile, LangToggle, ProgressBar, TopBar, cx, useIsDesktop } from '../../components/ui';
import { MobileFooter } from '../../layouts/SeekerShell';
import { useT } from '../../i18n';
import { useDemo, usePaolo } from '../../store';

/* ---------- shared bits ---------- */

function Promises({ className }: { className?: string }) {
  const t = useT();
  return (
    <ul className={cx('space-y-3', className)}>
      {['promise.free', 'promise.verified', 'promise.commitment'].map((k) => (
        <li key={k} className="flex items-center gap-3 text-body font-semibold">
          <span className="w-6 h-6 rounded-full bg-lime text-white flex items-center justify-center shrink-0">
            <Check size={15} strokeWidth={3} aria-hidden />
          </span>
          {t(k)}
        </li>
      ))}
    </ul>
  );
}

function ProviderButtons({ onPick, dark }: { onPick: () => void; dark?: boolean }) {
  // TODO(team): neutral placeholders — swap for official provider assets per each brand's guidelines.
  return (
    <div className="grid grid-cols-3 gap-3">
      {['Google', 'Apple', 'Facebook'].map((p) => (
        <button
          key={p}
          type="button"
          onClick={onPick}
          className={cx(
            'flex items-center justify-center gap-2 rounded-btn border focus-ring',
            dark ? 'h-[74px] flex-col bg-white/10 border-white/40 text-white hover:bg-white/15' : 'h-[46px] bg-white border-line text-ink hover:bg-paper text-label',
          )}
        >
          <span className={cx('rounded-[5px] border border-dashed', dark ? 'w-6 h-6 border-white/60' : 'w-4 h-4 border-muted/60')} aria-hidden />
          {p}
        </button>
      ))}
    </div>
  );
}

function StepBars({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div className="flex gap-1.5" aria-hidden>
      {[1, 2, 3].map((i) => (
        <span key={i} className={cx('h-1.5 flex-1 rounded-full', i <= step ? 'bg-lime' : 'bg-line')} />
      ))}
    </div>
  );
}

/* ---------- S01 / D01 Sign up ---------- */

export function Signup() {
  const t = useT();
  const nav = useNavigate();
  const desktop = useIsDesktop();
  const s = useDemo();
  const next = () => {
    s.signUp();
    s.setRole('seeker');
    nav(s.onboarding.consented ? '/onboarding/upload' : '/consent');
  };
  const login = () => {
    s.setRole('seeker');
    nav(s.onboarding.profileSaved ? '/matches' : '/consent');
  };

  if (desktop) {
    const submit = (e: FormEvent) => {
      e.preventDefault();
      next();
    };
    return (
      <div className="min-h-[calc(100vh-28px)] grid grid-cols-[minmax(0,800px)_1fr] bg-white">
        <div className="relative bg-deep text-white overflow-hidden px-[72px] py-16 flex flex-col justify-center">
          <Swoosh className="w-[900px] -left-[160px] top-[220px]" opacity={0.18} />
          {/* TODO(team): hero photo placeholder */}
          <div className="relative rounded-panel border border-dashed border-white/30 bg-white/5 h-[300px] flex items-end p-6 text-caption text-white/60">{t('l.heroPhoto')}</div>
          <div className="relative mt-8">
            <Logo reversed height={40} />
            <h1 className="mt-6 font-display font-extrabold text-[44px] leading-[44px] tracking-[-0.04em] [&_em]:text-lime"><Accent text={t('signup.headline')} /></h1>
            <Promises className="mt-6" />
          </div>
        </div>
        <div className="relative flex items-center justify-center px-10 py-16">
          <LangToggle short className="absolute top-8 right-10" />
          <form onSubmit={submit} className="w-full max-w-[440px]">
            <h2 className="text-h-l">{t('signup.create')}</h2>
            <p className="mt-2 text-body text-muted">{t('signup.createSub')}</p>
            <Field className="mt-6" label={t('signup.emailLabel')} type="email" defaultValue="paolo.reyes@example.com" autoComplete="off" />
            <Field className="mt-4" label={t('signup.passwordLabel')} type="password" defaultValue="demo-password" autoComplete="off" />
            <Button type="submit" block className="mt-5" onClick={next} data-guide="onboard">
              {t('signup.email')}
            </Button>
            <div className="my-5 flex items-center gap-3 text-caption text-muted">
              <span className="h-px flex-1 bg-line" />
              {t('signup.or')}
              <span className="h-px flex-1 bg-line" />
            </div>
            <ProviderButtons onPick={next} />
            <p className="mt-5 text-caption text-muted">{t('signup.agree')}</p>
            <p className="mt-3 text-body-s text-muted">
              {t('signup.haveAccount')}{' '}
              <button type="button" onClick={login} className="text-green font-semibold focus-ring rounded">
                {t('signup.login')}
              </button>
            </p>
            <p className="mt-6 text-caption text-muted">{t('signup.providerNote')}</p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-28px)] bg-deep text-white overflow-hidden">
      <Swoosh className="w-[760px] -left-[220px] top-[260px]" opacity={0.16} />
      <div className="relative max-w-[480px] mx-auto px-5 pt-5 pb-10 flex flex-col min-h-[calc(100vh-28px)]">
        <div className="flex items-start justify-between gap-3">
          {/* TODO(team): hero photo placeholder */}
          <span className="text-caption text-white/50 pt-2">{t('l.heroPhoto')}</span>
          <LangToggle />
        </div>
        <div className="flex-1 flex flex-col justify-center text-center pt-10">
          <Logo reversed height={44} className="mx-auto" />
          <h1 className="mt-6 font-display font-extrabold text-[40px] leading-[40px] tracking-[-0.04em] [&_em]:text-lime"><Accent text={t('signup.headline')} /></h1>
          <p className="mt-4 text-body text-white/85">{t('signup.sub')}</p>
          <Promises className="mt-6 inline-flex flex-col items-start mx-auto text-left" />
        </div>
        <div className="mt-8">
          <Button variant="onDark" block onClick={next} data-guide="onboard">
            {t('signup.email')}
          </Button>
          <div className="my-4 flex items-center gap-3 text-caption text-white/70">
            <span className="h-px flex-1 bg-white/25" />
            {t('signup.or')}
            <span className="h-px flex-1 bg-white/25" />
          </div>
          <ProviderButtons dark onPick={next} />
          <p className="mt-5 text-center text-body-s">
            {t('signup.haveAccount')}{' '}
            <button type="button" onClick={login} className="text-lime font-semibold focus-ring rounded">
              {t('signup.login')}
            </button>
          </p>
          <p className="mt-3 text-center text-caption text-white/50">{t('signup.providerNote')}</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- S02 Consent ---------- */

export function Consent() {
  const t = useT();
  const nav = useNavigate();
  const s = useDemo();
  const [agree, setAgree] = useState(s.onboarding.consented);
  const [full, setFull] = useState(false);
  const items = [
    [FileText, 'consent.collect', 'consent.collectD'],
    [Users, 'consent.who', 'consent.whoD'],
    [Building2, 'consent.schools', 'consent.schoolsD'],
    [Lock, 'consent.control', 'consent.controlD'],
  ] as const;
  return (
    <div className="min-h-[calc(100vh-28px)] bg-paper">
      <div className="max-w-[480px] lg:max-w-[640px] mx-auto min-h-[calc(100vh-28px)] flex flex-col lg:py-10">
        <TopBar title={t('consent.top')} back="/signup" />
        <div className="px-5 pb-6 flex-1">
          <h1 className="mt-2 text-h-l lg:text-display">{t('consent.title')}</h1>
          <p className="mt-3 text-body-s text-muted">{t('consent.sub')}</p>
          <ul className="mt-5 bg-cream border-[1.5px] border-ink rounded-card shadow-brut-sm divide-y divide-line">
            {items.map(([Icon, h, d]) => (
              <li key={h} className="flex gap-3.5 p-4">
                <IconTile icon={Icon} size={40} />
                <div>
                  <div className="text-title">{t(h)}</div>
                  <div className="text-body-s text-muted mt-0.5">{t(d)}</div>
                </div>
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => setFull(!full)} aria-expanded={full} className="mt-5 inline-flex items-center gap-1 text-label text-green focus-ring rounded">
            {t('consent.full')} <ChevronRight size={16} className={cx('transition-transform', full && 'rotate-90')} aria-hidden />
          </button>
          {full && (
            <div className="mt-3 text-body-s text-muted bg-white border border-line rounded-[16px] p-4 space-y-2">
              <p>Demo Privacy Notice (summary). Hakbang processes your data under the Data Privacy Act of 2012 (RA 10173) only to match you with training tracks and share your profile with the employers you apply to.</p>
              <p>Contact number stays hidden until an employer accepts you. Partner schools and PESO receive counts only. You can export or delete your data anytime.</p>
            </div>
          )}
        </div>
        <MobileFooter className="lg:static lg:border-0 lg:bg-transparent">
          <Checkbox checked={agree} onChange={setAgree}>
            {t('consent.agree')}
          </Checkbox>
          <Button
            block
            data-guide="onboard"
            disabled={!agree}
            onClick={() => {
              s.consent();
              nav('/onboarding/upload');
            }}
          >
            {t('consent.cta')}
          </Button>
        </MobileFooter>
      </div>
    </div>
  );
}

/* ---------- S03 / S04 / D02 ---------- */

type UploadState = 'idle' | 'reading' | 'done';

function useFakeUpload() {
  const uploaded = useDemo((s) => s.onboarding.resumeUploaded);
  const mark = useDemo((s) => s.uploadResume);
  const [state, setState] = useState<UploadState>(uploaded ? 'done' : 'idle');
  const [pct, setPct] = useState(uploaded ? 1 : 0);
  const timer = useRef<number>();
  const start = () => {
    setState('reading');
    setPct(0.08);
    window.clearInterval(timer.current);
    timer.current = window.setInterval(() => {
      setPct((p) => {
        const n = p + 0.09;
        if (n >= 1) {
          window.clearInterval(timer.current);
          setState('done');
          mark();
          return 1;
        }
        return n;
      });
    }, 140);
  };
  useEffect(() => () => window.clearInterval(timer.current), []);
  return { state, pct, start };
}

function Dropzone({ onPick, big }: { onPick: () => void; big?: boolean }) {
  const t = useT();
  return (
    <button
      type="button"
      data-guide="onboard"
      onClick={onPick}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        onPick();
      }}
      className={cx('w-full rounded-card border-2 border-dashed border-green bg-white/40 hover:bg-mint/40 flex flex-col items-center justify-center text-center focus-ring', big ? 'h-[190px]' : 'h-[175px]')}
    >
      <span className="w-14 h-14 rounded-full bg-mint text-green flex items-center justify-center">
        <UploadIcon size={24} aria-hidden />
      </span>
      <span className="mt-3 text-title text-green">{big ? t('upload.drag') : t('upload.choose')}</span>
      <span className="mt-1.5 text-caption text-muted">{t('upload.types')}</span>
    </button>
  );
}

function FileCard({ state, pct }: { state: UploadState; pct: number }) {
  const t = useT();
  if (state === 'idle') return null;
  return (
    <div className="mt-4 bg-cream border-[1.5px] border-ink rounded-card shadow-brut-sm p-4" aria-live="polite">
      <div className="flex items-center gap-3">
        <IconTile icon={FileText} size={40} />
        <div>
          <div className="text-title">Paolo_Reyes_Resume.pdf</div>
          {state === 'reading' ? (
            <div className="text-caption text-muted">182 KB</div>
          ) : (
            <div className="text-caption text-green flex items-center gap-1">
              <Check size={13} aria-hidden /> {t('upload.read')}
            </div>
          )}
        </div>
      </div>
      {state === 'reading' && (
        <>
          <div className="mt-3 flex items-center gap-1.5 text-caption text-green font-semibold">
            <Sparkles size={14} aria-hidden /> {t('upload.reading')}
          </div>
          <ProgressBar className="mt-2" value={pct} height={6} />
        </>
      )}
    </div>
  );
}

export function Upload() {
  const desktop = useIsDesktop();
  if (desktop) return <BuildProfileDesktop />;
  return <UploadMobile />;
}

function UploadMobile() {
  const t = useT();
  const nav = useNavigate();
  const { state, pct, start } = useFakeUpload();
  return (
    <div className="min-h-[calc(100vh-28px)] bg-paper">
      <div className="max-w-[480px] mx-auto min-h-[calc(100vh-28px)] flex flex-col">
        <TopBar title={t('build.top')} back="/consent" />
        <div className="px-5 flex-1">
          <StepBars step={1} />
          <p className="mt-2 text-caption text-muted">{t('build.step1')}</p>
          <h1 className="mt-4 text-h-l">{t('upload.title')}</h1>
          <p className="mt-2 text-body text-muted">{t('upload.sub')}</p>
          <div className="mt-6">
            <Dropzone onPick={start} />
            <FileCard state={state} pct={pct} />
          </div>
        </div>
        <MobileFooter>
          <Button block disabled={state !== 'done'} onClick={() => nav('/onboarding/review')} data-guide="onboard">
            {t('upload.cta')}
          </Button>
          <button type="button" onClick={() => nav('/onboarding/review?manual=1')} className="w-full text-center text-label text-green py-1 focus-ring rounded">
            {t('upload.manual')}
          </button>
        </MobileFooter>
      </div>
    </div>
  );
}

const SEED_AVAIL = 'Weekends, and weekdays after 6 PM';

function useProfileForm() {
  const t = useT();
  const p = usePaolo();
  const manual = new URLSearchParams(useLocation().search).has('manual');
  const [f, setF] = useState({
    name: manual ? '' : p.name,
    course: manual ? '' : p.course,
    school: manual ? '' : p.school,
    gradYear: manual ? '' : String(p.gradYear),
    city: manual ? '' : p.city,
    // seed availability is stored in English; show the Figma Filipino copy in FIL mode
    availability: manual ? '' : p.availability === SEED_AVAIL ? t('review.availDefault') : p.availability,
    skills: manual ? [] : p.skills,
  });
  return { f, setF, ai: !manual };
}

function ProfileFields({ form, desktop }: { form: ReturnType<typeof useProfileForm>; desktop?: boolean }) {
  const t = useT();
  const { f, setF, ai } = form;
  const [adding, setAdding] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const up = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });
  const addSkill = () => {
    const v = newSkill.trim();
    if (v && !f.skills.includes(v)) setF({ ...f, skills: [...f.skills, v] });
    setNewSkill('');
    setAdding(false);
  };
  return (
    <div className={cx('grid gap-4', desktop ? 'grid-cols-2' : 'grid-cols-[1fr_100px]')}>
      <Field className={desktop ? '' : 'col-span-2'} label={t('review.name')} ai={ai} value={f.name} onChange={up('name')} />
      <Field className={desktop ? '' : 'col-span-2'} label={t('review.course')} ai={ai} value={f.course} onChange={up('course')} />
      <Field label={t('review.school')} ai={ai} value={f.school} onChange={up('school')} />
      <Field label={t('review.grad')} ai={ai} value={f.gradYear} onChange={up('gradYear')} inputMode="numeric" />
      <Field className={desktop ? '' : 'col-span-2'} label={t('review.city')} ai={ai} value={f.city} onChange={up('city')} />
      <Field className={desktop ? '' : 'col-span-2'} label={t('review.avail')} value={f.availability} onChange={up('availability')} />
      <div className="col-span-2">
        <div className="text-body-s text-muted mb-2">{t('review.skills')}</div>
        <ul className="flex flex-wrap gap-2">
          {f.skills.map((sk) => (
            <li key={sk}>
              <span className="inline-flex items-center gap-1 h-9 pl-3.5 pr-1.5 rounded-full bg-white border border-line text-label">
                {sk}
                <button type="button" aria-label={`Remove ${sk}`} onClick={() => setF({ ...f, skills: f.skills.filter((x) => x !== sk) })} className="w-6 h-6 rounded-full hover:bg-paper flex items-center justify-center text-muted focus-ring">
                  <X size={14} />
                </button>
              </span>
            </li>
          ))}
          <li>
            {adding ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addSkill();
                }}
                className="flex gap-1.5"
              >
                <input
                  autoFocus
                  aria-label={t('review.newSkill')}
                  placeholder={t('review.newSkill')}
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onBlur={addSkill}
                  className="h-9 w-40 rounded-full border border-green px-3.5 text-label focus:outline-none"
                />
              </form>
            ) : (
              <button type="button" onClick={() => setAdding(true)} className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full border border-dashed border-green text-green text-label focus-ring">
                <Plus size={15} aria-hidden /> {t('review.addSkill')}
              </button>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}

function AiNote() {
  const t = useT();
  return (
    <p className="flex gap-3 items-start bg-mint text-ink text-body-s rounded-[14px] px-4 py-3">
      <Sparkles size={18} className="text-green shrink-0 mt-px" aria-hidden />
      {t('review.note')}
    </p>
  );
}

export function Review() {
  const desktop = useIsDesktop();
  if (desktop) return <BuildProfileDesktop />;
  return <ReviewMobile />;
}

function useSave(form: ReturnType<typeof useProfileForm>) {
  const nav = useNavigate();
  const save = useDemo((s) => s.saveProfile);
  return () => {
    const { f } = form;
    const name = f.name.trim() || 'Paolo Reyes';
    const parts = name.split(/\s+/);
    save({
      name,
      firstName: parts[0],
      initials: (parts[0][0] + (parts[parts.length - 1][0] ?? '')).toUpperCase(),
      course: f.course,
      school: f.school,
      gradYear: Number(f.gradYear) || 2025,
      city: f.city,
      availability: f.availability,
      skills: f.skills,
    });
    nav('/matches');
  };
}

function ReviewMobile() {
  const t = useT();
  const form = useProfileForm();
  const save = useSave(form);
  return (
    <div className="min-h-[calc(100vh-28px)] bg-paper">
      <div className="max-w-[480px] mx-auto min-h-[calc(100vh-28px)] flex flex-col">
        <TopBar title={t('build.top')} back="/onboarding/upload" />
        <div className="px-5 pb-6 flex-1">
          <StepBars step={2} />
          <p className="mt-2 text-caption text-muted">{t('build.step2')}</p>
          <h1 className="mt-4 text-h-l">{t('review.title')}</h1>
          {form.ai && (
            <div className="mt-4">
              <AiNote />
            </div>
          )}
          <div className="mt-5">
            <ProfileFields form={form} />
          </div>
        </div>
        <MobileFooter>
          <Button block onClick={save} data-guide="onboard">
            {t('review.save')}
          </Button>
        </MobileFooter>
      </div>
    </div>
  );
}

/** D02: upload + AI review side by side. */
function BuildProfileDesktop() {
  const t = useT();
  const nav = useNavigate();
  const { state, pct, start } = useFakeUpload();
  const form = useProfileForm();
  const save = useSave(form);
  const ready = state === 'done' || !form.ai;
  return (
    <div className="min-h-[calc(100vh-28px)] bg-paper">
      <header className="bg-white border-b border-line">
        <div className="max-w-[1440px] mx-auto h-[72px] px-[56px] flex items-center">
          <NavBrand to="/" size={30} />
          <div className="ml-auto flex items-center gap-3 w-[260px]">
            <div className="flex-1">
              <StepBars step={ready ? 2 : 1} />
            </div>
            <span className="text-caption text-muted whitespace-nowrap">{ready ? t('build.step2') : t('build.step1')}</span>
          </div>
        </div>
      </header>
      <main className="max-w-[1200px] mx-auto px-8 py-10">
        <h1 className="text-h-l">{t('build.top')}</h1>
        <div className="mt-6 grid grid-cols-[440px_1fr] gap-8 items-start">
          <div>
            <Dropzone big onPick={start} />
            <FileCard state={state} pct={pct} />
            <p className="mt-4 text-body-s text-muted">{t('upload.sub')}</p>
          </div>
          <section className={cx('bg-cream border-[1.5px] border-ink rounded-panel shadow-brut p-7 transition-opacity', !ready && 'opacity-50 pointer-events-none')} aria-disabled={!ready}>
            <h2 className="text-h-m">{t('review.title')}</h2>
            {form.ai && (
              <div className="mt-4 mb-5">
                <AiNote />
              </div>
            )}
            <ProfileFields form={form} desktop />
            <div className="mt-7 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => nav('/consent')}>
                {t('review.back')}
              </Button>
              <Button onClick={save} data-guide="onboard">
                {t('review.save')}
              </Button>
            </div>
          </section>
        </div>
        {!ready && (
          <button type="button" onClick={() => nav('/onboarding/review?manual=1')} className="mt-4 text-label text-green focus-ring rounded">
            {t('upload.manual')}
          </button>
        )}
      </main>
    </div>
  );
}
