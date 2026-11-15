/**
 * Real, sourced figures used in the landing-page story (problem → impact).
 * Philippine Statistics Authority (PSA) Labor Force Survey, September 2026,
 * as reported by Daily Tribune on November 6, 2026. Update here when PSA releases new data.
 */
export const LFS = {
  month: { fil: 'Setyembre 2026', en: 'September 2026' },
  unemploymentRate: 5.4,
  unemploymentRatePrev: 3.8, // September 2025
  unemployed: 2_860_000,
  laborForce: 53_190_000,
  youthEmploymentRate: 84.7, // ages 15–24; so about 15 in 100 young people in the labor force have no job
  youthEmploymentRatePrev: 88.4,
  newYouthEntrants: 988_000,
  sourceLabel: 'PSA Labor Force Survey, Sept 2026 (via Daily Tribune)',
  sourceUrl: 'https://tribune.net.ph/2026/11/06/unemployment-rate-rises-to-54-psa',
};

/** Hakbang's own pilot assumptions (business plan), clearly labelled as such on the page. */
export const PLAN = {
  hireRate: 0.7, // pilot target: 14 of 20 trainees hired
  monthlySalary: 18_000, // entry-level back-office offer in the demo tracks
};
