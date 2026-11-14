import { useEffect, useId, useRef, useState, type ButtonHTMLAttributes, type ComponentType, type InputHTMLAttributes, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, ChevronLeft, ShieldCheck, Sparkles, X, type LucideProps } from 'lucide-react';
import { useT } from '../i18n';
import { useDemo } from '../store';

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');

/* ---------------- Button ---------------- */

type Variant = 'primary' | 'secondary' | 'onDark' | 'onDarkOutline' | 'danger' | 'lime' | 'ghost';
type Size = 'lg' | 'md' | 'sm';

// Buttons sit on a ledge (hard offset shadow) and physically step down when pressed.
const press = 'enabled:active:translate-y-[3px] enabled:active:shadow-none transition-[transform,box-shadow,background-color] duration-100';
const variants: Record<Variant, string> = {
  primary: `bg-green text-white shadow-step hover:bg-[#006b4b] disabled:bg-line disabled:text-muted disabled:shadow-none ${press}`,
  secondary: `bg-cream text-ink border-[1.5px] border-ink shadow-step-ink hover:bg-white ${press}`,
  onDark: `bg-cream text-green shadow-step-lime hover:bg-white ${press}`,
  onDarkOutline: `bg-transparent text-white border-[1.5px] border-white/70 hover:bg-white/10 hover:border-white ${press}`,
  danger: `bg-red-tint text-red border-[1.5px] border-red/40 ${press}`,
  lime: `bg-lime text-deep shadow-[0_4px_0_0_#15201A] hover:bg-[#6cc35f] ${press}`,
  ghost: 'text-green hover:bg-mint',
};
const sizes: Record<Size, string> = {
  lg: 'h-[52px] px-6 text-button rounded-btn',
  md: 'h-11 px-5 text-[15px] font-semibold rounded-btn',
  sm: 'h-9 px-3.5 text-label rounded-[10px]',
};

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  to?: string;
  block?: boolean;
  icon?: ComponentType<LucideProps>;
}

export function Button({ variant = 'primary', size = 'lg', to, block, icon: Icon, className, children, ...rest }: BtnProps) {
  const cls = cx(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-ring disabled:cursor-not-allowed',
    variants[variant],
    sizes[size],
    block && 'w-full',
    className,
  );
  const inner = (
    <>
      {Icon && <Icon size={size === 'sm' ? 16 : 18} aria-hidden />}
      {children}
    </>
  );
  if (to)
    return (
      <Link to={to} className={cls}>
        {inner}
      </Link>
    );
  return (
    <button type="button" className={cls} {...rest}>
      {inner}
    </button>
  );
}

/* ---------------- Badges, tags, chips ---------------- */

export function VerifiedBadge({ dark, className }: { dark?: boolean; className?: string }) {
  const t = useT();
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 h-[26px] text-caption whitespace-nowrap',
        dark ? 'bg-white/10 text-white' : 'bg-mint text-green',
        className,
      )}
    >
      <ShieldCheck size={14} aria-hidden />
      {t('verifiedEmployer')}
    </span>
  );
}

export function LaunchTag({ className }: { className?: string }) {
  const t = useT();
  return (
    <span className={cx('hk-sticker inline-flex items-center rounded-[6px] border border-mango-ink/40 bg-mango-tint text-mango-ink px-2 h-[24px] font-mono text-[10.5px] font-semibold uppercase tracking-[0.06em] whitespace-nowrap', className)}>
      ✦ {t('launchFeature')}
    </span>
  );
}

export function AiTag() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-mint text-green px-2 h-5 text-[11px] font-semibold" title="Filled by AI, editable">
      <Sparkles size={11} aria-hidden />
      AI
    </span>
  );
}

export function StatusPill({ tone, children }: { tone: 'green' | 'mint' | 'mango' | 'grey' | 'red'; children: ReactNode }) {
  const tones = {
    green: 'bg-green text-white',
    mint: 'bg-mint text-green',
    mango: 'bg-mango-tint text-mango-ink',
    grey: 'bg-paper text-muted border border-line',
    red: 'bg-red-tint text-red',
  };
  return <span className={cx('inline-flex items-center rounded-full px-2.5 h-6 text-caption whitespace-nowrap', tones[tone])}>{children}</span>;
}

