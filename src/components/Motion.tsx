import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';
import { cx } from './ui';
import { AnimatedBackground } from './motion-primitives/animated-background';
import { AnimatedNumber } from './motion-primitives/animated-number';
import { BorderTrail } from './motion-primitives/border-trail';
import { Magnetic } from './motion-primitives/magnetic';
import { TextEffect } from './motion-primitives/text-effect';
import { Tilt } from './motion-primitives/tilt';

const reduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** True once the element has scrolled into view (fires once). */
export function useInView<T extends Element>(margin = '0px 0px -12% 0px') {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window) || reduced()) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: margin, threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return { ref, inView };
}

/**
 * Fades + lifts its content in when scrolled into view.
 * `stagger` also cascades direct children (see .hk-stagger in index.css).
 */
export function Reveal({
  as: As = 'div',
  delay = 0,
  stagger,
  className,
  children,
  style,
}: {
  as?: ElementType;
  delay?: number;
  stagger?: boolean;
  className?: string;
  children: ReactNode;
  style?: CSSProperties;
}) {
  const { ref, inView } = useInView<HTMLElement>();
  return (
    <As ref={ref} className={cx(stagger ? 'hk-stagger' : 'hk-reveal', inView && 'is-in', className)} style={{ ...style, '--d': `${delay}ms` } as CSSProperties}>
      {children}
    </As>
  );
}

/** Counts up to `to` when visible. Renders the final value for no-JS / reduced motion. */
export function CountUp({ to, prefix = '', suffix = '', duration = 1200, decimals = 0, className }: { to: number; prefix?: string; suffix?: string; duration?: number; decimals?: number; className?: string }) {
  const fmt = (v: number) => v.toLocaleString('en-PH', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [n, setN] = useState(() => (reduced() ? to : 0));
  useEffect(() => {
    if (!inView || reduced()) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      setN(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);
  return (
    <span ref={ref} className={className}>
      <span className="sr-only">
        {prefix}
        {fmt(to)}
        {suffix}
      </span>
      <span aria-hidden>
        {prefix}
        {fmt(n)}
        {suffix}
      </span>
    </span>
  );
}

/* ---------------- Motion Primitives, on brand ----------------
 * Thin wrappers around the vendored components in ./motion-primitives.
 * Each one renders its plain children when the visitor prefers reduced
 * motion, and the pointer effects only switch on for a real mouse.
 */

const finePointer = () => typeof window !== 'undefined' && window.matchMedia?.('(hover: hover) and (pointer: fine)').matches;

function usePointerFx() {
  const reduce = useReducedMotion();
  const [fine, setFine] = useState(false);
  useEffect(() => setFine(finePointer()), []);
  return fine && !reduce;
}

/** Pulls its child gently toward the cursor (primary CTAs only). */
export function MagneticCta({ children, className }: { children: ReactNode; className?: string }) {
  const on = usePointerFx();
  return (
    <span className={cx('inline-flex', className)}>
      {on ? (
        <Magnetic intensity={0.25} range={120} springOptions={{ stiffness: 220, damping: 18, mass: 0.4 }}>
          {children}
        </Magnetic>
      ) : (
        children
      )}
    </span>
  );
}

/** Tilts a card a few degrees, the side under the cursor dipping away. */
export function TiltCard({ children, className, deg = 6 }: { children: ReactNode; className?: string; deg?: number }) {
  const on = usePointerFx();
  if (!on) return <div className={className}>{children}</div>;
  return (
    <Tilt rotationFactor={deg} springOptions={{ stiffness: 260, damping: 24, mass: 0.5 }} className={className}>
      {children}
    </Tilt>
  );
}

/** A lime spark that runs around its parent's border. Parent must be `relative`. */
export function EdgeTrail({ className, size = 72, duration = 7 }: { className?: string; size?: number; duration?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return <BorderTrail size={size} className={cx('bg-lime', className)} transition={{ repeat: Infinity, duration, ease: 'linear' }} />;
}

/** Words slide up one after another. Re-runs when the text changes (e.g. language toggle). */
export function WordsIn({ text, className, delay = 0, as = 'p' }: { text: string; className?: string; delay?: number; as?: 'p' | 'span' | 'div' }) {
  const reduce = useReducedMotion();
  if (reduce) {
    const As = as;
    return <As className={className}>{text}</As>;
  }
  return (
    <TextEffect key={text} as={as} per="word" preset="slide" delay={delay} speedReveal={1.4} className={className}>
      {text}
    </TextEffect>
  );
}

/** A number that springs to each new value. */
export function SpringNumber({ value, className }: { value: number; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <span className={cx('tabular-nums', className)}>{value.toLocaleString('en-PH')}</span>;
  return <AnimatedNumber value={value} locale="en-PH" springOptions={{ stiffness: 180, damping: 26, mass: 0.6 }} className={className} />;
}

/** A sliding highlight that follows the hovered item in a row. */
export { AnimatedBackground as HoverHighlight };
