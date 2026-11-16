import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Building2, Check, GraduationCap, Send, User } from 'lucide-react';
import { NavBrand } from '../components/Brand';
import { Accent, Button, Field, TopBar, cx } from '../components/ui';
import { CREDITS } from '../data/credits';
import { useT } from '../i18n';

function SiteShell({ children }: { children: React.ReactNode }) {
  const nav = useNavigate();
  return (
    <div className="min-h-[calc(100vh-28px)] bg-paper">
      <header className="bg-deep">
        <div className="max-w-[1100px] mx-auto px-5 h-[72px] flex items-center gap-4">
          <NavBrand to="/" reversed size={28} />
          <button type="button" onClick={() => nav(-1)} className="ml-auto inline-flex items-center gap-1.5 text-label text-white/85 hover:text-lime focus-ring rounded">
            <ArrowLeft size={16} aria-hidden /> Back
          </button>
        </div>
      </header>
      <main className="max-w-[720px] mx-auto px-5 py-12">{children}</main>
    </div>
  );
}

/* ---------------- Contact / partner form ---------------- */

type Who = 'employer' | 'school' | 'seeker';

export function Contact() {
  const t = useT();
  const q = new URLSearchParams(useLocation().search);
  const [who, setWho] = useState<Who>((q.get('topic') as Who) || 'employer');
  const [sent, setSent] = useState(false);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };
  const opts: [Who, string, typeof User][] = [
    ['employer', t('contact.employer'), Building2],
    ['school', t('contact.school'), GraduationCap],
    ['seeker', t('contact.seeker'), User],
  ];
  return (
    <SiteShell>
      <h1 className="font-display font-extrabold text-[40px] leading-[42px] tracking-[-0.035em] [&_em]:text-green">
        <Accent text={t('contact.title')} />
      </h1>
      <p className="mt-2 text-body text-muted">{t('contact.sub')}</p>
      {sent ? (
        <div role="status" className="mt-8 bg-cream border-[1.5px] border-ink rounded-[18px] shadow-brut-lime p-6 flex gap-4 items-start">
          <span className="w-10 h-10 rounded-full bg-lime border-[1.5px] border-ink flex items-center justify-center shrink-0">
            <Check size={20} className="text-deep" aria-hidden />
          </span>
          <div>
            <p className="text-title">{t('contact.sent')}</p>
            <Link to="/" className="mt-3 inline-block text-label text-green underline focus-ring rounded">
              Hakbang →
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-8 bg-cream border-[1.5px] border-ink rounded-[18px] shadow-brut p-6 space-y-5">
          <fieldset>
            <legend className="text-label">{t('contact.who')}</legend>
            <div className="mt-2 grid sm:grid-cols-3 gap-2">
              {opts.map(([v, l, Icon]) => (
                <label key={v} className={cx('flex items-center gap-2 rounded-[12px] border-[1.5px] px-3 py-3 cursor-pointer text-label', who === v ? 'border-ink bg-mint' : 'border-ink/20 bg-cream')}>
                  <input type="radio" name="who" className="sr-only" checked={who === v} onChange={() => setWho(v)} />
                  <Icon size={17} className="text-green" aria-hidden />
                  {l}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={t('contact.name')} required />
            <Field label={t('contact.email')} type="email" required />
            {who !== 'seeker' && <Field className="sm:col-span-2" label={t('contact.org')} />}
          </div>
          <label className="block">
            <span className="text-body-s text-muted">{t('contact.msg')}</span>
            <textarea rows={4} className="mt-2 w-full rounded-input border border-line bg-white p-4 text-body focus:outline-none focus:border-green" />
          </label>
          <Button type="submit" icon={Send}>
            {t('contact.send')}
          </Button>
        </form>
      )}
    </SiteShell>
  );
}

/* ---------------- Legal (demo copy) ---------------- */

const LEGAL = {
  privacy: {
    title: 'Privacy Notice',
    body: [
      ['What we collect', 'Your name, school, course, location, skills, schedule, resume, and the courses you finish on Hakbang Learn.'],
      ['Who can see it', 'Only the employers you apply to (or all verified employers, if you choose). Your contact number stays hidden until an employer accepts you. Partner schools and LGU PESOs see counts only, never your profile.'],
      ['Why', 'To match you with training tracks, share your profile with employers you apply to, and show your progress.'],
      ['Your rights', 'Under the Data Privacy Act of 2012 (RA 10173) you can access, correct, download or delete your data at any time from your profile or by contacting us.'],
    ],
  },
  terms: {
    title: 'Terms of Use',
    body: [
      ['Free for job seekers', 'Job seekers never pay Hakbang or any employer. An employer who asks a trainee for money is removed.'],
      ['Verified employers', 'Employers must pass verification (BIR 2303, SEC or DTI, business permit, partner agreement) before a track goes live.'],
      ['Hiring commitment', 'Each track states its hiring commitment, length, allowance and criteria. Employers pay a success fee only when a hire is confirmed by both sides.'],
      ['Reports', 'Every report is reviewed within 48 hours.'],
    ],
  },
} as const;

export function Legal() {
  const { doc } = useParams();
  if (doc === 'credits') return <Credits />;
  const d = LEGAL[doc === 'terms' ? 'terms' : 'privacy'];
  return (
    <SiteShell>
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Demo document · final text from the team</p>
      <h1 className="mt-2 font-display font-extrabold text-[40px] leading-[42px] tracking-[-0.035em]">{d.title}</h1>
      <div className="mt-8 space-y-4">
        {d.body.map(([h, p], i) => (
          <section key={h} className="bg-cream border-[1.5px] border-ink rounded-[16px] p-5 shadow-brut-sm">
            <h2 className="text-title flex items-center gap-2">
              <span className="font-mono text-[11px] text-muted">0{i + 1}</span> {h}
            </h2>
            <p className="mt-1.5 text-body-s text-muted">{p}</p>
          </section>
        ))}
      </div>
      <p className="mt-6 text-caption text-muted">
        <Link to={`/legal/${doc === 'terms' ? 'privacy' : 'terms'}`} className="text-green underline focus-ring rounded">
          {doc === 'terms' ? 'Privacy Notice' : 'Terms of Use'} →
        </Link>
      </p>
    </SiteShell>
  );
}

/* ---------------- Support chat (canned replies) ---------------- */

interface Msg {
  from: 'me' | 'ana';
  text: string;
}

export function Support() {
  const t = useT();
  const [msgs, setMsgs] = useState<Msg[]>([{ from: 'ana', text: t('support.hi') }]);
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    end.current?.scrollIntoView({ block: 'end' });
  }, [msgs, typing]);
  const send = (body: string, reply = t('support.reply')) => {
    if (!body.trim()) return;
    setMsgs((m) => [...m, { from: 'me', text: body }]);
    setText('');
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { from: 'ana', text: reply }]);
    }, 900);
  };
  const quick: [string, string][] = [
    [t('support.q1'), t('support.a1')],
    [t('support.q2'), t('support.a2')],
  ];
  return (
    <div className="flex-1 flex flex-col lg:max-w-[640px] lg:mx-auto lg:w-full">
      <TopBar title={t('support.title')} back={-1} />
      <div className="flex-1 px-5 pb-4 space-y-3" role="log" aria-live="polite">
        {msgs.map((m, i) => (
          <div key={i} className={cx('flex', m.from === 'me' ? 'justify-end' : 'justify-start')}>
            <p
              className={cx(
                'max-w-[80%] rounded-[16px] px-4 py-2.5 text-body-s border-[1.5px] border-ink',
                m.from === 'me' ? 'bg-green text-white rounded-br-[4px]' : 'bg-cream rounded-bl-[4px] shadow-brut-sm',
              )}
            >
              {m.text}
            </p>
          </div>
        ))}
        {typing && <p className="text-caption text-muted">Ana…</p>}
        <div ref={end} />
      </div>
      <div className="sticky bottom-0 bg-paper border-t-[1.5px] border-ink px-5 pt-3 pb-5 space-y-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {quick.map(([q, a]) => (
            <button key={q} type="button" onClick={() => send(q, a)} className="shrink-0 h-9 px-3.5 rounded-full border-[1.5px] border-ink/25 bg-cream text-label hover:border-ink focus-ring">
              {q}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(text);
          }}
          className="flex gap-2"
        >
          <label className="sr-only" htmlFor="support-msg">
            {t('support.placeholder')}
          </label>
          <input id="support-msg" value={text} onChange={(e) => setText(e.target.value)} placeholder={t('support.placeholder')} className="flex-1 h-12 rounded-[14px] border-[1.5px] border-ink bg-cream px-4 text-body focus:outline-none" />
          <Button type="submit" aria-label="Send" icon={Send} disabled={!text.trim()}>
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}

