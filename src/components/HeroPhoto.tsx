import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HERO_PHOTO } from '../data/credits';
import { cx } from './ui';

/**
 * The welcome/sign-up hero photo with its credit. Falls back to the dashed
 * placeholder if there's no photo configured or it fails to load.
 */
export function HeroPhoto({ className, placeholder, compact }: { className?: string; placeholder: string; compact?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (!HERO_PHOTO || failed)
    return <div className={cx('rounded-panel border border-dashed border-white/30 bg-white/5 flex items-end p-6 text-caption text-white/60', className)}>{placeholder}</div>;
  return (
    <figure className={cx('relative overflow-hidden rounded-panel border-[1.5px] border-ink bg-deep', className)}>
      <img
        src={HERO_PHOTO.src}
        alt={HERO_PHOTO.alt}
        loading="eager"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="absolute inset-0 w-full h-full object-cover object-[35%_30%]"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-deep/80 via-deep/10 to-transparent" aria-hidden />
      <figcaption className={cx('absolute left-0 right-0 bottom-0 px-3 py-2 font-mono text-white/85 leading-snug', compact ? 'text-[9.5px]' : 'text-[10.5px]')}>
        Photo: {HERO_PHOTO.owner} ·{' '}
        <Link to="/legal/credits" className="underline hover:text-lime">
          temporary, credits
        </Link>
      </figcaption>
    </figure>
  );
}
