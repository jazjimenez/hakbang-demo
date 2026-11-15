import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Application, CourseRecord, Employer, Endorsement, Hire, JobSeeker, Lang, Report, Role, Score, Track, VerificationChecklist } from './data/types';
import { boostedMatch, courseById } from './data/courses';
import { MAIN_TRACK_ID, PAOLO_ID, PRICING, seedApplications, seedEmployers, seedHires, seedSeekers, seedTracks } from './data/seed';

export const STORAGE_KEY = 'hakbang-demo-v1';

interface Onboarding {
  signedUp: boolean;
  consented: boolean;
  resumeUploaded: boolean;
  profileSaved: boolean;
}

interface Reminders {
  email: boolean;
  push: boolean;
  messenger: boolean;
  sms: boolean;
  deadlines: boolean;
  sessions: boolean;
  results: boolean;
}

interface Data {
  lang: Lang;
  showLaunch: boolean;
  role: Role;
  onboarding: Onboarding;
  seekers: JobSeeker[];
  employers: Employer[];
  tracks: Track[];
  applications: Application[];
  hires: Hire[];
  reports: Report[];
  savedTracks: string[];
  learnedSkills: string[];
  resumeFixes: number[];
  resumeValues: Record<number, string[]>;
  resumeCustom: Record<number, string>;
  reminders: Reminders;
  readAlerts: boolean;
  /** presenter guide overlay */
  guideOn: boolean;
  guideMode: 'pitch' | 'mvp';
  billingSeen: boolean;
  /** Hakbang Learn: finished lesson ids per course, and finished courses */
  lessonsDone: Record<string, string[]>;
  courseRecords: CourseRecord[];
  /** demo milestones the MVP-check guide listens for */
  seen: { profileCourses: boolean; candidateProfile: boolean };
}

interface Actions {
  setLang: (l: Lang) => void;
  setShowLaunch: (v: boolean) => void;
  setRole: (r: Role) => void;
  reset: () => void;

  signUp: () => void;
  consent: () => void;
  uploadResume: () => void;
  saveProfile: (p: Partial<JobSeeker>) => void;
  updateSeeker: (id: string, p: Partial<JobSeeker>) => void;

  apply: (trackId: string) => void;
  saveTrack: (trackId: string) => void;
  accept: (appId: string) => void;
  decline: (appId: string) => void;
  postScore: (appId: string, moduleId: 'm1' | 'm2', score: Score) => void;
  postF2F: (appId: string, passed: boolean) => void;
  markHired: (appId: string, h: Pick<Hire, 'startDate' | 'position' | 'contract'>) => void;
  confirmHire: (appId: string) => void;
  addEndorsement: (appId: string, e: Omit<Endorsement, 'id'>) => void;

  setVerification: (empId: string, key: keyof VerificationChecklist, v: boolean) => void;
  approveEmployer: (empId: string) => void;
  holdEmployer: (empId: string) => void;
  publishDraft: (trackId: string) => void;
  updateTrack: (trackId: string, p: Partial<Track>) => void;

  submitReport: (r: Omit<Report, 'id'>) => void;
  toggleReminder: (k: keyof Reminders) => void;
  toggleLearned: (skill: string) => void;
  applyResumeFix: (n: number) => void;
  setResumeValues: (n: number, v: string[]) => void;
  setResumeCustom: (n: number, v: string) => void;
  markAlertsRead: () => void;
  setGuideOn: (v: boolean) => void;
  setGuideMode: (m: 'pitch' | 'mvp') => void;
  markSeen: (k: keyof Data['seen']) => void;
  completeLesson: (courseId: string, lessonId: string) => void;
  finishCourse: (courseId: string, score: number) => void;
  ffFinishCourse: (courseId?: string) => void;
  upsertTrack: (t: Track) => void;
  markBillingSeen: () => void;

  ffAccept: () => void;
  ffPassModule1: () => void;
  ffPassAll: () => void;
  ffHired: () => void;
}

const seed = (): Data => ({
  lang: 'fil',
  showLaunch: true,
  role: 'seeker',
  onboarding: { signedUp: false, consented: false, resumeUploaded: false, profileSaved: false },
  seekers: structuredClone(seedSeekers),
  employers: structuredClone(seedEmployers),
  tracks: structuredClone(seedTracks),
  applications: structuredClone(seedApplications),
  hires: structuredClone(seedHires),
  reports: [],
  savedTracks: [],
  learnedSkills: [],
  resumeFixes: [],
  resumeValues: {},
  resumeCustom: {},
  reminders: { email: true, push: true, messenger: true, sms: false, deadlines: true, sessions: true, results: true },
  readAlerts: false,
  guideOn: false,
  guideMode: 'pitch',
  billingSeen: false,
  lessonsDone: {},
  courseRecords: [],
  seen: { profileCourses: false, candidateProfile: false },
});