/* ---------------- Photo credits ---------------- */

function Credits() {
  return (
    <SiteShell>
      <h1 className="font-display font-extrabold text-[40px] leading-[42px] tracking-[-0.035em]">Photo credits</h1>
      <p className="mt-3 text-body text-muted">
        Hakbang is a student demo prototype. People, companies and data in the app are fictional. These images belong to their owners and are used
        temporarily as placeholders, not for any commercial purpose. If you own one and want it removed, contact us and we will take it down right away.
      </p>
      <ul className="mt-8 space-y-4">
        {CREDITS.map((c) => (
          <li key={c.src} className="bg-cream border-[1.5px] border-ink rounded-[16px] p-4 shadow-brut-sm flex gap-4 items-start">
            <img src={c.src} alt={c.alt} referrerPolicy="no-referrer" className="w-[120px] h-[72px] object-cover rounded-[10px] border border-ink/20 shrink-0" />
            <div className="min-w-0">
              <div className="text-title">{c.owner}</div>
              <p className="mt-1 text-body-s text-muted">{c.note}</p>
              <a href={c.sourceUrl} target="_blank" rel="noreferrer" className="mt-1 inline-block text-caption text-green underline break-all">
                {c.sourceUrl}
              </a>
            </div>
          </li>
        ))}
        {CREDITS.length === 0 && <li className="text-body text-muted">No third-party photos are in use.</li>}
      </ul>
      <p className="mt-6 text-body-s">
        <Link to="/contact" className="text-green underline focus-ring rounded">
          Contact us about an image →
        </Link>
      </p>
    </SiteShell>
  );
}
