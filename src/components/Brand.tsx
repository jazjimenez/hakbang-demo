import { cx } from './ui';

const base = import.meta.env.BASE_URL;

/** Full logo. `reversed` = white version for dark surfaces. Height drives size (aspect 316:112). */
export function Logo({ reversed, height = 32, className }: { reversed?: boolean; height?: number; className?: string }) {
  return (
    <img
      src={`${base}brand/${reversed ? 'hakbang-logo-reversed.svg' : 'hakbang-logo.svg'}`}
      alt="Hakbang"
      height={height}
      width={Math.round((height * 316) / 112)}
      className={cx('block', className)}
      style={{ height, width: 'auto' }}
    />
  );
}

export function Mark({ size = 32, className }: { size?: number; className?: string }) {
  return <img src={`${base}brand/hakbang-mark.svg`} alt="" aria-hidden width={size} height={size} className={className} style={{ height: size, width: 'auto' }} />;
}

/** The lime swoosh from the logo, used as a faint background motif on dark screens. */
export function Swoosh({ className, opacity = 0.16, color = '#5DB250' }: { className?: string; opacity?: number; color?: string }) {
  return (
    <svg viewBox="14 66 72 64" className={cx('pointer-events-none absolute', className)} aria-hidden preserveAspectRatio="xMidYMid meet" style={{ opacity }}>
      <path fill={color} d="M84 69C79.1 77 37.1 112.9 40.6 128.3L15.5 128.3Q14.5 128.3 14.5 127L14.5 121C27 102 56 85 82.9 68.6Q84 68.2 84 69Z" />
    </svg>
  );
}
