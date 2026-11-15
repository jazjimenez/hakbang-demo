import type { Application, Employer, Hire, JobSeeker, Track } from './types';

/**
 * All people, companies and numbers here are fictional.
 * They match the Figma hi-fi frames (file lR8turJbAshPb81v7VcxVq).
 */

/** Hard-coded demo clock: late April 2027, inside the pilot window. */
export const DEMO_TODAY = 'Apr 22, 2027';

export const PAOLO_ID = 'paolo';
export const MAIN_TRACK_ID = 'back-office';
export const BLUEHARBOR_ID = 'blueharbor';

/** Pricing (employers only — never shown in the job seeker app). */
export const PRICING = {
  pilotRate: 2500,
  pilotBatch: 20,
  standardRate: 5000,
  volumeRate: 4000,
  volumeThreshold: 30,
  guaranteeDays: 90,
  pilotHireTarget: 14,
};

/** Trainees in the batch that the demo doesn't list by name (all on track). */
export const UNLISTED_ON_TRACK = 15;

const seeker = (s: Omit<JobSeeker, 'firstName' | 'initials' | 'profileCompleteness' | 'visibility'> & Partial<JobSeeker>): JobSeeker => {
  const parts = s.name.split(' ');
  return {
    firstName: parts[0],
    initials: (parts[0][0] + parts[parts.length - 1][0]).toUpperCase(),
    profileCompleteness: 80,
    visibility: 'applied-only',
    ...s,
  };
};

export const seedSeekers: JobSeeker[] = [
  seeker({
    id: PAOLO_ID,
    name: 'Paolo Reyes',
    course: 'BS Business Administration',
    school: 'PUP Manila',
    gradYear: 2025,
    city: 'Pasig City',
    availability: 'Weekends, and weekdays after 6 PM',
    skills: ['Customer service', 'MS Word', 'Basic Excel', 'English communication'],
    preferredJob: 'Back Office Associate',
    email: 'paolo.reyes@example.com',
  }),
  seeker({ id: 'bea', certificates: ['excel-basics', 'typing-accuracy'], name: 'Bea Santos', course: 'BS Accountancy', school: 'PLM', gradYear: 2025, city: 'Mandaluyong', availability: 'Weekends', skills: ['Basic Excel', 'Bookkeeping'] }),
  seeker({ id: 'marco', certificates: ['it-networking'], name: 'Marco Lim', course: 'BS Information Technology', school: 'TUP Manila', gradYear: 2027, city: 'Quezon City', availability: 'Any day', skills: ['Windows troubleshooting', 'Customer service'] }),
  seeker({ id: 'joy', certificates: ['cs-essentials', 'interview'], name: 'Joy Dela Cruz', course: 'AB Communication', school: 'PUP Manila', gradYear: 2025, city: 'Pasig City', availability: 'Weekends', skills: ['English communication', 'MS Word'] }),
  seeker({ id: 'ken', name: 'Ken Bautista', course: 'BS Office Administration', school: 'RTU', gradYear: 2025, city: 'Mandaluyong', availability: 'Weekends', skills: ['MS Word'] }),
  seeker({ id: 'ana', certificates: ['back-office-101'], name: 'Ana Villanueva', course: 'BS Business Administration', school: 'UMak', gradYear: 2025, city: 'Makati', availability: 'Weekends', skills: ['Customer service', 'Basic Excel'] }),
  seeker({ id: 'liza', name: 'Liza Ramos', course: 'BS Accountancy', school: 'PLM', gradYear: 2024, city: 'San Juan', availability: 'Weekends', skills: ['Basic Excel'] }),
  seeker({ id: 'jon', name: 'Jon Aquino', course: 'BS Business Administration', school: 'PUP Manila', gradYear: 2024, city: 'Pasig City', availability: 'Weekends', skills: ['Data entry'] }),
  seeker({ id: 'rico', name: 'Rico Tan', course: 'BS Marketing', school: 'UE Manila', gradYear: 2025, city: 'Manila', availability: 'Weekends', skills: ['Customer service'] }),
  seeker({ id: 'mia', name: 'Mia Garcia', course: 'BS Tourism', school: 'LPU Manila', gradYear: 2025, city: 'Taguig', availability: 'Weekends, weekday PM', skills: ['English communication'] }),
];

