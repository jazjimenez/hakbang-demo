import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Award, BookOpen, Check, ChevronLeft, Clock, FileText, HelpCircle, PlayCircle, Search, Sparkles, Star, Users } from 'lucide-react';
import { AppHeader, MobileFooter } from '../../layouts/SeekerShell';
import { Accent, Button, Chip, Radio, TopBar, cx, useIsDesktop } from '../../components/ui';
import { useT } from '../../i18n';
import { useCourseSkills, useDemo, usePaolo } from '../../store';
import { CATEGORY_KEYS, COURSES, boostedMatch, courseById } from '../../data/courses';
import type { Course, Lesson } from '../../data/types';

const kindIcon = { video: PlayCircle, reading: FileText, quiz: HelpCircle } as const;

function useCourseState(id: string) {
  const done = useDemo((s) => s.lessonsDone[id] ?? []);
  const record = useDemo((s) => s.courseRecords.find((r) => r.courseId === id));
  const c = courseById(id)!;
  return { done, record, pct: record ? 1 : done.length / c.lessons.length, started: done.length > 0 || !!record };
}

function Stars({ rating, light }: { rating: number; light?: boolean }) {
  return (
    <span className={cx('inline-flex items-center gap-1 text-caption', light ? 'text-white/90' : 'text-ink')}>
      <Star size={13} className="fill-mango text-mango" aria-hidden />
      <b className="font-semibold">{rating.toFixed(1)}</b>
    </span>
  );
}

function ProviderTile({ c, size = 40 }: { c: Course; size?: number }) {
  const initials = c.providerName
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('');
  return (
    <span className="inline-flex items-center justify-center rounded-[10px] text-white font-semibold shrink-0 border-[1.5px] border-ink" style={{ width: size, height: size, background: c.tile, fontSize: size * 0.32 }} aria-hidden>
      {initials}
    </span>
  );
}

/* ---------------- course card (catalog) ---------------- */

