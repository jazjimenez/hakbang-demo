import { Check } from 'lucide-react';
import type { ReactNode } from 'react';
import { cx } from './ui';
import type { StepState } from '../store';

export interface TrailStep {
  key: string;
  label: ReactNode;
  sub?: ReactNode;
  state: StepState;
}

function Node({ state, size }: { state: StepState; size: number }) {
  if (state === 'done')
    return (
      <span className="rounded-full bg-green text-white flex items-center justify-center shrink-0 relative z-[1]" style={{ width: size, height: size }}>
        <Check size={Math.round(size * 0.55)} strokeWidth={2.6} aria-hidden />
      </span>
    );
  if (state === 'current')
    return <span className="rounded-full bg-white shrink-0 relative z-[1]" style={{ width: size, height: size, boxShadow: `inset 0 0 0 ${Math.round(size * 0.27)}px #005D41` }} aria-hidden />;
  return <span className="rounded-full bg-white shrink-0 relative z-[1]" style={{ width: size, height: size, boxShadow: 'inset 0 0 0 2px #DDE5DF' }} aria-hidden />;
}

const srState = { done: 'Done', current: 'Current step', upcoming: 'Upcoming' } as const;

/**
 * The signature progress "trail". Vertical on mobile (S08), horizontal on desktop (D05) and landing.
 * Connector is lime once the step it leaves is done.
 */
export function Trail({ steps, orientation = 'vertical', size = 26, compact }: { steps: TrailStep[]; orientation?: 'vertical' | 'horizontal'; size?: number; compact?: boolean }) {
  if (orientation === 'horizontal') {
    return (
      <ol className="flex w-full">
        {steps.map((s, i) => (
          <li key={s.key} className="flex-1 min-w-0 flex flex-col items-center text-center relative" aria-current={s.state === 'current' ? 'step' : undefined}>
            <div className="flex items-center w-full" style={{ height: size }}>
              <span className={cx('flex-1 h-1 rounded-r-full', i === 0 ? 'invisible' : steps[i - 1].state === 'done' ? 'bg-lime' : 'bg-line')} />
              <Node state={s.state} size={size} />
              <span className={cx('flex-1 h-1 rounded-l-full', i === steps.length - 1 ? 'invisible' : s.state === 'done' ? 'bg-lime' : 'bg-line')} />
            </div>
            <span className="sr-only">{srState[s.state]}: </span>
            <span className={cx('mt-3', compact ? 'px-0.5 sm:px-1 text-[11px] leading-[14px] sm:text-caption' : 'px-1 text-body-s', s.state === 'current' ? cx('text-ink font-semibold', !compact && 'text-[15px]') : s.state === 'done' ? 'text-ink' : 'text-muted')}>{s.label}</span>
            {s.sub && <span className={cx('mt-1 text-caption', s.state === 'current' ? 'text-green' : 'text-muted')}>{s.sub}</span>}
          </li>
        ))}
      </ol>
    );
  }
  return (
    <ol className="relative">
      {steps.map((s, i) => (
        <li key={s.key} className="flex gap-3.5 relative" aria-current={s.state === 'current' ? 'step' : undefined}>
          <div className="flex flex-col items-center" style={{ width: size }}>
            <Node state={s.state} size={size} />
            {i < steps.length - 1 && <span className={cx('w-1 flex-1 -my-0.5 min-h-[18px]', s.state === 'done' ? 'bg-lime' : 'bg-line')} />}
          </div>
          <div className={cx('pb-4 min-w-0', i === steps.length - 1 && 'pb-0')} style={{ paddingTop: (size - 22) / 2 }}>
            <span className="sr-only">{srState[s.state]}: </span>
            <div className={cx('text-body', s.state === 'current' ? 'font-semibold text-ink' : s.state === 'done' ? 'text-ink' : 'text-muted')}>{s.label}</div>
            {s.sub && <div className={cx('text-caption mt-0.5', s.state === 'current' ? 'text-green font-semibold' : 'text-muted')}>{s.sub}</div>}
          </div>
        </li>
      ))}
    </ol>
  );
}