export function Chip({
  selected,
  onClick,
  icon: Icon,
  children,
  dashed,
  className,
}: {
  selected?: boolean;
  onClick?: () => void;
  icon?: ComponentType<LucideProps>;
  children: ReactNode;
  dashed?: boolean;
  className?: string;
}) {
  const cls = cx(
    'inline-flex items-center gap-1.5 rounded-full h-9 px-3.5 text-label whitespace-nowrap transition-colors',
    selected ? 'bg-ink text-cream border-[1.5px] border-ink' : 'bg-cream text-ink border-[1.5px] border-ink/25',
    dashed && 'border-dashed border-green text-green',
    onClick && 'focus-ring hover:border-green',
    className,
  );
  const inner = (
    <>
      {Icon && <Icon size={15} aria-hidden />}
      {children}
    </>
  );
  return onClick ? (
    <button type="button" aria-pressed={selected} className={cls} onClick={onClick}>
      {inner}
    </button>
  ) : (
    <span className={cls}>{inner}</span>
  );
}

/* ---------------- Surfaces ---------------- */

export function Card({ className, children, as: As = 'div' }: { className?: string; children: ReactNode; as?: 'div' | 'section' | 'li' }) {
  return <As className={cx('bg-cream border-[1.5px] border-ink rounded-card shadow-brut-sm', className)}>{children}</As>;
}

export function IconTile({
  icon: Icon,
  tone = 'mint',
  size = 44,
  className,
}: {
  icon: ComponentType<LucideProps>;
  tone?: 'mint' | 'mango' | 'white' | 'red' | 'lime' | 'green';
  size?: number;
  className?: string;
}) {
  const tones = {
    mint: 'bg-mint text-green',
    mango: 'bg-mango-tint text-mango',
    white: 'bg-white text-green',
    red: 'bg-red-tint text-red',
    lime: 'bg-lime text-deep',
    green: 'bg-green text-white',
  };
  return (
    <span className={cx('inline-flex items-center justify-center rounded-[12px] shrink-0', tones[tone], className)} style={{ width: size, height: size }}>
      <Icon size={Math.round(size * 0.48)} aria-hidden />
    </span>
  );
}

export function Avatar({ initials, size = 44, className, dark }: { initials: string; size?: number; className?: string; dark?: boolean }) {
  return (
    <span
      className={cx('inline-flex items-center justify-center rounded-full font-semibold shrink-0', dark ? 'bg-green text-white' : 'bg-mint text-green', className)}
      style={{ width: size, height: size, fontSize: Math.max(11, Math.round(size * 0.32)) }}
      aria-hidden
    >
      {initials}
    </span>
  );
}

export function CompanyTile({ initials, color, size = 44 }: { initials: string; color: string; size?: number }) {
  // TODO(team): partner logos are initials tiles until real logos are supplied.
  return (
    <span
      className="inline-flex items-center justify-center rounded-[12px] text-white font-semibold shrink-0"
      style={{ width: size, height: size, background: color, fontSize: Math.round(size * 0.3) }}
      aria-hidden
    >
      {initials}
    </span>
  );
}

/* ---------------- Inputs ---------------- */

export function Field({
  label,
  ai,
  className,
  ...rest
}: { label: string; ai?: boolean; className?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="flex items-center gap-2 text-body-s text-muted mb-2">
        {label}
        {ai && <AiTag />}
      </label>
      <input
        id={id}
        className="w-full h-[50px] rounded-input border border-line bg-white px-4 text-body text-ink focus:outline-none focus:border-green focus:ring-2 focus:ring-green/20"
        {...rest}
      />
    </div>
  );
}

