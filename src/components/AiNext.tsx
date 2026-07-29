import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Brain, Route as RouteIcon, Sparkles, TriangleAlert } from 'lucide-react';

type Stop = { name: string; legKm: number };

/** The order stops usually get added in: whatever order you thought of them. */
const AS_ADDED: Stop[] = [
  { name: 'Temple of the Tooth', legKm: 0 },
  { name: 'Royal Botanical Gardens', legKm: 6.4 },
  { name: 'Kandy Lake', legKm: 6.1 },
  { name: 'Bahirawakanda Temple', legKm: 2.8 },
  { name: 'Udawattakele Forest', legKm: 3.2 },
];

/** Same five stops, ordered to cut backtracking. */
const OPTIMIZED: Stop[] = [
  { name: 'Temple of the Tooth', legKm: 0 },
  { name: 'Kandy Lake', legKm: 0.6 },
  { name: 'Udawattakele Forest', legKm: 1.4 },
  { name: 'Bahirawakanda Temple', legKm: 2.2 },
  { name: 'Royal Botanical Gardens', legKm: 5.9 },
];

const PILLARS = [
  {
    icon: RouteIcon,
    title: 'Day optimizer',
    body: 'The route engine grows from A-to-B directions into a trip optimizer: order the stops within a day, then cluster a whole trip into days so each one is actually drivable.',
    tag: 'Planned',
  },
  {
    icon: Brain,
    title: 'Recommendations that learn you',
    body: 'Today discovery is cached Google Places search. Next it weighs your saved stops, past trips and stated interests, so a diver and a temple-hopper get different shortlists for the same town.',
    tag: 'Planned',
  },
  {
    icon: TriangleAlert,
    title: 'Feasibility checks',
    body: 'Real route data already knows a day is too long before you drive it. The planner will flag over-packed days, impossible transfers and opening hours you would miss.',
    tag: 'Planned',
  },
];

// City driving, roughly 22 km/h door to door once you include parking.
const CITY_SPEED = 22;

function totals(stops: Stop[]) {
  const km = stops.reduce((sum, s) => sum + s.legKm, 0);
  return { km: Math.round(km * 10) / 10, hours: km / CITY_SPEED };
}

