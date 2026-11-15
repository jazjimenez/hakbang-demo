import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Compass, FastForward, Minus, RotateCcw, X } from 'lucide-react';
import { useDemo } from '../store';
import { BLUEHARBOR_ID, MAIN_TRACK_ID, PAOLO_ID } from '../data/seed';
import { cx } from '../components/ui';
import type { Role } from '../data/types';

type State = ReturnType<typeof useDemo.getState>;

interface Step {
  who: string;
  title: string;
  hint: string;
  role: Role;
  to: string;
  /** data-guide hook(s) to pulse on the page */
  hook: string | string[];
  done: (s: State) => boolean;
  /** optional one-click action instead of doing it by hand */
  action?: { label: string; run: (s: State) => void };
}

const paoloApp = (s: State) => s.applications.find((a) => a.seekerId === PAOLO_ID && a.trackId === MAIN_TRACK_ID);
const statusIn = (s: State, list: string[]) => list.includes(paoloApp(s)?.status ?? '');

/** The 5-minute presenter story, in order. A step is done when the demo state says so. */
export const PITCH_STEPS: Step[] = [
  {
    who: 'Paolo',
    title: 'Sign up and build a profile',
    hint: 'Sign up, accept the privacy notice, upload the resume, then save the AI-filled profile.',
    role: 'seeker',
    to: '/signup',
    hook: 'onboard',
    done: (s) => s.onboarding.profileSaved,
  },
  {
    who: 'Paolo',
    title: 'Apply to the Back Office track',
    hint: 'Open the 86% match and tap Apply. Tick the consent box: the profile goes to BlueHarbor only.',
    role: 'seeker',
    to: `/tracks/${MAIN_TRACK_ID}`,
    hook: 'apply',
    done: (s) => !!paoloApp(s),
  },
  {
    who: 'Carla',
    title: 'Accept Paolo into the track',
    hint: 'Candidates: click Accept on Paolo’s row. His My Track switches to “In track”.',
    role: 'employer',
    to: '/employer/candidates',
    hook: 'accept-paolo',
    done: (s) => statusIn(s, ['in-track', 'passed', 'hired-pending-trainee', 'hired-confirmed']),
  },
  {
    who: 'Demo',
    title: 'Paolo passes every module',
    hint: 'Training happens on BlueHarbor’s side. Skip ahead, or post results from Trainees.',
    role: 'seeker',
    to: '/my-track',
    hook: 'none',
    done: (s) => statusIn(s, ['passed', 'hired-pending-trainee', 'hired-confirmed']),
    action: { label: 'Fast-forward', run: (s) => s.ffPassAll() },
  },
  {
    who: 'Carla',
    title: 'Mark Paolo as hired',
    hint: 'Trainees: Mark as hired, tick “contract signed”, confirm. The fee isn’t billed yet.',
    role: 'employer',
    to: '/employer/trainees',
    hook: 'hire-paolo',
    done: (s) => statusIn(s, ['hired-pending-trainee', 'hired-confirmed']),
  },
  {
    who: 'Paolo',
    title: 'Confirm the signed contract',
    hint: 'Paolo confirms on his phone. Both sides must confirm before anything is billed.',
    role: 'seeker',
    to: '/hired',
    hook: 'confirm-hire',
    done: (s) => statusIn(s, ['hired-confirmed']),
  },
  {
    who: 'Carla',
    title: 'See the hire billed at ₱2,500',
    hint: 'Hires & billing: Paolo moved from “Waiting for Paolo” to Confirmed at the pilot rate.',
    role: 'employer',
    to: '/employer/billing',
    hook: 'none',
    done: (s) => s.billingSeen,
  },
  {
    who: 'Admin',
    title: 'Approve BlueHarbor’s verification',
    hint: 'Verification queue: Approve and verify. Carla’s “Post a track” unlocks.',
    role: 'admin',
    to: '/admin/verification',
    hook: 'approve',
    done: (s) => !!s.employers.find((e) => e.id === BLUEHARBOR_ID)?.verified,
  },
];

const demoTrack = (s: State) => s.tracks.find((t) => t.createdInDemo && t.status === 'live');