export function Checkbox({ checked, onChange, children, dark }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode; dark?: boolean }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer select-none">
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span
        className={cx(
          'mt-px w-[22px] h-[22px] rounded-[6px] flex items-center justify-center shrink-0 border-2 peer-focus-visible:ring-2 peer-focus-visible:ring-green peer-focus-visible:ring-offset-2',
          checked ? 'bg-green border-green text-white' : dark ? 'border-white/60' : 'border-line bg-white',
        )}
        aria-hidden
      >
        {checked && <Check size={15} strokeWidth={3} />}
      </span>
      <span className="text-body-s text-ink">{children}</span>
    </label>
  );
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={cx('relative w-[46px] h-[28px] rounded-full transition-colors shrink-0 focus-ring', checked ? 'bg-green' : 'bg-line')}
    >
      <span className={cx('absolute top-[3px] w-[22px] h-[22px] rounded-full bg-white shadow transition-all', checked ? 'left-[21px]' : 'left-[3px]')} />
    </button>
  );
}

export function Radio({ checked }: { checked: boolean }) {
  return (
    <span className={cx('w-[22px] h-[22px] rounded-full shrink-0 flex items-center justify-center', checked ? 'bg-green' : 'border-2 border-line bg-white')} aria-hidden>
      {checked && <span className="w-2 h-2 rounded-full bg-white" />}
    </span>
  );
}

/* ---------------- Meters ---------------- */