function CourseCard({ c }: { c: Course }) {
  const t = useT();
  const { pct, record, started } = useCourseState(c.id);
  return (
    <li>
      <Link
        to={`/learn/${c.id}`}
        className="group flex flex-col h-full bg-cream border-[1.5px] border-ink rounded-[18px] overflow-hidden shadow-brut-sm transition-all duration-150 hover:shadow-brut hover:-translate-y-0.5 focus-ring"
      >
        {/* banner */}
        <div className="relative h-[92px] px-4 pt-3 flex items-start justify-between" style={{ background: c.tile }}>
          <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.12em] text-white/85">{t(CATEGORY_KEYS[c.category])}</span>
          <span className="hk-sticker inline-flex items-center h-6 px-2 rounded-[6px] bg-lime border border-ink font-mono text-[10.5px] font-semibold text-deep">{t('learn.free')}</span>
          {/* a tiny staircase, because of course */}
          <svg viewBox="0 0 80 40" className="absolute right-3 bottom-0 w-[80px] opacity-30" aria-hidden>
            {[10, 20, 30, 40].map((h, i) => (
              <rect key={i} x={i * 20} y={40 - h} width={20} height={h} fill="#fff" />
            ))}
          </svg>
          <span className="absolute left-4 -bottom-5">
            <ProviderTile c={c} size={40} />
          </span>
        </div>
        <div className="flex-1 flex flex-col px-4 pt-7 pb-4">
          <h3 className="text-title font-display leading-snug">{c.title}</h3>
          <div className="mt-1 text-caption text-muted">{c.providerName}</div>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-muted">
            <Stars rating={c.rating} />
            <span className="inline-flex items-center gap-1">
              <Users size={13} aria-hidden /> {t('learn.learners', { n: c.learners.toLocaleString('en-PH') })}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock size={13} aria-hidden /> {t('learn.hours', { n: c.hours })}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {c.skills.map((s) => (
              <span key={s} className="h-6 px-2 rounded-full border border-ink/25 text-[11.5px] font-medium inline-flex items-center">
                {s}
              </span>
            ))}
          </div>
          <div className="mt-auto pt-4">
            {record ? (
              <span className="inline-flex items-center gap-1.5 text-label text-green">
                <Award size={16} aria-hidden /> {t('learn.done')} · {record.score}%
              </span>
            ) : started ? (
              <div>
                <div className="h-1.5 rounded-full bg-line overflow-hidden" role="progressbar" aria-label={c.title} aria-valuenow={Math.round(pct * 100)} aria-valuemin={0} aria-valuemax={100}>
                  <div className="h-full bg-lime" style={{ width: `${pct * 100}%` }} />
                </div>
                <div className="mt-1.5 text-caption text-muted">{Math.round(pct * 100)}%</div>
              </div>
            ) : (
              <span className="text-caption text-muted">
                {c.level} · {t('learn.lessons', { n: c.lessons.length })}
              </span>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
}

/* ---------------- catalog ---------------- */

type Cat = 'all' | 'for-you' | Course['category'];

export function Learn() {
  const t = useT();
  const desktop = useIsDesktop();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<Cat>('all');
  const tracks = useDemo((s) => s.tracks);
  const lessonsDone = useDemo((s) => s.lessonsDone);
  const records = useDemo((s) => s.courseRecords);
  const forYou = useMemo(() => new Set(tracks.filter((x) => x.status === 'live').flatMap((x) => x.prepCourseIds ?? [])), [tracks]);
  const list = COURSES.filter((c) => (cat === 'all' ? true : cat === 'for-you' ? forYou.has(c.id) : c.category === cat)).filter((c) => {
    const s = q.trim().toLowerCase();
    return !s || [c.title, c.providerName, ...c.skills].some((x) => x.toLowerCase().includes(s));
  });
  const continuing = COURSES.filter((c) => (lessonsDone[c.id]?.length ?? 0) > 0 && !records.some((r) => r.courseId === c.id));

  return (
    <>
      <AppHeader />
      <div className={cx(desktop ? '' : 'px-5 pt-3 pb-8')}>
        <h1 className="font-display font-extrabold text-[34px] leading-[36px] lg:text-[48px] lg:leading-[48px] tracking-[-0.035em] [&_em]:text-green">
          <Accent text={t('learn.title')} />
        </h1>
        <p className="mt-2 text-body-s lg:text-body text-muted max-w-[620px]">{t('learn.sub')}</p>

        <label className="mt-5 flex items-center gap-2.5 h-12 px-4 rounded-[14px] bg-cream border-[1.5px] border-ink focus-within:shadow-brut-sm max-w-[560px]">
          <Search size={18} className="text-muted shrink-0" aria-hidden />
          <span className="sr-only">{t('learn.search')}</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('learn.search')} className="flex-1 bg-transparent text-body focus:outline-none placeholder:text-muted" />
        </label>

        <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <Chip selected={cat === 'all'} onClick={() => setCat('all')}>
            {t('learn.all')}
          </Chip>
          <Chip selected={cat === 'for-you'} onClick={() => setCat('for-you')} icon={Sparkles}>
            {t('learn.forYou')}
          </Chip>
          {(Object.keys(CATEGORY_KEYS) as Course['category'][]).map((k) => (
            <Chip key={k} selected={cat === k} onClick={() => setCat(k)}>
              {t(CATEGORY_KEYS[k])}
            </Chip>
          ))}
        </div>

        {continuing.length > 0 && cat === 'all' && !q && (
          <section className="mt-6">
            <h2 className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.14em] text-green">▪ {t('learn.inProgress')}</h2>
            <ul className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {continuing.map((c) => (
                <CourseCard key={c.id} c={c} />
              ))}
            </ul>
          </section>
        )}

        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <CourseCard key={c.id} c={c} />
          ))}
        </ul>
        {list.length === 0 && <p className="mt-10 text-center text-body text-muted">{t('learn.empty')}</p>}
      </div>
    </>
  );
}

/* ---------------- course detail ---------------- */