const passed = (s: Score | undefined) => typeof s === 'number' && s >= 80;

/** Recompute status after results change (only while in the track). */
const settle = (a: Application): Application => {
  if (a.status === 'in-track' && passed(a.scores.m1) && passed(a.scores.m2) && a.f2f === 'passed') {
    return { ...a, status: 'passed', scores: { ...a.scores, m3: 100 } };
  }
  return a;
};

const paoloAppId = (trackId = MAIN_TRACK_ID) => `a-paolo-${trackId}`;

export const useDemo = create<Data & Actions>()(
  persist(
    (set, get) => {
      const patchApp = (id: string, fn: (a: Application) => Application) =>
        set((s) => ({ applications: s.applications.map((a) => (a.id === id ? fn(a) : a)) }));

      const ensurePaoloApplied = () => {
        if (!get().applications.some((a) => a.id === paoloAppId())) get().apply(MAIN_TRACK_ID);
      };

      return {
        ...seed(),

        setLang: (lang) => set({ lang }),
        setShowLaunch: (showLaunch) => set({ showLaunch }),
        setRole: (role) => set({ role }),
        reset: () => set({ ...seed(), lang: get().lang, role: get().role, guideOn: get().guideOn }),

        signUp: () => set((s) => ({ onboarding: { ...s.onboarding, signedUp: true } })),
        consent: () => set((s) => ({ onboarding: { ...s.onboarding, signedUp: true, consented: true } })),
        uploadResume: () => set((s) => ({ onboarding: { ...s.onboarding, resumeUploaded: true } })),
        saveProfile: (p) => {
          get().updateSeeker(PAOLO_ID, p);
          set((s) => ({ onboarding: { ...s.onboarding, signedUp: true, consented: true, resumeUploaded: true, profileSaved: true } }));
        },
        updateSeeker: (id, p) => set((s) => ({ seekers: s.seekers.map((x) => (x.id === id ? { ...x, ...p } : x)) })),

        apply: (trackId) => {
          const id = paoloAppId(trackId);
          if (get().applications.some((a) => a.id === id)) return;
          const track = get().tracks.find((t) => t.id === trackId)!;
          const a: Application = {
            id,
            seekerId: PAOLO_ID,
            trackId,
            status: 'applied',
            appliedAt: 'Apr 6',
            scores: {},
            scoreDates: {},
            attendance: '0 of 6',
            f2f: 'not-yet',
            match: track.match,
            endorsements: [],
          };
          set((s) => ({ applications: [a, ...s.applications], savedTracks: s.savedTracks.filter((t) => t !== trackId) }));
        },
        saveTrack: (trackId) => set((s) => ({ savedTracks: s.savedTracks.includes(trackId) ? s.savedTracks : [...s.savedTracks, trackId] })),
        accept: (appId) =>
          patchApp(appId, (a) => ({ ...a, status: 'in-track', acceptedAt: 'Apr 8', attendance: '2 of 6', f2f: 'scheduled', scores: { m1: 'in-progress' } })),
        decline: (appId) => patchApp(appId, (a) => ({ ...a, status: 'declined' })),
        postScore: (appId, moduleId, score) =>
          patchApp(appId, (a) => {
            const scores = { ...a.scores, [moduleId]: score };
            if (moduleId === 'm1' && passed(score) && !a.scores.m2) scores.m2 = 'in-progress';
            const dates = { ...a.scoreDates, [moduleId]: moduleId === 'm1' ? 'Apr 17' : 'Apr 24' };
            const attendance = moduleId === 'm1' ? '4 of 6' : '6 of 6';
            return settle({ ...a, scores, scoreDates: dates, attendance });
          }),
        postF2F: (appId, ok) => patchApp(appId, (a) => settle({ ...a, f2f: ok ? 'passed' : 'scheduled' })),
        markHired: (appId, h) => {
          patchApp(appId, (a) => ({ ...a, status: 'hired-pending-trainee' }));
          const confirmed = get().hires.filter((x) => x.billed).length;
          const fee = confirmed < PRICING.pilotBatch ? PRICING.pilotRate : PRICING.standardRate;
          set((s) => ({ hires: [...s.hires.filter((x) => x.applicationId !== appId), { applicationId: appId, feePhp: fee, billed: false, ...h }] }));
        },
        confirmHire: (appId) => {
          patchApp(appId, (a) => ({ ...a, status: 'hired-confirmed' }));
          set((s) => ({ hires: s.hires.map((h) => (h.applicationId === appId ? { ...h, billed: true, guaranteeDaysLeft: PRICING.guaranteeDays } : h)) }));
        },
        addEndorsement: (appId, e) =>
          patchApp(appId, (a) => ({ ...a, endorsements: [...a.endorsements, { ...e, id: `e-${Date.now()}` }] })),

        setVerification: (empId, key, v) =>
          set((s) => ({ employers: s.employers.map((e) => (e.id === empId ? { ...e, verification: { ...e.verification, [key]: v } } : e)) })),
        approveEmployer: (empId) =>
          set((s) => ({
            employers: s.employers.map((e) =>
              e.id === empId
                ? { ...e, verified: true, verification: { bir2303: true, secOrDti: true, businessPermit: true, partnerAgreement: true, termsReviewed: true } }
                : e,
            ),
          })),
        holdEmployer: (empId) => set((s) => ({ employers: s.employers.map((e) => (e.id === empId ? { ...e, verified: false } : e)) })),
        publishDraft: (trackId) => set((s) => ({ tracks: s.tracks.map((t) => (t.id === trackId ? { ...t, status: 'live' } : t)) })),

        updateTrack: (trackId, p) => set((s) => ({ tracks: s.tracks.map((t) => (t.id === trackId ? { ...t, ...p } : t)) })),
        submitReport: (r) => set((s) => ({ reports: [...s.reports, { ...r, id: `r-${Date.now()}` }] })),
        toggleReminder: (k) => set((s) => ({ reminders: { ...s.reminders, [k]: !s.reminders[k] } })),
        toggleLearned: (skill) =>
          set((s) => ({ learnedSkills: s.learnedSkills.includes(skill) ? s.learnedSkills.filter((x) => x !== skill) : [...s.learnedSkills, skill] })),
        applyResumeFix: (n) => set((s) => ({ resumeFixes: s.resumeFixes.includes(n) ? s.resumeFixes : [...s.resumeFixes, n] })),
        setResumeValues: (n, v) => set((s) => ({ resumeValues: { ...s.resumeValues, [n]: v } })),
        setResumeCustom: (n, v) => set((s) => ({ resumeCustom: { ...s.resumeCustom, [n]: v } })),
        markAlertsRead: () => set({ readAlerts: true }),
        setGuideOn: (guideOn) => set({ guideOn }),
        setGuideMode: (guideMode) => set({ guideMode }),
        markSeen: (k) => set((s) => (s.seen[k] ? s : { seen: { ...s.seen, [k]: true } })),
        completeLesson: (courseId, lessonId) =>
          set((s) => {
            const done = s.lessonsDone[courseId] ?? [];
            return done.includes(lessonId) ? s : { lessonsDone: { ...s.lessonsDone, [courseId]: [...done, lessonId] } };
          }),
        finishCourse: (courseId, score) => {
          const c = courseById(courseId);
          if (!c) return;
          set((s) => {
            const lessonsDone = { ...s.lessonsDone, [courseId]: c.lessons.map((l) => l.id) };
            const courseRecords = s.courseRecords.some((r) => r.courseId === courseId)
              ? s.courseRecords.map((r) => (r.courseId === courseId ? { ...r, score: Math.max(r.score, score) } : r))
              : [...s.courseRecords, { courseId, completedAt: 'Apr 22', score }];
            // finished-course skills land on Paolo's profile, so matching and employers see them
            const seekers = s.seekers.map((x) => {
              if (x.id !== PAOLO_ID) return x;
              const have = x.skills.map((k) => k.toLowerCase());
              const add = c.skills.filter((k) => !have.includes(k.toLowerCase()));
              return { ...x, skills: [...x.skills, ...add], profileCompleteness: Math.min(100, x.profileCompleteness + 5) };
            });
            return { lessonsDone, courseRecords, seekers };
          });
        },
        ffFinishCourse: (courseId = 'excel-basics') => get().finishCourse(courseId, 100),
        upsertTrack: (t) => set((s) => ({ tracks: s.tracks.some((x) => x.id === t.id) ? s.tracks.map((x) => (x.id === t.id ? t : x)) : [...s.tracks, t] })),
        markBillingSeen: () => set((s) => (s.billingSeen ? s : { billingSeen: true })),

        ffAccept: () => {
          ensurePaoloApplied();
          const a = get().applications.find((x) => x.id === paoloAppId())!;
          if (a.status === 'applied') get().accept(a.id);
        },
        ffPassModule1: () => {
          get().ffAccept();
          const a = get().applications.find((x) => x.id === paoloAppId())!;
          if (a.status === 'in-track' && !passed(a.scores.m1)) get().postScore(a.id, 'm1', 88);
        },
        ffPassAll: () => {
          get().ffPassModule1();
          const a = get().applications.find((x) => x.id === paoloAppId())!;
          if (a.status !== 'in-track') return;
          if (!passed(a.scores.m2)) get().postScore(a.id, 'm2', 91);
          get().postF2F(a.id, true);
        },
        ffHired: () => {
          get().ffPassAll();
          const a = get().applications.find((x) => x.id === paoloAppId())!;
          if (a.status === 'passed') get().markHired(a.id, { startDate: 'May 17', position: 'Back Office Associate', contract: 'Regular, with SSS, PhilHealth, and Pag-IBIG' });
        },
      };
    },
    {
      name: STORAGE_KEY,
      // v2: hire dates moved to the April demo clock; older saved data is replaced with the seed
      // v3: courses, job offers and new guide state; older saved data is replaced with the seed
      version: 3,
      migrate: (persisted, version) => (version < 3 ? (seed() as unknown as Data & Actions) : (persisted as Data & Actions)),
      storage: createJSONStorage(() => {
        try {
          return localStorage;
        } catch {
          // private mode / blocked storage: fall back to memory
          const m = new Map<string, string>();
          return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
        }
      }),
    },
  ),
);

