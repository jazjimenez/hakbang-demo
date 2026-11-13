import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from 'react';
import { cx } from './ui';

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
export function CountUp({ to, prefix = '', suffix = '', duration = 1200, className }: { to: number; prefix?: string; suffix?: string; duration?: number; className?: string }) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [n, setN] = useState(() => (reduced() ? to : 0));
  useEffect(() => {
    if (!inView || reduced()) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);
  return (
    <span ref={ref} className={className} aria-label={`${prefix}${to.toLocaleString('en-PH')}${suffix}`}>
      <span aria-hidden>
        {prefix}
        {n.toLocaleString('en-PH')}
        {suffix}
      </span>
    </span>
  );
}