/** Eases a number toward its target instead of snapping to it. */
function useTween(target: number, duration = 700) {
  const [value, setValue] = useState(target);
  const currentRef = useRef(target);
  const rafRef = useRef(0);

  useEffect(() => {
    const from = currentRef.current;
    if (from === target) return;

    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = from + (target - from) * eased;
      currentRef.current = next;
      setValue(next);
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
}

export default function AiNext() {
  const [optimized, setOptimized] = useState(false);
  const stops = optimized ? OPTIMIZED : AS_ADDED;
  const sums = useMemo(() => totals(stops), [stops]);
  const saved = useMemo(() => {
    const before = totals(AS_ADDED).km;
    const after = totals(OPTIMIZED).km;
    return Math.round(((before - after) / before) * 100);
  }, []);

  const km = useTween(sums.km);
  const hours = useTween(sums.hours);

  const rowRefs = useRef(new Map<string, HTMLLIElement>());
  const lastRects = useRef(new Map<string, DOMRect>());

  function reorder() {
    // FLIP: measure where each row is before React moves it.
    lastRects.current = new Map();
    rowRefs.current.forEach((el, key) =>
      lastRects.current.set(key, el.getBoundingClientRect())
    );
    setOptimized((v) => !v);
  }

  // ...then send each row back to its old spot and let it glide to the new one.
  useLayoutEffect(() => {
    if (lastRects.current.size === 0) return;

    rowRefs.current.forEach((el, key) => {
      const before = lastRects.current.get(key);
      if (!before) return;
      const dy = before.top - el.getBoundingClientRect().top;
      if (Math.abs(dy) < 1) return;

      el.style.transition = 'none';
      el.style.transform = `translate3d(0, ${dy}px, 0)`;

      requestAnimationFrame(() => {
        el.style.transition =
          'transform 700ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 700ms ease';
        el.style.transform = 'translate3d(0, 0, 0)';
      });
    });

    lastRects.current.clear();
  }, [optimized]);

  return (
    <section id="ai" className="w-full border-t border-toursl-line bg-white">
      <div className="mx-auto max-w-[1360px] px-20 py-24 max-md:px-6 max-md:py-16">
        <p className="font-display font-medium text-[32px] max-md:text-[24px] tracking-[0.02em] text-toursl-accent mb-4 max-md:mb-3">
          What comes next
        </p>
        <h2 className="font-sans text-[clamp(30px,4vw,46px)] max-md:text-[26px] font-medium text-toursl-text leading-[1.1] tracking-[-0.03em] max-w-[760px] mb-4 max-md:mb-3">
          The planner knows your route. Next it starts having opinions about it.
        </h2>
        <p className="font-sans text-lg max-md:text-[15px] text-toursl-muted leading-relaxed max-w-[620px] mb-12 max-md:mb-8">
          TourSL already holds every stop, drive and opening time in one place.
          That is the hard part. On top of it we are building the layer that
          reorders, prunes and personalises the plan for you.
        </p>

        <div className="grid grid-cols-[1.05fr_1fr] items-center gap-16 max-md:grid-cols-1 max-md:gap-8">
          {/* Optimizer demo */}
          <div className="rounded-[28px] max-md:rounded-[20px] border border-toursl-line bg-toursl-sand p-8 max-md:p-4">
            <div className="mb-6 max-md:mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="font-sans text-base max-md:text-sm font-semibold text-toursl-text">
                  One day in Kandy, five stops
                </p>
                <p className="font-sans text-sm max-md:text-xs text-toursl-muted">
                  {optimized ? 'Optimized order' : 'Order you added them in'}
                </p>
              </div>
              <span className="flex flex-shrink-0 items-center gap-1.5 border-b border-toursl-accent/40 pb-1 font-display text-[13px] max-md:text-[11px] leading-none text-toursl-accent">
                <Sparkles className="h-3.5 w-3.5" />
                Sample
              </span>
            </div>

            <ol className="mb-6 max-md:mb-4 flex flex-col gap-2 max-md:gap-1.5">
              {stops.map((stop, i) => (
                <li
                  key={stop.name}
                  ref={(el) => {
                    if (el) rowRefs.current.set(stop.name, el);
                    else rowRefs.current.delete(stop.name);
                  }}
                  className="flex items-center gap-3 rounded-2xl max-md:rounded-xl border border-toursl-line bg-white px-4 py-3 max-md:px-3 max-md:py-2.5 will-change-transform"
                >
                  <span className="flex h-7 w-7 max-md:h-6 max-md:w-6 flex-shrink-0 items-center justify-center rounded-full bg-toursl-sand font-sans text-xs max-md:text-[10px] font-semibold text-toursl-text transition-colors duration-500">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-sans text-[15px] max-md:text-[13px] font-medium text-toursl-text">
                    {stop.name}
                  </span>
                  <span className="flex-shrink-0 font-sans text-[13px] max-md:text-[11px] tabular-nums text-toursl-muted">
                    {i === 0 ? 'start' : `+${stop.legKm} km`}
                  </span>
                </li>
              ))}
            </ol>

            <div className="mb-6 max-md:mb-4 grid grid-cols-3 gap-4 max-md:gap-2 border-t border-toursl-line pt-5 max-md:pt-4">
              <Stat label="Distance" value={`${km.toFixed(1)} km`} />
              <Stat label="Driving" value={`${hours.toFixed(1)} h`} />
              <Stat
                label="Backtracking"
                value={optimized ? 'None' : 'Twice'}
                muted={!optimized}
              />
            </div>

            {/* Caption stays on its own line so it never reflows beside the
                button when the label length changes. */}
            <div className="flex flex-col items-start gap-3">
              <button
                type="button"
                onClick={reorder}
                className="inline-flex h-12 max-md:h-11 max-md:w-full items-center justify-center gap-2 rounded-full border border-toursl-dark bg-toursl-dark px-6 font-sans text-[14px] max-md:text-[12px] font-medium uppercase tracking-[0.04em] text-[#fafafa] cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#333] hover:scale-[1.03] active:scale-95"
              >
                <Sparkles className="h-[18px] w-[18px] flex-shrink-0" />
                {optimized ? 'Show my original order' : 'Optimize this day'}
              </button>
              <span
                key={String(optimized)}
                className="animate-step-in font-sans text-sm max-md:text-xs text-toursl-muted min-h-[20px]"
              >
                {optimized ? (
                  <>
                    <span className="font-semibold text-toursl-accent">
                      {saved}% less driving
                    </span>
                    , same five stops.
                  </>
                ) : (
                  'Same stops, worse order. Watch the distance drop.'
                )}
              </span>
            </div>
          </div>

          {/* Roadmap pillars */}
          <div className="flex flex-col gap-4 max-md:gap-3">
            {PILLARS.map(({ icon: Icon, title, body, tag }) => (
              <div
                key={title}
                className="rounded-[24px] max-md:rounded-[18px] border border-toursl-line p-6 max-md:p-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1"
              >
                <div className="mb-3 max-md:mb-2 flex items-center justify-between gap-3">
                  <span className="flex items-center gap-3 max-md:gap-2">
                    <span className="flex h-10 w-10 max-md:h-8 max-md:w-8 flex-shrink-0 items-center justify-center rounded-full bg-toursl-sand">
                      <Icon className="h-[18px] w-[18px] max-md:h-4 max-md:w-4 text-toursl-accent" />
                    </span>
                    <span className="font-sans text-lg max-md:text-[15px] font-medium tracking-[-0.02em] text-toursl-text">
                      {title}
                    </span>
                  </span>
                  <span className="flex-shrink-0 font-display text-[12px] max-md:text-[10px] leading-none text-toursl-muted">
                    {tag}
                  </span>
                </div>
                <p className="font-sans text-[15px] max-md:text-[13px] text-toursl-muted leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div>
      <p className="font-sans text-xs max-md:text-[9px] font-medium uppercase tracking-[0.08em] text-toursl-muted mb-1 max-md:mb-0">
        {label}
      </p>
      <p
        className={[
          'font-sans text-[22px] max-md:text-[15px] font-medium tracking-[-0.03em] tabular-nums transition-colors duration-500',
          muted ? 'text-toursl-muted' : 'text-toursl-text',
        ].join(' ')}
      >
        {value}
      </p>
    </div>
  );
}