export const seedEmployers: Employer[] = [
  {
    id: BLUEHARBOR_ID,
    name: 'BlueHarbor CX',
    legalName: 'BlueHarbor CX Solutions Inc.',
    initials: 'BH',
    industry: 'IT-BPM, customer experience',
    address: 'Ortigas Center, Pasig City',
    contact: 'Carla Mendoza',
    contactEmail: 'carla@blueharbor.example',
    verification: { bir2303: true, secOrDti: true, businessPermit: false, partnerAgreement: false, termsReviewed: false },
    verified: false,
    submittedAt: 'Mar 1',
    tile: '#023B2A',
  },
  {
    id: 'northwind',
    name: 'Northwind BPO',
    legalName: 'Northwind BPO Services Corp.',
    initials: 'NW',
    industry: 'IT-BPM, voice support',
    address: 'Kapitolyo, Pasig City',
    contact: 'Ramon Cruz',
    contactEmail: 'ramon@northwind.example',
    verification: { bir2303: true, secOrDti: true, businessPermit: true, partnerAgreement: true, termsReviewed: false },
    verified: true,
    submittedAt: 'Mar 2',
    tile: '#005D41',
  },
  {
    id: 'tala',
    name: 'Tala Data Services',
    legalName: 'Tala Data Services Inc.',
    initials: 'TD',
    industry: 'Data processing',
    address: 'Shaw Blvd, Mandaluyong',
    contact: 'Irene Sy',
    contactEmail: 'irene@tala.example',
    verification: { bir2303: true, secOrDti: true, businessPermit: false, partnerAgreement: false, termsReviewed: false },
    verified: true,
    submittedAt: 'Mar 3',
    tile: '#5E6B64',
  },
];

const boModules: Track['modules'] = [
  { id: 'm1', title: 'Excel basics', format: 'Online test', passMark: '80%', due: 'Apr 17', when: 'Week 1' },
  { id: 'm2', title: 'Back-office processes', format: 'Online reading and test', passMark: '80%', due: 'Apr 24', when: 'Weeks 2 to 3' },
  { id: 'm3', title: 'Final assessment', format: 'Face-to-face, Ortigas', passMark: 'Pass', due: 'May 1', when: 'Week 4' },
];

export const seedTracks: Track[] = [
  {
    id: MAIN_TRACK_ID,
    employerId: BLUEHARBOR_ID,
    title: 'Back Office Associate Track',
    shortTitle: 'Back Office Associate',
    location: 'Ortigas Center',
    locationShort: 'Ortigas',
    lengthWeeks: 4,
    allowancePhp: 3000,
    schedule: 'Sat–Sun',
    scheduleLong: 'Sat–Sun, 9–3',
    slots: 20,
    status: 'live',
    hiringCommitment: 'regular',
    criteria: ['crit.score80', 'crit.f2f', 'crit.attendance'],
    modules: boModules,
    startDate: 'Apr 10, 2027',
    requiredSkills: ['Basic Excel formulas', 'Customer service', 'English communication', 'MS Word'],
    match: { total: 86, skills: 0.8, location: 0.95, schedule: 1 },
    job: { position: 'Back Office Associate', salaryMin: 18000, salaryMax: 22000, type: 'Regular, full-time' },
    prepCourseIds: ['excel-basics', 'back-office-101'],
  },
  {
    id: 'cs-trainee',
    employerId: 'northwind',
    title: 'Customer Service Trainee Track',
    shortTitle: 'Customer Service Trainee',
    location: 'Kapitolyo, Pasig',
    locationShort: 'Pasig',
    lengthWeeks: 3,
    schedule: 'Weekday evenings',
    scheduleLong: 'Mon–Fri, 6–9 PM',
    slots: 15,
    status: 'live',
    hiringCommitment: 'regular',
    criteria: ['crit.score80', 'crit.f2f', 'crit.attendance'],
    modules: [
      { id: 'm1', title: 'Call basics', format: 'Online test', passMark: '80%', due: 'May 8', when: 'Week 1' },
      { id: 'm2', title: 'Mock calls', format: 'Online, recorded', passMark: '80%', due: 'May 15', when: 'Week 2' },
      { id: 'm3', title: 'Final assessment', format: 'Face-to-face, Pasig', passMark: 'Pass', due: 'May 22', when: 'Week 3' },
    ],
    startDate: 'May 4, 2027',
    requiredSkills: ['Customer service', 'English communication', 'Typing 35 wpm'],
    match: { total: 74, skills: 0.7, location: 0.9, schedule: 0.6 },
    job: { position: 'Customer Service Representative', salaryMin: 20000, salaryMax: 25000, type: 'Regular, full-time' },
    prepCourseIds: ['cs-essentials', 'calls'],
  },
  {
    id: 'data-entry',
    employerId: 'tala',
    title: 'Data Entry Specialist Track',
    shortTitle: 'Data Entry Specialist',
    location: 'Shaw Blvd, Mandaluyong',
    locationShort: 'Mandaluyong',
    lengthWeeks: 2,
    allowancePhp: 1500,
    schedule: 'Sat–Sun',
    scheduleLong: 'Sat–Sun, 9–1',
    slots: 10,
    status: 'live',
    hiringCommitment: 'regular',
    criteria: ['crit.score80', 'crit.f2f', 'crit.attendance'],
    modules: [
      { id: 'm1', title: 'Typing and accuracy', format: 'Online test', passMark: '80%', due: 'May 15', when: 'Week 1' },
      { id: 'm2', title: 'Data tools', format: 'Online test', passMark: '80%', due: 'May 22', when: 'Week 2' },
      { id: 'm3', title: 'Final assessment', format: 'Face-to-face, Mandaluyong', passMark: 'Pass', due: 'May 23', when: 'Week 2' },
    ],
    startDate: 'May 9, 2027',
    requiredSkills: ['Basic Excel', 'Data entry', 'Attention to detail'],
    match: { total: 71, skills: 0.6, location: 0.8, schedule: 1 },
    job: { position: 'Data Entry Specialist', salaryMin: 16000, salaryMax: 19000, type: 'Regular, full-time' },
    prepCourseIds: ['typing-accuracy', 'excel-basics'],
  },
  {
    id: 'bh-cs-draft',
    employerId: BLUEHARBOR_ID,
    title: 'Customer Service Trainee Track',
    shortTitle: 'Customer Service Trainee',
    location: 'Ortigas Center',
    locationShort: 'Ortigas',
    lengthWeeks: 3,
    allowancePhp: 2000,
    schedule: 'Sat–Sun',
    scheduleLong: 'Sat–Sun, 9–3',
    slots: 15,
    status: 'draft',
    hiringCommitment: 'regular',
    criteria: ['crit.score80', 'crit.f2f', 'crit.attendance'],
    modules: [],
    startDate: 'TBD',
    requiredSkills: [],
    match: { total: 0, skills: 0, location: 0, schedule: 0 },
  },
];