export function CourseDetail() {
  const t = useT();
  const nav = useNavigate();
  const { courseId = '' } = useParams();
  const c = courseById(courseId);
  const desktop = useIsDesktop();
  const { done, record, pct, started } = useCourseState(c?.id ?? COURSES[0].id);
  const track = useDemo((s) => s.tracks.find((x) => x.id === c?.trackId));
  const ff = useDemo((s) => s.ffFinishCourse);
  if (!c) return <p className="p-8">Course not found.</p>;
  const next = c.lessons.find((l) => !done.includes(l.id)) ?? c.lessons[0];
  const cta = record ? t('learn.review') : started ? t('learn.continue') : t('learn.start');

  const body = (
    <div className="space-y-5">
      <section className="bg-cream border-[1.5px] border-ink rounded-[18px] p-5 shadow-brut-sm">
        <h2 className="text-h-s font-display">{t('learn.whatYouLearn')}</h2>
        <ul className="mt-3 space-y-2">
          {c.outcomes.map((o) => (
            <li key={o} className="flex gap-2.5 text-body-s">
              <Check size={18} className="text-green shrink-0" aria-hidden />
              {o}
            </li>
          ))}
        </ul>
      </section>
      <section className="bg-cream border-[1.5px] border-ink rounded-[18px] p-5 shadow-brut-sm">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-h-s font-display">{t('learn.syllabus')}</h2>
          <span className="font-mono text-[11px] text-muted">{t('learn.progress', { a: record ? c.lessons.length : done.length, b: c.lessons.length })}</span>
        </div>
        <ol className="mt-3 divide-y divide-line">
          {c.lessons.map((l, i) => {
            const Icon = kindIcon[l.kind];
            const ok = record || done.includes(l.id);
            return (
              <li key={l.id}>
                <Link to={`/learn/${c.id}/${l.id}`} className="flex items-center gap-3 py-3 focus-ring rounded">
                  <span className="font-mono text-[11px] text-muted w-5">{String(i + 1).padStart(2, '0')}</span>
                  <Icon size={18} className={ok ? 'text-green' : 'text-muted'} aria-hidden />
                  <span className={cx('flex-1 text-body-s', ok && 'text-muted')}>{l.title}</span>
                  <span className="text-caption text-muted">
                    {t(`learn.kind.${l.kind}`)} · {t('learn.minutes', { n: l.minutes })}
                  </span>
                  {ok ? (
                    <span className="w-5 h-5 rounded-full bg-green text-white flex items-center justify-center">
                      <Check size={12} strokeWidth={3} aria-label={t('learn.done')} />
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full border-2 border-line" aria-hidden />
                  )}
                </Link>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );

  const side = (
    <aside className="space-y-4">
      <div className="bg-cream border-[1.5px] border-ink rounded-[18px] p-5 shadow-brut">
        {started && (
          <div className="mb-4">
            <div className="h-2 rounded-full bg-line overflow-hidden" role="progressbar" aria-label={c.title} aria-valuenow={Math.round(pct * 100)} aria-valuemin={0} aria-valuemax={100}>
              <div className="h-full bg-lime" style={{ width: `${pct * 100}%` }} />
            </div>
          </div>
        )}
        <Button block onClick={() => nav(`/learn/${c.id}/${record ? c.lessons[0].id : next.id}`)} data-guide="course-start">
          {cta}
        </Button>
        <p className="mt-3 text-caption text-muted">{t('learn.toProfile')}</p>
        <h3 className="mt-4 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{t('learn.skillsYouGain')}</h3>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {c.skills.map((s) => (
            <span key={s} className="h-7 px-2.5 rounded-full bg-mint border border-green/30 text-caption font-semibold text-green inline-flex items-center gap-1">
              <Award size={12} aria-hidden /> {s}
            </span>
          ))}
        </div>
        {!record && (
          <button type="button" onClick={() => ff(c.id)} className="mt-4 text-caption text-muted underline focus-ring rounded" data-guide="course-ff">
            {t('learn.ffDemo')}
          </button>
        )}
      </div>
      {track && (
        <Link to={`/tracks/${track.id}`} className="block bg-mint border-[1.5px] border-ink rounded-[18px] p-4 shadow-brut-sm hover:-translate-y-0.5 transition-transform focus-ring">
          <div className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.12em] text-green">{t('learn.prepFor', { track: '' }).trim()}</div>
          <div className="mt-1 text-title">{track.title}</div>
          <div className="text-caption text-muted">{c.providerName}</div>
        </Link>
      )}
    </aside>
  );

  return (
    <div className={cx('flex-1', !desktop && 'pb-6')}>
      {!desktop && <TopBar title={c.providerName} back="/learn" />}
      <header className={cx('relative overflow-hidden text-white border-[1.5px] border-ink', desktop ? 'rounded-[22px] p-8 shadow-brut' : 'mx-5 rounded-[18px] p-5')} style={{ background: c.tile }}>
        {desktop && (
          <Link to="/learn" className="inline-flex items-center gap-1 text-label text-white/80 hover:text-white focus-ring rounded">
            <ChevronLeft size={16} aria-hidden /> {t('learn.backToCourses')}
          </Link>
        )}
        <div className={cx('flex items-center gap-3', desktop && 'mt-4')}>
          <ProviderTile c={c} size={36} />
          <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-white/85">
            {t(CATEGORY_KEYS[c.category])} · {c.level}
          </div>
        </div>
        <h1 className="mt-3 font-display font-extrabold text-[28px] leading-[31px] lg:text-[40px] lg:leading-[42px] tracking-[-0.03em] max-w-[760px]">{c.title}</h1>
        <p className="mt-2 text-body-s lg:text-body text-white/85 max-w-[640px]">{c.summary}</p>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-caption text-white/85">
          <Stars rating={c.rating} light />
          <span>{t('learn.learners', { n: c.learners.toLocaleString('en-PH') })}</span>
          <span>{t('learn.hours', { n: c.hours })}</span>
          <span>{t('learn.lessons', { n: c.lessons.length })}</span>
          <span>{t('learn.by', { p: c.providerName })}</span>
        </div>
        {track && <div className="mt-3 inline-flex hk-sticker items-center h-7 px-2.5 rounded-[6px] bg-lime border border-ink font-mono text-[11px] font-semibold text-deep">{t('learn.prepFor', { track: track.shortTitle })}</div>}
      </header>
      {desktop ? (
        <div className="mt-6 grid grid-cols-[1fr_340px] gap-6 items-start">
          {body}
          {side}
        </div>
      ) : (
        <div className="px-5 mt-5 space-y-5">
          {side}
          {body}
        </div>
      )}
    </div>
  );
}