/** Sir's MVP check (about 5 minutes): post → find → learn → profile → employer sees it. */
export const MVP_STEPS: Step[] = [
  {
    who: 'Admin',
    title: 'Verify BlueHarbor so it can post',
    hint: 'Verification queue: Approve and verify. Only verified employers can publish openings.',
    role: 'admin',
    to: '/admin/verification',
    hook: 'approve',
    done: (s) => !!s.employers.find((e) => e.id === BLUEHARBOR_ID)?.verified,
  },
  {
    who: 'Carla',
    title: 'Post a new job opening',
    hint: 'Tracks → Post a new opening. Set the job, pay, skills and a prep course, then publish.',
    role: 'employer',
    to: '/employer/tracks',
    hook: ['post-open', 'post-next', 'post-publish'],
    done: (s) => !!demoTrack(s),
  },
  {
    who: 'Paolo',
    title: 'Find the opening and apply',
    hint: 'Matches: search for it (it’s tagged New), read the job and pay, then apply.',
    role: 'seeker',
    to: '/matches',
    hook: ['search', 'apply'],
    done: (s) => !!demoTrack(s) && s.applications.some((a) => a.seekerId === PAOLO_ID && a.trackId === demoTrack(s)!.id),
  },
  {
    who: 'Paolo',
    title: 'Finish a course in Hakbang Learn',
    hint: 'Learn: open a course, go through the lessons and pass the quiz to earn a certificate.',
    role: 'seeker',
    to: '/learn',
    hook: ['course-start', 'lesson-next', 'quiz-submit'],
    done: (s) => s.courseRecords.length > 0,
    action: {
      label: 'Fast-forward',
      run: (s) => s.ffFinishCourse(demoTrack(s)?.prepCourseIds?.[0] ?? 'excel-basics'),
    },
  },
  {
    who: 'Paolo',
    title: 'See the certificate on the profile',
    hint: 'Profile: the course is under “Courses completed” and its skills got a verified badge.',
    role: 'seeker',
    to: '/profile',
    hook: 'none',
    done: (s) => s.seen.profileCourses,
  },
  {
    who: 'Carla',
    title: 'See Paolo’s courses on his application',
    hint: 'Candidates: open Paolo’s Learning column. Certificates and verified skills help her decide.',
    role: 'employer',
    to: '/employer/candidates',
    hook: 'candidate-paolo',
    done: (s) => s.seen.candidateProfile,
  },
];

/** Handles `?fresh` (reset) and `?guide` (start the guide) on any route, then strips them. */
export function useDemoParams() {
  const { pathname, search } = useLocation();
  const nav = useNavigate();
  useEffect(() => {
    const q = new URLSearchParams(search);
    if (!q.has('fresh') && !q.has('guide')) return;
    const s = useDemo.getState();
    if (q.has('fresh')) s.reset();
    if (q.has('guide')) {
      s.setGuideOn(true);
      s.setGuideMode(q.get('guide') === 'mvp' ? 'mvp' : 'pitch');
    }
    q.delete('fresh');
    q.delete('guide');
    const rest = q.toString();
    nav(pathname + (rest ? `?${rest}` : ''), { replace: true });
  }, [pathname, search, nav]);
}