export function ProgressBar({ value, className, track = 'bg-line', fill = 'bg-lime', height = 6 }: { value: number; className?: string; track?: string; fill?: string; height?: number }) {
  return (
    <div className={cx('rounded-full overflow-hidden', track, className)} style={{ height }} role="progressbar" aria-valuenow={Math.round(value * 100)} aria-valuemin={0} aria-valuemax={100}>
      <div className={cx('h-full rounded-full', fill)} style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%` }} />
    </div>
  );
}

export function MatchBars({ match, dark, labels, compact }: { match: { skills: number; location: number; schedule: number }; dark?: boolean; labels?: [string, string, string]; compact?: boolean }) {
  const t = useT();
  const rows: [string, number][] = [
    [labels?.[0] ?? t('match.skills'), match.skills],
    [labels?.[1] ?? t('match.location'), match.location],
    [labels?.[2] ?? t('match.schedule'), match.schedule],
  ];
  return (
    <dl className={cx('flex-1 min-w-0', compact ? 'space-y-0.5' : 'space-y-1.5')}>
      {rows.map(([l, v]) => (
        <div key={l} className="flex items-center gap-3">
          <dt className={cx('text-caption flex-1 min-w-0', dark ? 'text-white' : 'text-ink')}>{l}</dt>
          <dd className="w-[70px] shrink-0" aria-label={`${Math.round(v * 100)}%`}>
            <ProgressBar value={v} track={dark ? 'bg-white/15' : 'bg-white'} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function ScoreRing({ value, size = 72, stroke = 9, label }: { value: number; size?: number; stroke?: number; label?: ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <span className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#DDE5DF" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#5DB250" strokeWidth={stroke} strokeDasharray={`${c * value} ${c}`} strokeLinecap="round" />
      </svg>
      {label != null && <span className="absolute font-display font-bold text-h-m text-ink">{label}</span>}
    </span>
  );
}

/* ---------------- Overlays ---------------- */

function useEscape(onClose: () => void) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
}

function useFocusFirst<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current?.querySelector<HTMLElement>('button, [href], input, textarea, select');
    el?.focus();
  }, []);
  return ref;
}

export function Modal({ onClose, children, width = 560, labelledBy }: { onClose: () => void; children: ReactNode; width?: number; labelledBy?: string }) {
  useEscape(onClose);
  const ref = useFocusFirst<HTMLDivElement>();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4a5e52]/60 animate-fade" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby={labelledBy} className="bg-white rounded-panel shadow-float w-full max-h-[90vh] overflow-auto p-6 sm:p-8 animate-pop" style={{ maxWidth: width }}>
        {children}
      </div>
    </div>
  );
}

export function BottomSheet({ onClose, children, labelledBy }: { onClose: () => void; children: ReactNode; labelledBy?: string }) {
  useEscape(onClose);
  const ref = useFocusFirst<HTMLDivElement>();
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-deep/70 animate-fade" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby={labelledBy} className="bg-white w-full max-w-[480px] rounded-t-sheet px-5 pt-3 pb-8 max-h-[92vh] overflow-auto animate-sheet">
        <div className="mx-auto mb-4 w-10 h-1.5 rounded-full bg-line" aria-hidden />
        {children}
      </div>
    </div>
  );
}

export function CloseButton({ onClick, label = 'Close' }: { onClick: () => void; label?: string }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className="w-9 h-9 rounded-full hover:bg-paper flex items-center justify-center focus-ring text-muted">
      <X size={20} />
    </button>
  );
}

/* ---------------- Mobile top bar ---------------- */

export function TopBar({ title, back, right, dark, tag }: { title: string; back?: string | number; right?: ReactNode; dark?: boolean; tag?: ReactNode }) {
  const nav = useNavigate();
  const t = useT();
  return (
    <div className={cx('flex items-center gap-3 h-14 px-3', dark ? 'text-white' : 'text-ink')}>
      {back !== undefined && (
        <button
          type="button"
          aria-label={t('back')}
          onClick={() => (typeof back === 'number' ? nav(back) : nav(back))}
          className={cx('w-10 h-10 rounded-full flex items-center justify-center focus-ring', dark ? 'hover:bg-white/10' : 'hover:bg-white')}
        >
          <ChevronLeft size={22} />
        </button>
      )}
      <h1 className="text-title truncate">{title}</h1>
      {tag}
      <div className="ml-auto">{right}</div>
    </div>
  );
}

/* ---------------- Language toggle ---------------- */

export function LangToggle({ short, className }: { short?: boolean; className?: string }) {
  const lang = useDemo((s) => s.lang);
  const setLang = useDemo((s) => s.setLang);
  const opts: ['fil' | 'en', string][] = short ? [['fil', 'FIL'], ['en', 'EN']] : [['fil', 'Filipino'], ['en', 'English']];
  return (
    <div role="group" aria-label="Wika / Language" className={cx('inline-flex p-[3px] rounded-full bg-white border border-line', className)}>
      {opts.map(([v, l]) => (
        <button
          key={v}
          type="button"
          lang={v === 'fil' ? 'fil' : 'en'}
          aria-pressed={lang === v}
          onClick={() => setLang(v)}
          className={cx('rounded-full font-semibold transition-colors focus-ring', short ? 'h-[26px] px-2.5 text-caption' : 'h-9 px-4 text-label', lang === v ? 'bg-green text-white' : 'text-ink hover:bg-paper')}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

/* ---------------- Toast ---------------- */

export function Toast({ message, onDone }: { message: string | null; onDone: () => void }) {
  useEffect(() => {
    if (!message) return;
    const id = setTimeout(onDone, 2600);
    return () => clearTimeout(id);
  }, [message, onDone]);
  if (!message) return null;
  return (
    <div role="status" className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] bg-ink text-white text-body-s px-4 py-3 rounded-btn shadow-float animate-pop max-w-[90vw]">
      {message}
    </div>
  );
}

/** Desktop job-seeker breakpoint (matches the 1024px rule in the handoff). */
export function useIsDesktop() {
  const q = '(min-width: 1024px)';
  const get = () => typeof window !== 'undefined' && window.matchMedia(q).matches;
  const [v, setV] = useState<boolean>(get);
  useEffect(() => {
    const m = window.matchMedia(q);
    const h = () => setV(m.matches);
    m.addEventListener('change', h);
    return () => m.removeEventListener('change', h);
  }, [setV]);
  return v;
}

/** Renders "*word*" segments of a string as serif-italic accents. */
export function Accent({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/\*([^*]+)\*/g);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 ? (
          <em key={i} className={cx('hk-accent not-italic-fallback', className)}>
            {p}
          </em>
        ) : (
          p
        ),
      )}
    </>
  );
}

/** Mono section label: ▪ 02 — PAANO ITO GUMAGANA */
export function Eyebrow({ n, children, dark }: { n?: string; children: ReactNode; dark?: boolean }) {
  return (
    <div className={cx('flex items-center gap-2.5 font-mono text-[11.5px] font-semibold uppercase tracking-[0.14em]', dark ? 'text-lime' : 'text-green')}>
      <span className={cx('w-2.5 h-2.5', dark ? 'bg-lime' : 'bg-green')} aria-hidden />
      {n && <span className={dark ? 'text-white/60' : 'text-muted'}>{n} —</span>}
      {children}
    </div>
  );
}