/* ---------------- lesson / quiz / certificate ---------------- */

function VideoLesson({ l, onWatched }: { l: Lesson; onWatched: () => void }) {
  const t = useT();
  const [p, setP] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setP((x) => Math.min(1, x + 0.05)), 90);
    return () => window.clearInterval(id);
  }, [playing]);
  useEffect(() => {
    if (p >= 1) {
      setPlaying(false);
      onWatched();
    }
  }, [p, onWatched]);
  return (
    <div>
      <div className="relative aspect-video rounded-[16px] border-[1.5px] border-ink bg-deep overflow-hidden shadow-brut-sm">
        <svg viewBox="0 0 160 90" className="absolute inset-0 w-full h-full opacity-25" aria-hidden>
          {[20, 40, 60, 80].map((h, i) => (
            <rect key={i} x={40 + i * 20} y={90 - h} width={20} height={h} fill="#5DB250" />
          ))}
        </svg>
        <button
          type="button"
          onClick={() => {
            setP(0);
            setPlaying(true);
          }}
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white focus-ring"
          aria-label={t('learn.play')}
        >
          <span className={cx('w-16 h-16 rounded-full bg-lime text-deep border-[1.5px] border-ink flex items-center justify-center shadow-step', playing && 'animate-pulse')}>
            <PlayCircle size={34} aria-hidden />
          </span>
          <span className="font-mono text-[12px] uppercase tracking-wider">{playing ? t('learn.playing') : `${t('learn.play')} · ${t('learn.minutes', { n: l.minutes })}`}</span>
        </button>
        <div className="absolute left-0 right-0 bottom-0 h-1.5 bg-white/15">
          <div className="h-full bg-lime transition-[width]" style={{ width: `${p * 100}%` }} />
        </div>
      </div>
      <p className="mt-2 text-caption text-muted">{t('learn.demoVideo')}</p>
    </div>
  );
}

function ReadingLesson({ c, l }: { c: Course; l: Lesson }) {
  return (
    <article className="bg-cream border-[1.5px] border-ink rounded-[16px] p-6 shadow-brut-sm space-y-3 text-body leading-[26px]" lang="en">
      <h2 className="text-h-m font-display">{l.title}</h2>
      <p>{c.summary}</p>
      <p>By the end of this course you will be able to:</p>
      <ul className="list-disc pl-6 space-y-1">
        {c.outcomes.map((o) => (
          <li key={o}>{o}</li>
        ))}
      </ul>
      <p className="text-muted text-body-s">Tip from {c.providerName}: practise each step once on your own before moving on. The quiz at the end only checks what is in these lessons.</p>
    </article>
  );
}