const app = (a: Partial<Application> & Pick<Application, 'id' | 'seekerId' | 'status' | 'match'>): Application => ({
  trackId: MAIN_TRACK_ID,
  appliedAt: 'Apr 6',
  scores: {},
  scoreDates: {},
  attendance: '0 of 6',
  f2f: 'not-yet',
  endorsements: [],
  ...a,
});

/** Paolo has no application yet: the presenter applies live. */
export const seedApplications: Application[] = [
  app({ id: 'a-bea', seekerId: 'bea', status: 'passed', acceptedAt: 'Apr 8', scores: { m1: 92, m2: 95, m3: 100 }, attendance: '6 of 6', f2f: 'passed', match: { total: 84, skills: 0.85, location: 0.9, schedule: 0.8 } }),
  app({ id: 'a-marco', seekerId: 'marco', status: 'passed', appliedAt: 'Apr 7', acceptedAt: 'Apr 8', scores: { m1: 85, m2: 90, m3: 100 }, attendance: '6 of 6', f2f: 'passed', match: { total: 79, skills: 0.8, location: 0.6, schedule: 1 } }),
  app({ id: 'a-ken', seekerId: 'ken', status: 'in-track', acceptedAt: 'Apr 8', scores: { m1: 76, m2: 'retake' }, attendance: '4 of 6', f2f: 'not-yet', match: { total: 75, skills: 0.6, location: 0.9, schedule: 0.9 } }),
  app({ id: 'a-ana', seekerId: 'ana', status: 'in-track', acceptedAt: 'Apr 8', scores: { m1: 90, m2: 'in-progress' }, attendance: '5 of 6', f2f: 'scheduled', match: { total: 81, skills: 0.8, location: 0.8, schedule: 0.9 } }),
  app({ id: 'a-joy', seekerId: 'joy', status: 'applied', appliedAt: 'Apr 7', match: { total: 77, skills: 0.65, location: 0.95, schedule: 0.85 } }),
  app({ id: 'a-rico', seekerId: 'rico', status: 'applied', appliedAt: 'Apr 8', match: { total: 74, skills: 0.7, location: 0.7, schedule: 0.85 } }),
  app({ id: 'a-mia', seekerId: 'mia', status: 'applied', appliedAt: 'Apr 9', match: { total: 72, skills: 0.6, location: 0.75, schedule: 0.9 } }),
  app({ id: 'a-liza', seekerId: 'liza', status: 'hired-confirmed', appliedAt: 'Mar 2', acceptedAt: 'Mar 4', scores: { m1: 94, m2: 91, m3: 100 }, attendance: '6 of 6', f2f: 'passed', match: { total: 82, skills: 0.8, location: 0.85, schedule: 0.9 } }),
  app({ id: 'a-jon', seekerId: 'jon', status: 'hired-confirmed', appliedAt: 'Mar 2', acceptedAt: 'Mar 4', scores: { m1: 88, m2: 86, m3: 100 }, attendance: '6 of 6', f2f: 'passed', match: { total: 80, skills: 0.75, location: 0.95, schedule: 0.8 } }),
];

export const seedHires: Hire[] = [
  { applicationId: 'a-liza', startDate: 'Mar 31', feePhp: 2500, billed: true, guaranteeDaysLeft: 68, position: 'Back Office Associate', contract: 'Regular, with SSS, PhilHealth, and Pag-IBIG' },
  { applicationId: 'a-jon', startDate: 'Mar 31', feePhp: 2500, billed: true, guaranteeDaysLeft: 68, position: 'Back Office Associate', contract: 'Regular, with SSS, PhilHealth, and Pag-IBIG' },
];