/* ---------- selectors / helpers ---------- */

export const usePaolo = () => useDemo((s) => s.seekers.find((x) => x.id === PAOLO_ID)!);
export const usePaoloApp = (trackId = MAIN_TRACK_ID) => useDemo((s) => s.applications.find((a) => a.id === paoloAppId(trackId)));
/** Paolo's most relevant application (the one in progress, else the latest). */
export const usePaoloActiveApp = () =>
  useDemo((s) => {
    const mine = s.applications.filter((a) => a.seekerId === PAOLO_ID);
    return mine.find((a) => a.status !== 'declined') ?? mine[0];
  });
export const useTrack = (id?: string) => useDemo((s) => s.tracks.find((t) => t.id === id));
export const useEmployer = (id?: string) => useDemo((s) => s.employers.find((e) => e.id === id));
export const useSeekerById = (id?: string) => useDemo((s) => s.seekers.find((x) => x.id === id));

export const isPassed = passed;

export type StepState = 'done' | 'current' | 'upcoming';
export type TrailKey = 'applied' | 'accepted' | 'm1' | 'm2' | 'f2f' | 'decision' | 'contract';

/** The 7-step "trail" for an application. */
export function trailFor(a: Application): { key: TrailKey; state: StepState }[] {
  const accepted = !['applied', 'declined'].includes(a.status);
  const hired = a.status === 'hired-pending-trainee' || a.status === 'hired-confirmed';
  const done: Record<TrailKey, boolean> = {
    applied: true,
    accepted,
    m1: accepted && passed(a.scores.m1),
    m2: accepted && passed(a.scores.m2),
    f2f: accepted && a.f2f === 'passed',
    decision: hired,
    contract: a.status === 'hired-confirmed',
  };
  const keys: TrailKey[] = ['applied', 'accepted', 'm1', 'm2', 'f2f', 'decision', 'contract'];
  const firstOpen = keys.findIndex((k) => !done[k]);
  return keys.map((k, i) => ({ key: k, state: done[k] ? 'done' : i === firstOpen ? 'current' : 'upcoming' }));
}

export const peso = (n: number) => `₱${n.toLocaleString('en-PH')}`;

/** Skills Paolo earned from finished courses. */
export const useCourseSkills = () =>
  useDemo((s) => s.courseRecords.flatMap((r) => courseById(r.courseId)?.skills ?? []));

/** Paolo's live match for a track, including the boost from finished courses. */
export function useLiveMatch(trackId?: string) {
  const track = useTrack(trackId);
  const skills = useCourseSkills();
  if (!track) return undefined;
  return boostedMatch(track.match, track.requiredSkills, skills);
}
