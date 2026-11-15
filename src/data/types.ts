export type Lang = 'fil' | 'en';
export type Release = 'pilot' | 'launch';
export type Role = 'seeker' | 'employer' | 'admin';

export interface JobSeeker {
  id: string;
  name: string;
  firstName: string;
  initials: string;
  course: string;
  school: string;
  gradYear: number;
  city: string;
  availability: string;
  skills: string[];
  preferredJob?: string;
  profileCompleteness: number; // 0–100
  visibility: 'applied-only' | 'all-verified';
  email?: string;
  /** completed Hakbang Learn course ids (seeded candidates; Paolo's live ones are in the store) */
  certificates?: string[];
}

export interface VerificationChecklist {
  bir2303: boolean;
  secOrDti: boolean;
  businessPermit: boolean;
  partnerAgreement: boolean;
  termsReviewed: boolean;
}

export interface Employer {
  id: string;
  name: string;
  legalName: string;
  initials: string;
  industry: string;
  address: string;
  contact: string;
  contactEmail: string;
  verification: VerificationChecklist;
  verified: boolean;
  submittedAt: string;
  /** colour of the initials tile */
  tile: string;
}

export interface Module {
  id: 'm1' | 'm2' | 'm3';
  title: string;
  format: string;
  passMark: string;
  due: string;
  when: string;
}

export interface Track {
  id: string;
  employerId: string;
  title: string;
  shortTitle: string;
  location: string;
  locationShort: string;
  lengthWeeks: number;
  allowancePhp?: number;
  schedule: string;
  scheduleLong: string;
  slots: number;
  status: 'draft' | 'live';
  hiringCommitment: string;
  criteria: string[];
  modules: Module[];
  startDate: string;
  requiredSkills: string[];
  /** Paolo's match for this track (seeker-side demo) */
  match: { total: number; skills: number; location: number; schedule: number };
  /** the job waiting at the end of the track */
  job?: JobOffer;
  /** Hakbang Learn courses that prepare for this track */
  prepCourseIds?: string[];
  /** created by the employer in this demo session */
  createdInDemo?: boolean;
}

export interface JobOffer {
  position: string;
  salaryMin: number;
  salaryMax: number;
  type: string;
}

export type LessonKind = 'video' | 'reading' | 'quiz';

export interface Lesson {
  id: string;
  title: string;
  kind: LessonKind;
  minutes: number;
}

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
}

export interface Course {
  id: string;
  title: string;
  /** employer id, or 'hakbang' for Hakbang Learn */
  providerId: string;
  providerName: string;
  category: 'excel' | 'customer' | 'backoffice' | 'it' | 'career';
  level: 'Beginner' | 'Intermediate';
  hours: number;
  rating: number;
  learners: number;
  skills: string[];
  summary: string;
  outcomes: string[];
  lessons: Lesson[];
  quiz: QuizQuestion[];
  /** track this course prepares for */
  trackId?: string;
  tile: string;
}

export interface CourseRecord {
  courseId: string;
  completedAt: string;
  score: number;
}

export type AppStatus =
  | 'applied'
  | 'accepted'
  | 'declined'
  | 'in-track'
  | 'passed'
  | 'hired-pending-trainee'
  | 'hired-confirmed';

export type Score = number | 'in-progress' | 'retake';

export interface Endorsement {
  id: string;
  moduleId: Module['id'];
  skills: string[];
  note: string;
  date: string;
}

export interface Application {
  id: string;
  seekerId: string;
  trackId: string;
  status: AppStatus;
  appliedAt: string;
  acceptedAt?: string;
  scores: Partial<Record<Module['id'], Score>>;
  scoreDates: Partial<Record<Module['id'], string>>;
  attendance: string;
  f2f: 'scheduled' | 'passed' | 'not-yet';
  match: { total: number; skills: number; location: number; schedule: number };
  endorsements: Endorsement[];
}

export interface Hire {
  applicationId: string;
  startDate: string;
  feePhp: number;
  billed: boolean;
  guaranteeDaysLeft?: number;
  position: string;
  contract: string;
}

export interface Report {
  id: string;
  reason: string;
  details: string;
  at: string;
  trackId?: string;
}
