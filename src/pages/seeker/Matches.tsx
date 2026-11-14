import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, BookOpen, Calendar, Check, Clock, Flag, Lock, MapPin, PhilippinePeso, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { AppHeader } from '../../layouts/SeekerShell';
import { MobileFooter } from '../../layouts/SeekerShell';
import { BottomSheet, Button, Checkbox, Chip, CloseButton, CompanyTile, LaunchTag, MatchBars, Modal, ScoreRing, StatusPill, Toast, TopBar, VerifiedBadge, cx, useIsDesktop } from '../../components/ui';
import { useT } from '../../i18n';
import { peso, useDemo, useEmployer, usePaolo, useTrack } from '../../store';
import type { Track } from '../../data/types';

type Filter = 'all' | 'near' | 'weekend';

function useLiveTracks(filter: Filter) {
  const tracks = useDemo((s) => s.tracks);
  return tracks
    .filter((t) => t.status === 'live')
    .filter((t) => (filter === 'near' ? t.match.location >= 0.85 : filter === 'weekend' ? t.schedule.includes('Sat') : true))
    .sort((a, b) => b.match.total - a.match.total);
}

function useApplied(trackId: string) {
  return useDemo((s) => s.applications.some((a) => a.seekerId === 'paolo' && a.trackId === trackId));
}

function Facts({ track, compact }: { track: Track; compact?: boolean }) {
  const t = useT();
  const items: [typeof Calendar, string][] = [[Calendar, t('weeks', { n: track.lengthWeeks })]];
  if (track.allowancePhp) items.push([PhilippinePeso, compact ? peso(track.allowancePhp) : t('allowance', { amt: peso(track.allowancePhp) })]);
  if (!compact) items.push([Clock, track.schedule]);
  else if (!track.allowancePhp) items.push([Clock, track.schedule]);
  items.push([MapPin, track.locationShort]);
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-2 text-body-s text-ink">
      {items.map(([Icon, l]) => (
        <li key={l} className="inline-flex items-center gap-1.5">
          <Icon size={16} className="text-muted" aria-hidden />
          {l}
        </li>
      ))}
    </ul>
  );
}

function Filters({ value, onChange }: { value: Filter; onChange: (f: Filter) => void }) {
  const t = useT();
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar">
      <Chip selected={value === 'all'} onClick={() => onChange('all')}>
        {t('filter.all')}
      </Chip>
      <Chip selected={value === 'near'} onClick={() => onChange('near')} icon={MapPin}>
        {t('filter.near')}
      </Chip>
      <Chip selected={value === 'weekend'} onClick={() => onChange('weekend')} icon={Calendar}>
        {t('filter.weekend')}
      </Chip>
    </div>
  );
}

/* ---------------- S05 card ---------------- */

function TrackCard({ track }: { track: Track }) {
  const t = useT();
  const emp = useEmployer(track.employerId)!;
  const applied = useApplied(track.id);
  return (
    <li>
      <Link to={`/tracks/${track.id}`} className="block bg-cream border-[1.5px] border-ink rounded-card shadow-brut-sm p-4 transition-all duration-150 hover:shadow-brut hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none focus-ring">
        <div className="flex gap-3.5">
          <CompanyTile initials={emp.initials} color={emp.tile} size={44} />
          <div className="min-w-0">
            <h2 className="text-h-s font-display">{track.shortTitle}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="text-body-s text-muted">{emp.name}</span>
              <VerifiedBadge />
            </div>
          </div>
        </div>
        <div className="mt-3.5">
          <Facts track={track} />
        </div>
        <div className="mt-3.5 bg-mint rounded-[14px] px-4 py-3 flex items-center gap-4">
          <div className="w-[72px] shrink-0">
            <div className="font-display font-bold text-[22px] leading-[26px] text-green">{track.match.total}%</div>
            <div className="text-caption text-ink">{t('match.fit')}</div>
          </div>
          <MatchBars match={track.match} />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-caption text-muted">
            <Users size={15} aria-hidden /> {t('pilotSlots', { n: track.slots })}
          </span>
          {applied && <StatusPill tone="mint">{t('matches.applied')}</StatusPill>}
        </div>
      </Link>
    </li>
  );
}

