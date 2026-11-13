import { lazy, Suspense, useEffect, type ComponentType } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import DemoChrome from './layouts/DemoChrome';
import SeekerShell, { LaunchOnly, SeekerBare } from './layouts/SeekerShell';
import EmployerShell, { AdminShell } from './layouts/EmployerShell';
import Landing from './pages/Landing';
import { useDemo } from './store';

// Route-level code splitting keeps the landing page light.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const l = <M extends Record<string, unknown>, K extends keyof M>(f: () => Promise<M>, name: K) =>
  lazy(async () => ({ default: (await f())[name] as M[K] & ComponentType<any> }));

const seekerOnb = () => import('./pages/seeker/Onboarding');
const seekerMatch = () => import('./pages/seeker/Matches');
const seekerTrack = () => import('./pages/seeker/MyTrack');
const seekerProfile = () => import('./pages/seeker/Profile');
const seekerResume = () => import('./pages/seeker/Resume');
const emp = () => import('./pages/employer/Employer');
const adm = () => import('./pages/admin/Admin');

const DemoHub = l(() => import('./pages/DemoHub'), 'DemoHub');
const Signup = l(seekerOnb, 'Signup');
const Consent = l(seekerOnb, 'Consent');
const Upload = l(seekerOnb, 'Upload');
const Review = l(seekerOnb, 'Review');
const Matches = l(seekerMatch, 'Matches');
const TrackDetail = l(seekerMatch, 'TrackDetail');
const SkillGap = l(seekerMatch, 'SkillGap');
const MyTrack = l(seekerTrack, 'MyTrack');
const Hired = l(seekerTrack, 'Hired');
const Alerts = l(seekerTrack, 'Alerts');
const Report = l(seekerTrack, 'Report');
const Profile = l(seekerProfile, 'Profile');
const Endorsements = l(seekerProfile, 'Endorsements');
const Reminders = l(seekerProfile, 'Reminders');
const SkillPlan = l(seekerProfile, 'SkillPlan');
const ResumeReview = l(seekerResume, 'ResumeReview');
const ResumeFix = l(seekerResume, 'ResumeFix');
const Verify = l(emp, 'Verify');
const Overview = l(emp, 'Overview');
const NewTrack = l(emp, 'NewTrack');
const Candidates = l(emp, 'Candidates');
const Trainees = l(emp, 'Trainees');
const Billing = l(emp, 'Billing');
const Queue = l(adm, 'Queue');
const Reports = l(adm, 'Reports');
const Employers = l(adm, 'Employers');
const AdminTracks = l(adm, 'AdminTracks');

/** Warm the route chunks once the landing page has painted, so clicks feel instant. */
function Prefetch() {
  useEffect(() => {
    const id = window.setTimeout(() => {
      [seekerOnb, seekerMatch, seekerTrack, seekerProfile, seekerResume, emp, adm, () => import('./pages/DemoHub')].forEach((f) => void f());
    }, 1500);
    return () => window.clearTimeout(id);
  }, []);
  return null;
}

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function LangAttr() {
  const lang = useDemo((s) => s.lang);
  useEffect(() => {
    document.documentElement.lang = lang === 'fil' ? 'fil' : 'en';
  }, [lang]);
  return null;
}

const launch = (el: JSX.Element) => <LaunchOnly>{el}</LaunchOnly>;

export default function App() {
  return (
    <HashRouter>
      <ScrollTop />
      <Prefetch />
      <LangAttr />
      <Suspense fallback={<div className="min-h-screen bg-paper" aria-busy="true" />}>
        <Routes>
          <Route element={<DemoChrome />}>
            <Route index element={<Landing />} />
            <Route path="demo" element={<DemoHub />} />

            <Route element={<SeekerBare />}>
              <Route path="signup" element={<Signup />} />
              <Route path="consent" element={<Consent />} />
              <Route path="onboarding/upload" element={<Upload />} />
              <Route path="onboarding/review" element={<Review />} />
              <Route path="hired" element={<Hired />} />
            </Route>

            <Route element={<SeekerShell />}>
              <Route path="matches" element={<Matches />} />
              <Route path="tracks/:trackId" element={<TrackDetail />} />
              <Route path="tracks/:trackId/apply" element={<TrackDetail applying />} />
              <Route path="tracks/:trackId/skill-gap" element={launch(<SkillGap />)} />
              <Route path="my-track" element={<MyTrack />} />
              <Route path="alerts" element={launch(<Alerts />)} />
              <Route path="reminders" element={launch(<Reminders />)} />
              <Route path="profile" element={<Profile />} />
              <Route path="skill-plan" element={launch(<SkillPlan />)} />
              <Route path="endorsements" element={launch(<Endorsements />)} />
              <Route path="resume-review" element={launch(<ResumeReview />)} />
              <Route path="resume-review/fix/:n" element={launch(<ResumeFix />)} />
              <Route path="report" element={<Report />} />
            </Route>

            <Route path="employer" element={<EmployerShell />}>
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="verify" element={<Verify />} />
              <Route path="overview" element={<Overview />} />
              <Route path="tracks/new" element={<NewTrack />} />
              <Route path="candidates" element={<Candidates />} />
              <Route path="trainees" element={<Trainees />} />
              <Route path="trainees/:id/hire" element={<Trainees modal="hire" />} />
              <Route path="trainees/:id/endorse" element={<Trainees modal="endorse" />} />
              <Route path="billing" element={<Billing />} />
            </Route>

            <Route path="admin" element={<AdminShell />}>
              <Route index element={<Navigate to="verification" replace />} />
              <Route path="verification" element={<Queue />} />
              <Route path="reports" element={<Reports />} />
              <Route path="employers" element={<Employers />} />
              <Route path="tracks" element={<AdminTracks />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  );
}
