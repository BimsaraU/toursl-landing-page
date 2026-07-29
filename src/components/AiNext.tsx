import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

const PAPER_URL =
  'https://rathishtharusha.github.io/Search_Intent_Effect_on_Post_Crisis_Daily_Tourist_Arrival_Prediction_for_Sri_Lanka.pdf';

type Engine = {
  step: string;
  verb: string;
  tagline: string;
  title: string;
  metric: string;
  points: string[];
  /** The route optimiser is the one engine you can watch work. */
  demo?: boolean;
  paper?: boolean;
};

const ENGINES: Engine[] = [
  {
    step: '01',
    verb: 'Learns',
    tagline: 'The places you want to visit',
    title: 'Recommendation engine',
    metric: '123 activities · 400+ locations',
    points: [
      '123 activities across 400+ Sri Lankan locations.',
      'Preferences matched by TF-IDF and cosine similarity.',
      'New places profiled automatically as they are added.',
    ],
  },
  {
    step: '02',
    verb: 'Plans',
    tagline: 'The best routes to take',
    title: 'Two-stage route optimiser',
    metric: 'Clustered, then sequenced day by day',
    points: [
      'Multi-day trips clustered geographically first.',
      "Each day's stops sequenced as a travelling-salesman problem.",
      'Real road travel times, not straight-line distance.',
    ],
    demo: true,
  },
  {
    step: '03',
    verb: 'Predicts',
    tagline: 'The demand up ahead',
    title: 'Arrival forecasting model',
    metric: '27 days ahead · 8.94% error',
    points: [
      'An SVR model with an RBF kernel, at 8.94% mean absolute error.',
      "Trained on Sri Lanka's post-crisis daily arrivals, 2023 to 2025.",
      'Arrivals, exchange rates, weather and search intent as signals.',
    ],
    paper: true,
  },
  {
    step: '04',
    verb: 'Guides',
    tagline: 'Whenever you need it',
    title: 'AI travel assistant',
    metric: 'Grounded in the live itinerary, 24/7',
    points: [
      'Retrieval-augmented answers, grounded in local sources.',
      'Customs, transport and safety questions handled on the spot.',
      'Aware of the itinerary the traveller is actually on.',
    ],
  },
];

const CLAIMS = [
  {
    label: 'The system',
    figure: '4',
    figureNote: 'engines, one product',
    heading: 'Frontier methods, working today',
    body: 'Machine learning, route optimisation and a retrieval-augmented assistant run inside one product. Not a roadmap, but a system already producing itineraries and forecasts.',
  },
  {
    label: 'For travellers',
    figure: '1',
    figureNote: 'place for the whole trip',
    heading: "Technology in the tourist's hand",
    body: 'Planning, verified pricing and live guidance in one place, which removes the scam-and-guesswork layer of a Sri Lankan trip.',
  },
  {
    label: 'The research',
    figure: '8.94%',
    figureNote: 'mean absolute error',
    heading: 'Research no competitor holds',
    body: "An arrival-forecasting model built on Sri Lanka's own post-crisis data, warning of demand shifts 27 days ahead.",
    paper: true,
  },
  {
    label: 'For guides',
    figure: '27',
    figureNote: 'days of warning',
    heading: 'The same technology for locals',
    body: 'Guides publish and price their own packages, reach travellers on equal footing, and receive the demand forecast before the season turns.',
  },
];

type Stop = { name: string; legKm: number };

/** The order stops usually get added in: whatever order you thought of them. */
const AS_ADDED: Stop[] = [
  { name: 'Temple of the Tooth', legKm: 0 },
  { name: 'Royal Botanical Gardens', legKm: 6.4 },
  { name: 'Kandy Lake', legKm: 6.1 },
  { name: 'Bahirawakanda Temple', legKm: 2.8 },
  { name: 'Udawattakele Forest', legKm: 3.2 },
];