/* ---------------- S05 / D03 Matches ---------------- */

export function Matches() {
  const desktop = useIsDesktop();
  return desktop ? <MatchesDesktop /> : <MatchesMobile />;
}

function Greeting() {
  const t = useT();
  const p = usePaolo();
  const n = useLiveTracks('all').length;
  return (
    <>
      <h1 className="text-h-l lg:text-display">{t('matches.greeting', { name: p.firstName })}</h1>
      <p className="mt-2 text-body-s lg:text-body text-muted">{t('matches.sub', { n })}</p>
    </>
  );
}

function MatchesMobile() {
  const t = useT();
  const [filter, setFilter] = useState<Filter>('all');
  const tracks = useLiveTracks(filter);
  return (
    <>
      <AppHeader />
      <div className="px-5 pt-3 pb-6">
        <Greeting />
        <div className="mt-4">
          <Filters value={filter} onChange={setFilter} />
        </div>
        <ul className="mt-4 space-y-3.5">
          {tracks.map((tr) => (
            <TrackCard key={tr.id} track={tr} />
          ))}
        </ul>
        {tracks.length === 0 && <p className="mt-8 text-center text-body text-muted">{t('matches.noResults')}</p>}
      </div>
    </>
  );
}

function ListItem({ track, selected }: { track: Track; selected: boolean }) {
  const t = useT();
  const emp = useEmployer(track.employerId)!;
  const applied = useApplied(track.id);
  return (
    <li>
      <Link
        to={`/tracks/${track.id}`}
        aria-current={selected ? 'true' : undefined}
        className={cx('block rounded-card p-5 border-[1.5px] border-ink transition-all duration-150 focus-ring', selected ? 'bg-mint shadow-brut-lime' : 'bg-cream shadow-brut-sm hover:shadow-brut hover:-translate-y-0.5')}
      >
        <div className="flex gap-3.5">
          <CompanyTile initials={emp.initials} color={emp.tile} size={40} />
          <div className="min-w-0 flex-1">
            <div className="text-h-s font-display">{track.shortTitle}</div>
            <div className="text-body-s text-muted">{emp.name}</div>
          </div>
          <div className="text-right">
            <div className="font-display font-bold text-[22px] leading-[24px] text-green">{track.match.total}%</div>
            <div className="text-caption text-muted">{t('match.short')}</div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <Facts track={track} compact />
          {applied && <StatusPill tone="mint">{t('matches.applied')}</StatusPill>}
        </div>
      </Link>
    </li>
  );
}

function MatchesDesktop({ selectedId, applying }: { selectedId?: string; applying?: boolean }) {
  const t = useT();
  const [filter, setFilter] = useState<Filter>('all');
  const tracks = useLiveTracks(filter);
  const all = useLiveTracks('all');
  const sel = all.find((x) => x.id === selectedId) ?? tracks[0] ?? all[0];
  return (
    <>
      <div className="flex items-end justify-between gap-6">
        <div>
          <Greeting />
        </div>
        <Filters value={filter} onChange={setFilter} />
      </div>
      <div className="mt-6 grid grid-cols-[400px_1fr] xl:grid-cols-[430px_1fr] gap-6 items-start">
        <ul className="space-y-3.5">
          {tracks.map((tr) => (
            <ListItem key={tr.id} track={tr} selected={tr.id === sel?.id} />
          ))}
          {tracks.length === 0 && <li className="text-body text-muted">{t('matches.noResults')}</li>}
        </ul>
        {sel && <DetailPanel track={sel} />}
      </div>
      {applying && sel && <ApplyDialog track={sel} desktop />}
    </>
  );
}

/* ---------------- Track terms (shared S06 / D03) ---------------- */

function FactTile({ icon: Icon, label, value }: { icon: typeof Calendar; label: string; value: string }) {
  return (
    <div className="bg-white border border-line rounded-[16px] px-3.5 py-3 flex items-center gap-3 lg:bg-paper lg:border-0">
      <Icon size={20} className="text-green shrink-0" aria-hidden />
      <div className="min-w-0">
        <div className="text-caption text-muted">{label}</div>
        <div className="text-label text-ink">{value}</div>
      </div>
    </div>
  );
}