function Quiz({ c, onPass }: { c: Course; onPass: (score: number) => void }) {
  const t = useT();
  const [answers, setAnswers] = useState<(number | null)[]>(c.quiz.map(() => null));
  const [result, setResult] = useState<number | null>(null);
  const submit = () => {
    const right = c.quiz.filter((q, i) => answers[i] === q.answer).length;
    const score = Math.round((right / c.quiz.length) * 100);
    setResult(score);
    if (score >= 67) onPass(score);
  };
  return (
    <div className="space-y-4" lang="en">
      {c.quiz.map((q, qi) => (
        <fieldset key={qi} className="bg-cream border-[1.5px] border-ink rounded-[16px] p-5 shadow-brut-sm">
          <legend className="sr-only">{q.q}</legend>
          <div className="font-mono text-[11px] text-muted">Q{qi + 1}</div>
          <div className="mt-1 text-title">{q.q}</div>
          <div className="mt-3 space-y-2">
            {q.options.map((o, oi) => {
              const on = answers[qi] === oi;
              const show = result !== null;
              const right = show && oi === q.answer;
              const wrong = show && on && oi !== q.answer;
              return (
                <label
                  key={oi}
                  className={cx(
                    'flex items-center gap-3 rounded-[12px] border-[1.5px] px-3.5 py-3 cursor-pointer text-body-s',
                    right ? 'border-green bg-mint' : wrong ? 'border-red bg-red-tint' : on ? 'border-ink bg-paper' : 'border-ink/20 bg-cream',
                  )}
                >
                  <input type="radio" name={`q${qi}`} className="sr-only" checked={on} onChange={() => setAnswers(answers.map((a, i) => (i === qi ? oi : a)))} />
                  <Radio checked={on} />
                  {o}
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}
      {result !== null && result < 67 && (
        <p role="status" className="bg-mango-tint text-mango-ink rounded-[12px] px-4 py-3 text-body-s">
          {t('learn.quizFail', { n: result })}
        </p>
      )}
      <Button block={false} disabled={answers.some((a) => a === null)} onClick={result !== null && result < 67 ? () => { setAnswers(c.quiz.map(() => null)); setResult(null); } : submit} data-guide="quiz-submit">
        {result !== null && result < 67 ? t('learn.retry') : t('learn.submitQuiz')}
      </Button>
    </div>
  );
}

function Certificate({ c, score, boost }: { c: Course; score: number; boost?: { track: string; from: number; to: number } }) {
  const t = useT();
  const p = usePaolo();
  return (
    <div className="text-center py-4" role="status">
      <div className="mx-auto max-w-[520px] bg-cream border-[1.5px] border-ink rounded-[20px] shadow-brut-lime p-7 relative overflow-hidden">
        <svg viewBox="0 0 120 60" className="absolute right-0 bottom-0 w-[160px] opacity-15" aria-hidden>
          {[15, 30, 45, 60].map((h, i) => (
            <rect key={i} x={i * 30} y={60 - h} width={30} height={h} fill="#005D41" />
          ))}
        </svg>
        <span className="mx-auto w-16 h-16 rounded-full bg-lime border-[1.5px] border-ink flex items-center justify-center hk-drop">
          <Award size={32} className="text-deep" aria-hidden />
        </span>
        <div className="mt-4 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-green">Hakbang Learn · {t('learn.certTitle')}</div>
        <div className="mt-2 font-serif italic text-[30px] leading-[32px]">{p.name}</div>
        <div className="mt-2 text-title">{c.title}</div>
        <div className="text-caption text-muted">
          {c.providerName} · Apr 22, 2027 · {t('learn.quizPass', { n: score })}
        </div>
        <p className="mt-4 text-body-s">{t('learn.certSub', { skills: c.skills.join(', ') })}</p>
        {boost && boost.to > boost.from && (
          <p className="mt-2 inline-flex items-center gap-1.5 bg-mint text-green rounded-full px-3 h-8 text-label">
            <Sparkles size={14} aria-hidden /> {t('learn.certBoost', boost)}
          </p>
        )}
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button to="/profile" data-guide="see-profile">
          {t('learn.seeProfile')}
        </Button>
        <Button variant="secondary" to="/learn">
          {t('learn.backToCourses')}
        </Button>
      </div>
    </div>
  );
}

export function LessonView() {
  const t = useT();
  const nav = useNavigate();
  const desktop = useIsDesktop();
  const { courseId = '', lessonId = '' } = useParams();
  const c = courseById(courseId);
  const complete = useDemo((s) => s.completeLesson);
  const finish = useDemo((s) => s.finishCourse);
  const tracks = useDemo((s) => s.tracks);
  const skillsBefore = useCourseSkills();
  const { done } = useCourseState(c?.id ?? COURSES[0].id);
  const [passed, setPassed] = useState<{ score: number; boost?: { track: string; from: number; to: number } } | null>(null);
  const [watched, setWatched] = useState(false);
  useEffect(() => setWatched(false), [lessonId]);
  if (!c) return <p className="p-8">Course not found.</p>;
  const idx = Math.max(0, c.lessons.findIndex((l) => l.id === lessonId));
  const l = c.lessons[idx];
  const nextLesson = c.lessons[idx + 1];
  const markDone = () => {
    complete(c.id, l.id);
    nav(nextLesson ? `/learn/${c.id}/${nextLesson.id}` : `/learn/${c.id}`);
  };
  const onPass = (score: number) => {
    const track = tracks.find((x) => x.id === c.trackId);
    let boost;
    if (track) {
      const from = boostedMatch(track.match, track.requiredSkills, skillsBefore).total;
      const to = boostedMatch(track.match, track.requiredSkills, [...skillsBefore, ...c.skills]).total;
      boost = { track: track.shortTitle, from, to };
    }
    finish(c.id, score);
    setPassed({ score, boost });
  };

  const header = (
    <div className={cx(desktop ? 'mb-5' : 'px-5')}>
      <div className="flex gap-1" aria-hidden>
        {c.lessons.map((x, i) => (
          <span key={x.id} className={cx('h-1.5 flex-1 rounded-full', done.includes(x.id) || passed ? 'bg-lime' : i === idx ? 'bg-green' : 'bg-line')} />
        ))}
      </div>
      <div className="mt-3 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
        {String(idx + 1).padStart(2, '0')} / {String(c.lessons.length).padStart(2, '0')} · {t(`learn.kind.${l.kind}`)} · {t('learn.minutes', { n: l.minutes })}
      </div>
      <h1 className="mt-1 text-h-l font-display" lang="en">
        {l.title}
      </h1>
    </div>
  );

  const content = passed ? (
    <Certificate c={c} score={passed.score} boost={passed.boost} />
  ) : l.kind === 'video' ? (
    <VideoLesson l={l} onWatched={() => setWatched(true)} />
  ) : l.kind === 'reading' ? (
    <ReadingLesson c={c} l={l} />
  ) : (
    <Quiz c={c} onPass={onPass} />
  );

  const outline = (
    <aside className="bg-cream border-[1.5px] border-ink rounded-[18px] p-4 shadow-brut-sm">
      <Link to={`/learn/${c.id}`} className="text-label text-green focus-ring rounded inline-flex items-center gap-1">
        <BookOpen size={15} aria-hidden /> {c.title}
      </Link>
      <ol className="mt-3 space-y-1">
        {c.lessons.map((x, i) => {
          const Icon = kindIcon[x.kind];
          return (
            <li key={x.id}>
              <Link
                to={`/learn/${c.id}/${x.id}`}
                aria-current={x.id === l.id ? 'page' : undefined}
                className={cx('flex items-center gap-2 rounded-[10px] px-2.5 py-2 text-body-s focus-ring', x.id === l.id ? 'bg-mint font-semibold' : 'hover:bg-paper')}
              >
                <span className="font-mono text-[10.5px] text-muted w-4">{i + 1}</span>
                <Icon size={15} className={done.includes(x.id) ? 'text-green' : 'text-muted'} aria-hidden />
                <span className="flex-1 truncate" lang="en">
                  {x.title}
                </span>
                {done.includes(x.id) && <Check size={14} className="text-green" aria-label={t('learn.done')} />}
              </Link>
            </li>
          );
        })}
      </ol>
    </aside>
  );

  if (desktop)
    return (
      <div className="grid grid-cols-[1fr_320px] gap-8 items-start">
        <div>
          {header}
          {content}
          {!passed && l.kind !== 'quiz' && (
            <div className="mt-6 flex justify-end">
              <Button onClick={markDone} data-guide="lesson-next" variant={l.kind === 'video' && !watched ? 'secondary' : 'primary'}>
                {t('learn.markDone')}
              </Button>
            </div>
          )}
        </div>
        {outline}
      </div>
    );

  return (
    <div className="flex-1 flex flex-col">
      <TopBar title={c.title} back={`/learn/${c.id}`} />
      {header}
      <div className="px-5 mt-4 pb-6 flex-1">{content}</div>
      {!passed && l.kind !== 'quiz' && (
        <MobileFooter>
          <Button block onClick={markDone} data-guide="lesson-next" variant={l.kind === 'video' && !watched ? 'secondary' : 'primary'}>
            {t('learn.markDone')}
          </Button>
        </MobileFooter>
      )}
    </div>
  );
}
