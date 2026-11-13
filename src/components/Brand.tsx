import { Link } from 'react-router-dom';
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

/** The H mark as inline SVG so it can switch colour on dark surfaces (paths from hakbang-mark.svg). */
export function MarkSvg({ size = 32, reversed, className }: { size?: number; reversed?: boolean; className?: string }) {
  return (
    <svg viewBox="10 20 98 112" width={(size * 98) / 112} height={size} className={className} aria-hidden focusable="false">
      <path
        fill={reversed ? '#FFFFFF' : '#005D41'}
        d="M14.5 52Q14.5 48.6 17.6 47.3L40.2 37.9Q43.5 36.6 43.5 40.2L43.5 76.5C52 74.3 60 72 65.8 68.6C69.6 66.4 71 63.8 71 60L71 45.2Q71 42.3 73.6 40.8L99.4 25.8Q103.5 23.5 103.5 28.2L103.5 115.6Q103.5 118.8 100.5 119.8L76 128.2Q72.3 129.5 72.3 125.6L72.3 92.5L88 72.6L93.1 75.6L94.8 56.2L75.9 62.3L80 65.6C63 75.6 33 90.2 14.5 108.5Z"
      />
      <path fill="#5DB250" d="M84 69C79.1 77 37.1 112.9 40.6 128.3L15.5 128.3Q14.5 128.3 14.5 127L14.5 121C27 102 56 85 82.9 68.6Q84 68.2 84 69Z" />
    </svg>
  );
}

/**
 * Nav-bar brand: the H mark on its own is the home link, with "Hakbang" set as live text beside it.
 */
export function NavBrand({ to, reversed, size = 30, className }: { to: string; reversed?: boolean; size?: number; className?: string }) {
  return (
    <span className={cx('inline-flex items-center gap-2', className)}>
      <Link to={to} aria-label="Hakbang home" className="rounded-[6px] focus-ring transition-transform hover:scale-105">
        <MarkSvg size={size} reversed={reversed} className="block" />
      </Link>
      <span className={cx('font-display font-extrabold tracking-[-0.01em] leading-none select-none', reversed ? 'text-white' : 'text-green')} style={{ fontSize: Math.round(size * 0.72) }}>
        Hakbang
      </span>
    </span>
  );
}