function FactGrid({ track }: { track: Track }) {
  const t = useT();
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
      <FactTile icon={Calendar} label={t('track.length')} value={t('weeks', { n: track.lengthWeeks })} />
      <FactTile icon={PhilippinePeso} label={t('track.allowance')} value={track.allowancePhp ? peso(track.allowancePhp) : t('track.none')} />
      <FactTile icon={Clock} label={t('track.schedule')} value={track.scheduleLong} />
      <FactTile icon={MapPin} label={t('track.location')} value={track.location} />
    </div>
  );
}

function Commitment({ track }: { track: Track }) {
  const t = useT();
  const emp = useEmployer(track.employerId)!;
  return (
    <div className="rounded-card border border-green bg-mint p-4">
      <div className="flex items-center gap-2 text-h-s font-display text-green">
        <ShieldCheck size={20} aria-hidden /> {t('track.commitment')}
      </div>
      <p className="mt-2 text-body-s text-ink">{t('track.commitmentText', { emp: emp.name })}</p>
    </div>
  );
}

function Criteria({ track }: { track: Track }) {
  const t = useT();
  return (
    <div>
      <h2 className="text-h-s font-display">{t('track.howHired')}</h2>
      <ul className="mt-2.5 space-y-2">
        {track.criteria.map((c) => (
          <li key={c} className="flex items-center gap-2.5 text-body-s lg:text-body-s">
            <Check size={18} className="text-green shrink-0" aria-hidden />
            {t(c)}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ReadyRow({ track }: { track: Track }) {
  const t = useT();
  const show = useDemo((s) => s.showLaunch);
  if (!show) return null;
  return (
    <Link to={`/tracks/${track.id}/skill-gap`} className="flex items-center gap-3 bg-white border border-line rounded-[16px] px-4 py-3.5 hover:border-green focus-ring lg:bg-paper lg:border-0">
      <Sparkles size={20} className="text-green" aria-hidden />
      <span className="text-label text-green flex-1">{t('track.checkReady')}</span>
      <LaunchTag />
    </Link>
  );
}

function DetailPanel({ track }: { track: Track }) {
  const t = useT();
  const nav = useNavigate();
  const emp = useEmployer(track.employerId)!;
  const applied = useApplied(track.id);
  return (
    <section className="bg-cream border-[1.5px] border-ink rounded-panel shadow-brut overflow-hidden" aria-labelledby="track-title">
      <div className="bg-deep text-white px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-[10px] bg-green flex items-center justify-center text-caption font-semibold">{emp.initials}</span>
          <div>
            <div className="text-title">{emp.name}</div>
            <VerifiedBadge dark className="mt-1" />
          </div>
        </div>
        <h2 id="track-title" className="mt-3 font-display font-bold text-h-l">
          {track.title}
        </h2>
      </div>
      <div className="p-6 space-y-4">
        <FactGrid track={track} />
        <div className="grid grid-cols-2 gap-5 items-start">
          <Commitment track={track} />
          <Criteria track={track} />
        </div>
        <ReadyRow track={track} />
        <div className="flex gap-3 pt-1">
          {applied ? (
            <Button to="/my-track">{t('track.viewMyTrack')}</Button>
          ) : (
            <Button onClick={() => nav(`/tracks/${track.id}/apply`)}>{t('track.apply')}</Button>
          )}
          <Button variant="secondary" size="lg" icon={Flag} className="!text-red" onClick={() => nav(`/report?track=${track.id}`)}>
            {t('track.report')}
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ---------------- S06 / S07 (mobile) and D03 / D04 (desktop) ---------------- */

export function TrackDetail({ applying }: { applying?: boolean }) {
  const { trackId } = useParams();
  const desktop = useIsDesktop();
  const track = useTrack(trackId);
  if (!track) return <p className="p-8 text-body">Track not found.</p>;
  if (desktop) return <MatchesDesktop selectedId={track.id} applying={applying} />;
  return <TrackDetailMobile track={track} applying={applying} />;
}

function TrackDetailMobile({ track, applying }: { track: Track; applying?: boolean }) {
  const t = useT();
  const nav = useNavigate();
  const emp = useEmployer(track.employerId)!;
  const applied = useApplied(track.id);
  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-deep text-white pb-5">
        <TopBar title={t('track.details')} back="/matches" dark />
        <div className="px-5">
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-[12px] bg-green flex items-center justify-center text-label">{emp.initials}</span>
            <div>
              <div className="text-title">{emp.name}</div>
              <VerifiedBadge dark className="mt-1" />
            </div>
          </div>
          <h1 className="mt-3 font-display font-bold text-h-l">{track.title}</h1>
        </div>
      </div>
      <div className="px-5 py-4 space-y-4 flex-1">
        <FactGrid track={track} />
        <Commitment track={track} />
        <Criteria track={track} />
        <ReadyRow track={track} />
      </div>
      <MobileFooter className="flex gap-3 space-y-0">
        {applied ? (
          <Button block to="/my-track" className="flex-1">
            {t('track.viewMyTrack')}
          </Button>
        ) : (
          <Button className="flex-1" onClick={() => nav(`/tracks/${track.id}/apply`)}>
            {t('track.apply')}
          </Button>
        )}
        <button type="button" onClick={() => nav(`/report?track=${track.id}`)} aria-label={t('report.title')} className="w-[54px] h-[52px] rounded-btn border border-line text-red flex items-center justify-center focus-ring shrink-0">
          <Flag size={20} />
        </button>
      </MobileFooter>
      {applying && <ApplyDialog track={track} />}
    </div>
  );
}

function ApplyDialog({ track, desktop }: { track: Track; desktop?: boolean }) {
  const t = useT();
  const nav = useNavigate();
  const emp = useEmployer(track.employerId)!;
  const apply = useDemo((s) => s.apply);
  const [ok, setOk] = useState(false);
  const close = () => nav(`/tracks/${track.id}`);
  const submit = () => {
    apply(track.id);
    nav('/my-track');
  };
  const body = (
    <>
      <div className="flex items-start gap-3">
        <h2 id="apply-title" className="flex-1 text-h-m">
          {t('apply.title', { track: track.title })}
        </h2>
        {desktop && <CloseButton onClick={close} />}
      </div>
      <div className="mt-4 bg-paper rounded-[16px] p-4">
        <div className="text-label text-muted">{t('apply.willSee', { emp: emp.name })}</div>
        <ul className="mt-3 space-y-2.5">
          {['apply.see1', 'apply.see2', 'apply.see3'].map((k) => (
            <li key={k} className="flex items-center gap-2.5 text-body-s">
              <Check size={18} className="text-green" aria-hidden /> {t(k)}
            </li>
          ))}
          <li className="flex items-center gap-2.5 text-body-s text-muted">
            <Lock size={18} aria-hidden /> {t('apply.hidden')}
          </li>
        </ul>
      </div>
      <div className="mt-4">
        <Checkbox checked={ok} onChange={setOk}>
          {t('apply.consent', { emp: emp.name })}
        </Checkbox>
      </div>
      <p className="mt-3 text-caption text-muted">{t('apply.answer')}</p>
      <div className={cx('mt-5 gap-3', desktop ? 'flex flex-row-reverse' : 'flex flex-col')}>
        <Button block={!desktop} disabled={!ok} onClick={submit}>
          {t('apply.cta')}
        </Button>
        <Button block={!desktop} variant="secondary" onClick={close}>
          {t('apply.notNow')}
        </Button>
      </div>
    </>
  );
  return desktop ? (
    <Modal onClose={close} labelledBy="apply-title" width={520}>
      {body}
    </Modal>
  ) : (
    <BottomSheet onClose={close} labelledBy="apply-title">
      {body}
    </BottomSheet>
  );
}

/* ---------------- S13 Skill-Gap Check (Launch) ---------------- */

export function SkillGap() {
  const t = useT();
  const nav = useNavigate();
  const { trackId } = useParams();
  const track = useTrack(trackId);
  const emp = useEmployer(track?.employerId);
  const p = usePaolo();
  const saveTrack = useDemo((s) => s.saveTrack);
  const applied = useApplied(trackId ?? '');
  const [toast, setToast] = useState<string | null>(null);
  if (!track || !emp) return null;
  const req = track.requiredSkills.length ? track.requiredSkills : p.skills;
  const has = (s: string) => p.skills.some((x) => x.toLowerCase() === s.toLowerCase());
  const missing = req.filter((s) => !has(s));
  const ready = req.length - missing.length;
  return (
    <div className="flex-1 flex flex-col lg:max-w-[640px] lg:mx-auto lg:w-full">
      <TopBar title={t('gap.title')} back={`/tracks/${track.id}`} tag={<LaunchTag />} />
      <div className="px-5 pb-6 space-y-4 flex-1">
        <div className="bg-cream border-[1.5px] border-ink rounded-card shadow-brut-sm p-4 flex items-center gap-4">
          <ScoreRing value={ready / req.length} size={72} />
          <div>
            <div className="text-h-s font-display">{t('gap.ready', { a: ready, b: req.length })}</div>
            <div className="text-body-s text-muted">
              {track.shortTitle}, {emp.name}
            </div>
          </div>
        </div>
        <ul className="bg-cream border-[1.5px] border-ink rounded-card shadow-brut-sm px-4 divide-y divide-line">
          {[...missing, ...req.filter(has)].map((s) => {
            const miss = missing.includes(s);
            return (
              <li key={s} className="flex items-center gap-3 py-3">
                {miss ? (
                  <span className="w-7 h-7 rounded-full bg-mango-tint text-mango flex items-center justify-center">
                    <AlertCircle size={16} aria-hidden />
                  </span>
                ) : (
                  <span className="w-7 h-7 rounded-full bg-green text-white flex items-center justify-center">
                    <Check size={15} strokeWidth={2.6} aria-hidden />
                  </span>
                )}
                <div>
                  <div className={cx('text-body', miss && 'font-semibold')}>{s}</div>
                  {miss && <div className="text-caption text-muted">{t('gap.need')}</div>}
                </div>
              </li>
            );
          })}
        </ul>
        {missing.length > 0 && (
          <div className="bg-mint rounded-card p-4">
            <div className="flex items-center gap-2 text-h-s font-display text-green">
              <Sparkles size={18} aria-hidden /> {t('gap.prepare')}
            </div>
            <ul className="mt-3 space-y-2.5">
              <li className="bg-white rounded-[14px] p-3.5 flex gap-3">
                <BookOpen size={18} className="text-green mt-0.5" aria-hidden />
                <div>
                  <div className="text-label">Excel basics: SUM, AVERAGE, VLOOKUP</div>
                  <div className="text-caption text-muted">{t('gap.video')}</div>
                </div>
              </li>
              <li className="bg-white rounded-[14px] p-3.5 flex gap-3">
                <Check size={18} className="text-green mt-0.5" aria-hidden />
                <div>
                  <div className="text-label">{emp.name.split(' ')[0]} practice sheet</div>
                  <div className="text-caption text-muted">{t('gap.sheet')}</div>
                </div>
              </li>
            </ul>
          </div>
        )}
        <p className="text-caption text-muted">{t('gap.ai')}</p>
      </div>
      <MobileFooter className="lg:static lg:border-0 lg:bg-transparent">
        {applied ? (
          <Button block to="/my-track">
            {t('track.viewMyTrack')}
          </Button>
        ) : (
          <Button block onClick={() => nav(`/tracks/${track.id}/apply`)}>
            {t('gap.applyAnyway')}
          </Button>
        )}
        <Button
          block
          variant="secondary"
          onClick={() => {
            saveTrack(track.id);
            setToast(t('gap.saved'));
            setTimeout(() => nav('/matches'), 900);
          }}
        >
          {t('gap.save')}
        </Button>
      </MobileFooter>
      <Toast message={toast} onDone={() => setToast(null)} />
    </div>
  );
}
