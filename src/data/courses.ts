import type { Course, Lesson, LessonKind } from './types';

/**
 * Hakbang Learn: free short courses. Some are published by employers as prep for
 * their tracks, some by Hakbang. All fictional. Course content stays in English
 * in both languages (like resumes), the catalog chrome is bilingual.
 */

const L = (prefix: string, items: [string, LessonKind, number][]): Lesson[] =>
  items.map(([title, kind, minutes], i) => ({ id: `${prefix}-l${i + 1}`, title, kind, minutes }));

export const COURSES: Course[] = [
  {
    id: 'excel-basics',
    title: 'Excel basics: SUM, AVERAGE and VLOOKUP',
    providerId: 'blueharbor',
    providerName: 'BlueHarbor CX Academy',
    category: 'excel',
    level: 'Beginner',
    hours: 2.5,
    rating: 4.8,
    learners: 1240,
    skills: ['Basic Excel formulas', 'Basic Excel'],
    summary: 'The exact formulas BlueHarbor tests in Module 1. Short videos, one practice sheet, one quiz.',
    outcomes: ['Total and average a column of numbers', 'Look up a value from another table with VLOOKUP', 'Clean messy data before you use it'],
    lessons: L('excel', [
      ['Cells, ranges and your first formula', 'video', 12],
      ['SUM and AVERAGE on real call data', 'video', 18],
      ['VLOOKUP, step by step', 'video', 22],
      ['Common mistakes and how to spot them', 'reading', 10],
      ['Practice sheet walkthrough', 'video', 15],
      ['Check your skills', 'quiz', 10],
    ]),
    quiz: [
      { q: 'Which formula adds cells A2 to A10?', options: ['=ADD(A2:A10)', '=SUM(A2:A10)', '=TOTAL(A2,A10)'], answer: 1 },
      { q: 'VLOOKUP searches for a value in…', options: ['the first column of a range', 'any row of the sheet', 'the last column of a range'], answer: 0 },
      { q: '=AVERAGE(B2:B5) with 10, 20, 30, 40 returns…', options: ['100', '25', '40'], answer: 1 },
    ],
    trackId: 'back-office',
    tile: '#023B2A',
  },
  {
    id: 'back-office-101',
    title: 'Back-office processes 101',
    providerId: 'blueharbor',
    providerName: 'BlueHarbor CX Academy',
    category: 'backoffice',
    level: 'Beginner',
    hours: 3,
    rating: 4.7,
    learners: 860,
    skills: ['Process documentation', 'Data entry'],
    summary: 'How a back-office team actually works: tickets, queues, quality checks and documenting what you did.',
    outcomes: ['Follow a standard operating procedure', 'Document a process so someone else can repeat it', 'Hit accuracy and turnaround targets'],
    lessons: L('bo', [
      ['What a back office does', 'video', 10],
      ['Queues, tickets and turnaround time', 'video', 16],
      ['Reading an SOP', 'reading', 12],
      ['Writing clear process notes', 'video', 14],
      ['Quality checks and accuracy', 'video', 12],
      ['Check your skills', 'quiz', 10],
    ]),
    quiz: [
      { q: 'An SOP is…', options: ['a standard operating procedure', 'a sales opportunity', 'a type of spreadsheet'], answer: 0 },
      { q: 'Good process notes should let…', options: ['only you repeat the task', 'anyone on the team repeat the task', 'the client approve the task'], answer: 1 },
      { q: 'Turnaround time measures…', options: ['how long a task takes from start to finish', 'how many tasks you skipped', 'your break time'], answer: 0 },
    ],
    trackId: 'back-office',
    tile: '#023B2A',
  },
  {
    id: 'cs-essentials',
    title: 'Customer service essentials',
    providerId: 'northwind',
    providerName: 'Northwind BPO',
    category: 'customer',
    level: 'Beginner',
    hours: 2,
    rating: 4.6,
    learners: 2310,
    skills: ['Customer service', 'English communication'],
    summary: 'Calm, clear and kind: the basics every voice and chat agent needs on day one.',
    outcomes: ['Open and close a conversation professionally', 'Handle an upset customer', 'Explain a policy in plain English'],
    lessons: L('cs', [
      ['What great service sounds like', 'video', 10],
      ['Listening first, then solving', 'video', 14],
      ['Handling upset customers', 'video', 16],
      ['Plain-English phrases that work', 'reading', 8],
      ['Check your skills', 'quiz', 8],
    ]),
    quiz: [
      { q: 'A customer is angry about a late refund. First you…', options: ['explain the policy right away', 'acknowledge how they feel', 'transfer the call'], answer: 1 },
      { q: 'Which is clearer?', options: ['“Kindly be informed that…”', '“Your refund will arrive by Friday.”', '“As per our records…”'], answer: 1 },
      { q: 'You close a call by…', options: ['hanging up once solved', 'confirming the issue is solved and thanking them', 'asking for a survey only'], answer: 1 },
    ],
    trackId: 'cs-trainee',
    tile: '#005D41',
  },
  {
    id: 'calls',
    title: 'Handling customer calls',
    providerId: 'northwind',
    providerName: 'Northwind BPO',
    category: 'customer',
    level: 'Intermediate',
    hours: 2.5,
    rating: 4.5,
    learners: 1180,
    skills: ['Call handling', 'Typing 35 wpm'],
    summary: 'Mock calls, hold etiquette and typing notes while you talk. Prep for Northwind’s Module 2.',
    outcomes: ['Use hold and transfer properly', 'Type call notes while talking', 'Stay within average handle time'],
    lessons: L('calls', [
      ['The anatomy of a support call', 'video', 12],
      ['Hold, mute and transfer', 'video', 10],
      ['Typing notes while you talk', 'video', 18],
      ['Average handle time, explained', 'reading', 8],
      ['Check your skills', 'quiz', 8],
    ]),
    quiz: [
      { q: 'Before putting a caller on hold you should…', options: ['ask permission and say how long', 'just press hold', 'transfer instead'], answer: 0 },
      { q: 'Average handle time includes…', options: ['talk, hold and after-call work', 'only talk time', 'only hold time'], answer: 0 },
      { q: 'Good call notes are…', options: ['long and detailed', 'short, factual and searchable', 'written after your shift'], answer: 1 },
    ],
    trackId: 'cs-trainee',
    tile: '#005D41',
  },
  {
    id: 'typing-accuracy',
    title: 'Typing and data accuracy',
    providerId: 'tala',
    providerName: 'Tala Data Services',
    category: 'backoffice',
    level: 'Beginner',
    hours: 1.5,
    rating: 4.7,
    learners: 940,
    skills: ['Data entry', 'Attention to detail'],
    summary: 'Speed is nothing without accuracy. Drills and checks used by Tala’s own data team.',
    outcomes: ['Type 35+ words per minute', 'Double-check entries without slowing down', 'Spot duplicates and typos'],
    lessons: L('type', [
      ['Home row and posture', 'video', 8],
      ['Speed drills', 'video', 15],
      ['Accuracy checks that don’t slow you down', 'reading', 10],
      ['Check your skills', 'quiz', 8],
    ]),
    quiz: [
      { q: 'The fastest way to cut errors is…', options: ['typing faster', 'checking against the source as you go', 'skipping hard fields'], answer: 1 },
      { q: 'A duplicate record is…', options: ['the same entry recorded twice', 'a backup file', 'an empty row'], answer: 0 },
      { q: 'Good posture helps because…', options: ['it looks professional', 'it reduces strain so you stay accurate longer', 'it is required by law'], answer: 1 },
    ],
    trackId: 'data-entry',
    tile: '#5E6B64',
  },
  {
    id: 'it-networking',
    title: 'IT support basics: networking (IP, DNS)',
    providerId: 'hakbang',
    providerName: 'Hakbang Learn',
    category: 'it',
    level: 'Beginner',
    hours: 3,
    rating: 4.6,
    learners: 1520,
    skills: ['Basic networking (IP, DNS)'],
    summary: 'Why the Wi-Fi “works but nothing loads”. IP addresses, DNS and the five questions every help desk asks.',
    outcomes: ['Explain IP addresses and DNS simply', 'Run ping and ipconfig', 'Troubleshoot a “no internet” ticket'],
    lessons: L('net', [
      ['How devices find each other', 'video', 14],
      ['IP addresses without the math', 'video', 16],
      ['DNS: the internet’s phonebook', 'video', 12],
      ['Your first troubleshooting checklist', 'reading', 10],
      ['Check your skills', 'quiz', 10],
    ]),
    quiz: [
      { q: 'DNS turns…', options: ['names like hakbang.ph into IP addresses', 'Wi-Fi into cable', 'passwords into codes'], answer: 0 },
      { q: '“ping” checks whether…', options: ['a device can be reached', 'a file is saved', 'the printer has ink'], answer: 0 },
      { q: 'Wi-Fi connects but no site loads. Check…', options: ['the monitor cable', 'DNS settings', 'the keyboard'], answer: 1 },
    ],
    tile: '#127050',
  },
  {
    id: 'it-ticketing',
    title: 'Ticketing tools for IT support',
    providerId: 'hakbang',
    providerName: 'Hakbang Learn',
    category: 'it',
    level: 'Beginner',
    hours: 1.5,
    rating: 4.4,
    learners: 610,
    skills: ['Ticketing tools'],
    summary: 'Create, prioritise and close tickets the way help desks do, with practice on a sample queue.',
    outcomes: ['Write a clear ticket', 'Set the right priority', 'Close tickets with a useful resolution note'],
    lessons: L('tix', [
      ['What a ticket is for', 'video', 8],
      ['Priority and SLAs', 'video', 12],
      ['Writing resolution notes', 'reading', 8],
      ['Check your skills', 'quiz', 8],
    ]),
    quiz: [
      { q: 'A P1 ticket means…', options: ['highest priority, fix first', 'lowest priority', 'a duplicate'], answer: 0 },
      { q: 'An SLA is…', options: ['a promised response or fix time', 'a software license', 'a type of cable'], answer: 0 },
      { q: 'A good resolution note says…', options: ['“fixed”', 'what was wrong and what you did', 'nothing; close it quickly'], answer: 1 },
    ],
    tile: '#127050',
  },
  {
    id: 'interview',
    title: 'Job interviews and your first 90 days',
    providerId: 'hakbang',
    providerName: 'Hakbang Learn',
    category: 'career',
    level: 'Beginner',
    hours: 1,
    rating: 4.9,
    learners: 3870,
    skills: ['Interview skills'],
    summary: 'Answer “Tell me about yourself” with confidence, and know what your SSS, PhilHealth and Pag-IBIG mean on payday.',
    outcomes: ['Tell your story in 60 seconds', 'Read a job offer and payslip', 'Pass your probation period'],
    lessons: L('int', [
      ['Tell me about yourself', 'video', 10],
      ['Questions to ask them', 'reading', 6],
      ['Reading your payslip', 'video', 10],
      ['Check your skills', 'quiz', 6],
    ]),
    quiz: [
      { q: '“Tell me about yourself” should be…', options: ['your full life story', 'a 60-second story about skills and goals', 'your hobbies only'], answer: 1 },
      { q: 'SSS, PhilHealth and Pag-IBIG on your payslip are…', options: ['government benefits of a regular job', 'fees you pay Hakbang', 'optional bonuses'], answer: 0 },
      { q: 'A good question to ask the interviewer is…', options: ['“What does a great first month look like?”', '“Can I start late?”', 'none; never ask questions'], answer: 0 },
    ],
    tile: '#94570C',
  },
  {
    id: 'email-writing',
    title: 'Professional email writing',
    providerId: 'hakbang',
    providerName: 'Hakbang Learn',
    category: 'career',
    level: 'Beginner',
    hours: 1,
    rating: 4.6,
    learners: 1430,
    skills: ['Business writing'],
    summary: 'Short, polite, clear. Templates for follow-ups, updates and saying sorry at work.',
    outcomes: ['Write a clear subject line', 'Keep emails under five sentences', 'Follow up without sounding pushy'],
    lessons: L('mail', [
      ['Subject lines that get read', 'video', 8],
      ['The five-sentence email', 'reading', 6],
      ['Following up politely', 'video', 8],
      ['Check your skills', 'quiz', 6],
    ]),
    quiz: [
      { q: 'The best subject line is…', options: ['“Hello”', '“Module 2 results: question about item 4”', '“URGENT!!!”'], answer: 1 },
      { q: 'A work email should be…', options: ['as long as possible', 'short and specific', 'all capital letters'], answer: 1 },
      { q: 'When following up you should…', options: ['repeat the request politely with context', 'send the same email again', 'call their personal number'], answer: 0 },
    ],
    tile: '#94570C',
  },
];

export const courseById = (id: string) => COURSES.find((c) => c.id === id);

export const CATEGORY_KEYS: Record<Course['category'], string> = {
  excel: 'learn.cat.excel',
  customer: 'learn.cat.customer',
  backoffice: 'learn.cat.backoffice',
  it: 'learn.cat.it',
  career: 'learn.cat.career',
};

/** Paolo's skills from finished courses raise his skills score on tracks that need them. */
export function boostedMatch(base: { total: number; skills: number; location: number; schedule: number }, requiredSkills: string[], courseSkills: string[]) {
  const req = requiredSkills.map((s) => s.toLowerCase());
  const hits = courseSkills.filter((s) => req.includes(s.toLowerCase())).length;
  if (!hits) return { ...base, boost: 0 };
  const skills = Math.min(1, base.skills + hits * 0.1);
  const boost = Math.round((skills - base.skills) * 40);
  return { total: Math.min(99, base.total + boost), skills, location: base.location, schedule: base.schedule, boost };
}