export function Guide() {
  const s = useDemo();
  const nav = useNavigate();
  const { pathname } = useLocation();
  const [min, setMin] = useState(false);
  const STEPS = s.guideMode === 'mvp' ? MVP_STEPS : PITCH_STEPS;
  const idx = STEPS.findIndex((st) => !st.done(s));
  const step = idx === -1 ? null : STEPS[idx];

  // step 7 completes by looking at billing once Paolo is confirmed
  useEffect(() => {
    if (s.guideOn && pathname === '/employer/billing' && statusIn(s, ['hired-confirmed'])) s.markBillingSeen();
  }, [s, pathname]);

  if (!s.guideOn) return null;

  const go = (st: Step) => {
    s.setRole(st.role);
    nav(st.to);
  };
  const hooks = step ? (Array.isArray(step.hook) ? step.hook : [step.hook]).filter((h) => h !== 'none') : [];
  const pulse = hooks.length ? hooks.map((h) => `[data-guide="${h}"]`).join(',') : null;

  if (min)
    return (
      <button
        type="button"
        onClick={() => setMin(false)}
        className="fixed z-[75] right-3 top-9 lg:top-auto lg:bottom-4 lg:right-4 inline-flex items-center gap-2 h-10 px-3.5 rounded-full bg-mango text-ink border-[1.5px] border-ink shadow-brut-sm font-mono text-[12px] font-semibold uppercase tracking-wider focus-ring"
        aria-label="Open presenter guide"
      >
        <Compass size={16} aria-hidden /> {step ? `${idx + 1}/${STEPS.length}` : 'Done'}
      </button>
    );

  return (
    <>
      {pulse && (
        <style>{`${pulse}{outline:3px solid #E8912A !important;outline-offset:3px;animation:hk-guide 1.3s ease-in-out infinite}`}</style>
      )}
      <aside
        aria-label="Presenter guide"
        className="fixed z-[75] inset-x-2 top-9 lg:inset-x-auto lg:top-auto lg:bottom-4 lg:right-4 lg:w-[360px] bg-cream text-ink border-[1.5px] border-ink rounded-[18px] shadow-brut p-4"
      >
        <div className="flex items-center gap-2">
          <div role="group" aria-label="Guide script" className="inline-flex p-[2px] rounded-full border-[1.5px] border-ink bg-paper">
            {(
              [
                ['pitch', 'Pitch demo'],
                ['mvp', 'MVP check'],
              ] as const
            ).map(([m, l]) => (
              <button
                key={m}
                type="button"
                aria-pressed={s.guideMode === m}
                onClick={() => s.setGuideMode(m)}
                className={cx('h-7 px-2.5 rounded-full font-mono text-[10.5px] font-semibold uppercase tracking-wider focus-ring', s.guideMode === m ? 'bg-ink text-cream' : 'text-muted')}
              >
                {l}
              </button>
            ))}
          </div>
          <span className="ml-auto flex gap-1">
            <button type="button" onClick={() => setMin(true)} aria-label="Minimise guide" className="w-8 h-8 rounded-full hover:bg-paper flex items-center justify-center focus-ring">
              <Minus size={16} />
            </button>
            <button type="button" onClick={() => s.setGuideOn(false)} aria-label="Close guide" className="w-8 h-8 rounded-full hover:bg-paper flex items-center justify-center focus-ring">
              <X size={16} />
            </button>
          </span>
        </div>

        {/* progress as a little staircase */}
        <ol className="mt-2 flex items-end gap-1" aria-label={`Step ${Math.max(idx, 0) + 1} of ${STEPS.length}`}>
          {STEPS.map((st, i) => {
            const done = idx === -1 || i < idx;
            const cur = i === idx;
            return (
              <li key={st.title} className="flex-1">
                <button
                  type="button"
                  title={st.title}
                  onClick={() => go(st)}
                  className={cx('block w-full rounded-t-[3px] border-[1.5px] border-ink focus-ring', done ? 'bg-lime' : cur ? 'bg-mango' : 'bg-paper')}
                  style={{ height: 6 + i * 3 }}
                />
              </li>
            );
          })}
        </ol>

        {step ? (
          <div className="mt-3">
            <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-green">
              Step {idx + 1}/{STEPS.length} · {step.who}
            </div>
            <div className="mt-1 text-title font-display">{step.title}</div>
            <p className="mt-1 text-body-s text-muted hidden sm:block lg:block">{step.hint}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {pathname !== step.to && (
                <button
                  type="button"
                  onClick={() => go(step)}
                  className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-[10px] bg-green text-white text-label shadow-step active:translate-y-[3px] active:shadow-none focus-ring"
                >
                  Take me there <ArrowRight size={15} aria-hidden />
                </button>
              )}
              {step.action && (
                <button
                  type="button"
                  onClick={() => {
                    step.action!.run(s);
                    go(step);
                  }}
                  className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-[10px] bg-cream border-[1.5px] border-ink text-label shadow-step-ink active:translate-y-[3px] active:shadow-none focus-ring"
                >
                  <FastForward size={15} aria-hidden /> {step.action.label}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-3">
            <div className="text-title font-display">Story complete 🎉</div>
            <p className="mt-1 text-body-s text-muted">
              {s.guideMode === 'mvp' ? 'Post → find → learn → certificate → employer sees it. All shown.' : 'Signup to hire to billing to verification, all shown.'}
            </p>
            <button
              type="button"
              onClick={() => {
                s.reset();
                s.setRole('seeker');
                nav('/');
              }}
              className="mt-3 inline-flex items-center gap-1.5 h-9 px-3.5 rounded-[10px] bg-cream border-[1.5px] border-ink text-label shadow-step-ink focus-ring"
            >
              <RotateCcw size={15} aria-hidden /> Run it again
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
