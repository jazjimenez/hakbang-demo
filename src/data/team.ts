/**
 * Key management personnel (business plan, Table 7.2), as supplied by the team.
 * Edit here; the Team page (src/pages/Site.tsx) reads this file.
 */
export interface Member {
  name: string;
  initials: string;
  role: string;
  short: string; // role abbreviation
  duties: string;
  bio: string;
}

export const SCHOOL = '4th-year BS Computer Science (major in Software Technology) students at De La Salle University';

export const TEAM: Member[] = [
  {
    name: 'Miguel Borromeo',
    initials: 'MB',
    role: 'Chief Executive Officer',
    short: 'CEO',
    duties: 'Sets direction; leads employer sales and partnerships with universities and PESOs; reports to the board.',
    bio: 'At Hakbang, he sets the company’s direction and leads employer sales and partnerships with universities and PESOs.',
  },
  {
    name: 'Reinman Ganayo',
    initials: 'RG',
    role: 'Chief Operating Officer',
    short: 'COO',
    duties: 'Runs employer verification, track onboarding, pilot operations, help desk, and DOLE and NPC compliance.',
    bio: 'He led the team’s customer interviews and designed the employer verification checklist. At Hakbang, he runs employer verification, pilot operations, and the help desk, and keeps the company compliant with DOLE and NPC rules.',
  },
  {
    name: 'Francine Santos',
    initials: 'FS',
    role: 'Chief Financial Officer',
    short: 'CFO',
    duties: 'Pricing, billing and collections, budget, financial plan, tax and BMBE filings.',
    bio: 'She has done the market analysis and the design and development plans. At Hakbang, she handles pricing, billing, the budget, and the financial plan, along with tax and BMBE filings.',
  },
  {
    name: 'Jaztin Jimenez',
    initials: 'JJ',
    role: 'Chief Marketing Officer',
    short: 'CMO',
    duties: 'Job seeker acquisition, #UnangHakbang campaign, social media, campus events, referral program.',
    bio: 'He has website development experience as a Senior Full-Stack Website Developer at Archers Network. At Hakbang, he leads job seeker acquisition through the #UnangHakbang campaign, social media, campus events, and the referral program.',
  },
  {
    name: 'Hyun Jei Tandingan',
    initials: 'HT',
    role: 'Technical Lead',
    short: 'CTO',
    duties: 'Builds and maintains the app and matching engine; manages cloud costs, security, and AI features.',
    bio: 'Jei builds ALAPA-APP, an air quality monitoring and forecasting app, as part of a thesis group, working on its data pipeline and database. At Hakbang, Jei builds and maintains the app and matching engine and manages cloud costs, security, and AI features.',
  },
];