/** Same five stops, sequenced to cut backtracking. */
const OPTIMIZED: Stop[] = [
  { name: 'Temple of the Tooth', legKm: 0 },
  { name: 'Kandy Lake', legKm: 0.6 },
  { name: 'Udawattakele Forest', legKm: 1.4 },
  { name: 'Bahirawakanda Temple', legKm: 2.2 },
  { name: 'Royal Botanical Gardens', legKm: 5.9 },
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

function PaperLink({ className = '' }: { className?: string }) {
  return (
    <a
      href={PAPER_URL}
      target="_blank"
      rel="noreferrer noopener"
      className={`font-sans text-[13px] font-medium text-toursl-accent underline decoration-toursl-accent/40 decoration-1 underline-offset-4 transition-opacity hover:opacity-70 ${className}`}
    >
      Read the forecasting paper (PDF)
    </a>
  );
}

function OptimiserDemo() {
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
        el.style.transition = 'transform 700ms cubic-bezier(0.22, 1, 0.36, 1)';
        el.style.transform = 'translate3d(0, 0, 0)';
      });
    });

    lastRects.current.clear();
  }, [optimized]);

  return (
    <div className="mt-7 max-md:mt-5 border-t border-toursl-line pt-7 max-md:pt-5">
      <div className="mb-4 flex items-end justify-between gap-4">
        <p className="font-sans text-[15px] max-md:text-[13px] font-semibold text-toursl-text">
          One day in Kandy, five stops
        </p>
        <p className="font-sans text-[13px] max-md:text-[11px] text-toursl-muted">
          {optimized ? 'Sequenced' : 'As added'}
        </p>
      </div>

      <ol className="mb-5 flex flex-col gap-2 max-md:gap-1.5">
        {stops.map((stop, i) => (
          <li
            key={stop.name}
            ref={(el) => {
              if (el) rowRefs.current.set(stop.name, el);
              else rowRefs.current.delete(stop.name);
            }}
            className="flex items-center gap-3 rounded-2xl max-md:rounded-xl border border-toursl-line bg-white px-4 py-3 max-md:px-3 max-md:py-2.5 will-change-transform"
          >
            <span className="flex h-7 w-7 max-md:h-6 max-md:w-6 flex-shrink-0 items-center justify-center rounded-full bg-toursl-sand font-sans text-xs max-md:text-[10px] font-semibold text-toursl-text">
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

      <div className="mb-5 grid grid-cols-3 gap-4 max-md:gap-2">
        <Stat label="Distance" value={`${km.toFixed(1)} km`} />
        <Stat label="Driving" value={`${hours.toFixed(1)} h`} />
        <Stat
          label="Backtracking"
          value={optimized ? 'None' : 'Twice'}
          muted={!optimized}
        />
      </div>

      <div className="flex flex-col items-start gap-3 max-md:items-center">
        <button
          type="button"
          onClick={reorder}
          className="inline-flex h-12 max-md:h-11 max-md:w-full items-center justify-center rounded-full border border-toursl-dark bg-toursl-dark px-6 font-sans text-[14px] max-md:text-[12px] font-medium uppercase tracking-[0.04em] text-[#fafafa] cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#333] hover:scale-[1.03] active:scale-95"
        >
          {optimized ? 'Show my original order' : 'Run the optimiser'}
        </button>
        <span
          key={String(optimized)}
          className="animate-step-in min-h-[20px] font-sans text-sm max-md:text-xs text-toursl-muted max-md:text-center"
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
  );
}

export default function AiNext() {
  const [active, setActive] = useState(1);
  const engine = ENGINES[active];

  return (
    <section id="ai" className="w-full bg-white">
      <div className="mx-auto max-w-[1360px] px-20 py-24 max-md:px-6 max-md:py-16">
        <p className="font-display font-medium text-[32px] max-md:text-[24px] tracking-[0.02em] text-toursl-accent mb-4 max-md:mb-3">
          Where AI comes in
        </p>
        <h2 className="font-sans text-[clamp(30px,4vw,46px)] max-md:text-[26px] font-medium text-toursl-text leading-[1.1] tracking-[-0.03em] max-w-[760px] mb-4 max-md:mb-3">
          Four AI engines, one personalised journey
        </h2>
        <p className="font-sans text-lg max-md:text-[15px] text-toursl-muted leading-relaxed max-w-[640px] mb-10 max-md:mb-7">
          Machine learning, route optimisation and a retrieval-augmented
          assistant run inside the same product that holds your stops, drives
          and bookings. Pick an engine to see what it does.
        </p>

        {/* Engine selector. The numbers carry the sequence, so no icons needed. */}
        <div className="grid grid-cols-4 gap-3 max-md:grid-cols-2 max-md:gap-2.5">
          {ENGINES.map((e, i) => {
            const isOn = i === active;
            return (
              <button
                key={e.step}
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={isOn}
                className={[
                  'rounded-[20px] max-md:rounded-[16px] border p-5 max-md:p-3.5 text-left cursor-pointer',
                  'transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98]',
                  isOn
                    ? 'border-toursl-dark bg-toursl-dark text-white'
                    : 'border-toursl-line bg-white text-toursl-text hover:border-toursl-accent/50 hover:-translate-y-1',
                ].join(' ')}
              >
                <span
                  className={[
                    'block font-display text-[22px] max-md:text-[18px] leading-none mb-3 max-md:mb-2 transition-colors duration-500',
                    isOn ? 'text-white/70' : 'text-toursl-accent',
                  ].join(' ')}
                >
                  {e.step}
                </span>
                <span className="block font-sans text-xl max-md:text-[16px] font-medium tracking-[-0.02em]">
                  {e.verb}
                </span>
                <span
                  className={[
                    'block font-sans text-sm max-md:text-[12px] leading-snug mt-1',
                    isOn ? 'text-white/65' : 'text-toursl-muted',
                  ].join(' ')}
                >
                  {e.tagline}
                </span>
              </button>
            );
          })}
        </div>

        {/* Detail for the selected engine */}
        <div
          key={engine.step}
          className="animate-panel-in mt-6 max-md:mt-4 rounded-[28px] max-md:rounded-[20px] border border-toursl-line bg-toursl-sand p-8 max-md:p-4"
        >
          <div className="flex items-start justify-between gap-6 max-md:flex-col max-md:gap-2">
            <div>
              <p className="font-sans text-2xl max-md:text-[19px] font-medium tracking-[-0.02em] text-toursl-text">
                {engine.title}
              </p>
              <p className="mt-1 font-sans text-[15px] max-md:text-[13px] text-toursl-muted">
                {engine.metric}
              </p>
            </div>
            <span className="flex-shrink-0 border-b border-toursl-accent/40 pb-1 font-display text-[13px] max-md:text-[11px] leading-none text-toursl-accent">
              Engine {engine.step}
            </span>
          </div>

          <ul className="mt-6 max-md:mt-4 flex flex-col gap-3 max-md:gap-2">
            {engine.points.map((point, i) => (
              <li
                key={point}
                className="animate-step-in flex gap-3 font-sans text-[15px] max-md:text-[13px] text-toursl-text/80 leading-relaxed"
                style={{ animationDelay: `${120 + i * 70}ms` }}
              >
                <span
                  aria-hidden
                  className="mt-[9px] h-[5px] w-[5px] flex-shrink-0 rounded-full bg-toursl-accent"
                />
                {point}
              </li>
            ))}
          </ul>

          {engine.paper && <PaperLink className="mt-5 inline-block" />}
          {engine.demo && <OptimiserDemo />}
        </div>

        {/* What it adds up to. All four cards share one treatment so they read
            as a set of equal claims. */}
        <div className="mt-20 max-md:mt-14 border-t border-toursl-line pt-14 max-md:pt-10">
          <h3 className="font-sans text-[clamp(30px,4vw,46px)] max-md:text-[26px] font-medium text-toursl-text leading-[1.1] tracking-[-0.03em] max-w-[820px] mb-10 max-md:mb-6">
            Innovation that carries both sides of the trip
          </h3>

          <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1 max-md:gap-3">
            {CLAIMS.map((claim) => (
              <div
                key={claim.heading}
                className="group relative overflow-hidden rounded-[24px] max-md:rounded-[18px] border border-toursl-line bg-toursl-sand p-8 max-md:p-5 text-toursl-text transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-toursl-accent/50"
              >
                {/* Accent rule that draws in on hover */}
                <span
                  aria-hidden
                  className="absolute left-0 top-0 h-full w-[3px] origin-top scale-y-0 bg-toursl-accent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100"
                />

                <div className="mb-5 max-md:mb-4 flex items-end justify-between gap-4 border-b border-toursl-line pb-4">
                  <span className="flex items-baseline gap-2">
                    <span className="font-display text-[34px] max-md:text-[26px] leading-none text-toursl-accent">
                      {claim.figure}
                    </span>
                    <span className="font-sans text-[13px] max-md:text-[11px] text-toursl-muted">
                      {claim.figureNote}
                    </span>
                  </span>
                  <span className="flex-shrink-0 font-sans text-[11px] max-md:text-[10px] font-medium uppercase tracking-[0.1em] text-toursl-muted">
                    {claim.label}
                  </span>
                </div>

                <p className="font-sans text-xl max-md:text-[17px] font-medium tracking-[-0.02em] mb-2">
                  {claim.heading}
                </p>
                <p className="font-sans text-[15px] max-md:text-[13px] text-toursl-muted leading-relaxed">
                  {claim.body}
                </p>
                {claim.paper && <PaperLink className="mt-4 inline-block" />}
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
