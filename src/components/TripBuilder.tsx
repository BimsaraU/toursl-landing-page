import { useMemo, useState } from 'react';
import { Car, Check, Clock, Plus, RotateCcw, Sparkles } from 'lucide-react';
import RouteConnector from '@/components/RouteConnector';

type Destination = {
  id: string;
  name: string;
  region: string;
  blurb: string;
  days: number;
  /** Rough driving distance from the previously selected stop, in km. */
  legKm: number;
  /** One suggested activity per day, used by the generated plan. */
  plan: string[];
};

const DESTINATIONS: Destination[] = [
  {
    id: 'colombo',
    name: 'Colombo',
    region: 'West coast',
    blurb: 'Street food, markets, the Galle Face sunset',
    days: 1,
    legKm: 0,
    plan: ['Pettah markets, Gangaramaya, sunset on Galle Face Green'],
  },
  {
    id: 'sigiriya',
    name: 'Sigiriya',
    region: 'Cultural triangle',
    blurb: 'Lion Rock at dawn, before the heat',
    days: 2,
    legKm: 168,
    plan: [
      'Lion Rock climb at 6am, museum, afternoon rest',
      'Pidurangala sunrise, Dambulla cave temples',
    ],
  },
  {
    id: 'kandy',
    name: 'Kandy',
    region: 'Hill country',
    blurb: 'Temple of the Tooth, lakeside evenings',
    days: 1,
    legKm: 92,
    plan: ['Temple of the Tooth, Royal Botanical Gardens, lake loop at dusk'],
  },
  {
    id: 'ella',
    name: 'Ella',
    region: 'Hill country',
    blurb: 'Nine Arch Bridge, tea slopes, slow trains',
    days: 2,
    legKm: 140,
    plan: [
      'Kandy to Ella observation-car train, Nine Arch Bridge at sunset',
      'Little Adam’s Peak at sunrise, tea factory tour, Ravana Falls',
    ],
  },
  {
    id: 'yala',
    name: 'Yala',
    region: 'South east',
    blurb: 'Leopard tracking on a morning safari',
    days: 1,
    legKm: 110,
    plan: ['5:30am block 1 safari, late lunch, evening at the tank'],
  },
  {
    id: 'mirissa',
    name: 'Mirissa',
    region: 'South coast',
    blurb: 'Whales offshore, hammocks onshore',
    days: 2,
    legKm: 128,
    plan: [
      'Blue whale boat at dawn, Coconut Tree Hill in the afternoon',
      'Secret Beach morning, Weligama surf lesson, seafood at Parrot Rock',
    ],
  },
  {
    id: 'galle',
    name: 'Galle',
    region: 'South coast',
    blurb: 'Fort walls, ramparts, colonial lanes',
    days: 1,
    legKm: 42,
    plan: ['Fort ramparts walk, Dutch Hospital lanes, lighthouse at golden hour'],
  },
  {
    id: 'arugam',
    name: 'Arugam Bay',
    region: 'East coast',
    blurb: 'Point break surf and beach shacks',
    days: 2,
    legKm: 196,
    plan: [
      'Main Point surf at first light, lagoon safari after lunch',
      'Whiskey Point session, Elephant Rock walk at sunset',
    ],
  },
];

export default function TripBuilder() {
  const [selected, setSelected] = useState<string[]>(['colombo', 'sigiriya']);
  const [showPlan, setShowPlan] = useState(false);

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
    setShowPlan(false);
  }

  const route = useMemo(
    () =>
      selected
        .map((id) => DESTINATIONS.find((d) => d.id === id))
        .filter((d): d is Destination => Boolean(d)),
    [selected]
  );

  const totals = useMemo(() => {
    const days = route.reduce((sum, d) => sum + d.days, 0);
    const km = route.reduce((sum, d, i) => (i === 0 ? sum : sum + d.legKm), 0);
    // Rough island average of ~38 km/h once you account for the roads.
    const hours = km / 38;
    return { days, km, hours };
  }, [route]);

  // Flattens the picked stops into a numbered day-by-day plan, with the drive
  // that gets you to each new place attached to its first day.
  const plan = useMemo(() => {
    let day = 0;
    return route.flatMap((stop, stopIndex) =>
      stop.plan.slice(0, stop.days).map((activity, dayIndex) => {
        day += 1;
        return {
          key: `${stop.id}-${dayIndex}`,
          day,
          place: stop.name,
          activity,
          arrivalFrom:
            dayIndex === 0 && stopIndex > 0
              ? {
                  from: route[stopIndex - 1].name,
                  km: stop.legKm,
                  hours: stop.legKm / 38,
                }
              : null,
        };
      })
    );
  }, [route]);

  return (
    <section id="try-it" className="w-full bg-toursl-sand">
      <div className="mx-auto max-w-[1360px] px-20 py-24 max-md:px-6 max-md:py-16">
        <p className="font-display font-medium text-[32px] max-md:text-[24px] tracking-[0.02em] text-toursl-accent mb-4 max-md:mb-3">
          Try it right here
        </p>
        <h2 className="font-sans text-[clamp(30px,4vw,46px)] max-md:text-[26px] font-medium text-toursl-text leading-[1.1] tracking-[-0.03em] max-w-[720px] mb-4 max-md:mb-3">
          Tap a few places. Watch the trip build itself.
        </h2>
        <p className="font-sans text-lg max-md:text-[15px] text-toursl-muted leading-relaxed max-w-[600px] mb-12 max-md:mb-6">
          This is the planner in miniature: pick your stops, and the days,
          distance and driving time add up as you go.
        </p>

        {/* Live route summary. On phones it sticks under the nav so the running
            totals stay in view while you tap through the grid below. */}
        <div className="rounded-[28px] max-md:rounded-[20px] border border-toursl-line bg-white p-7 max-md:p-4 mb-8 max-md:mb-5 shadow-[0_18px_60px_-40px_rgba(0,0,0,0.45)] max-md:sticky max-md:top-3 max-md:z-10">
          <div className="flex items-start justify-between gap-6 mb-6 max-md:mb-3 max-md:items-center max-md:gap-2">
            {/* Phones scroll the chips sideways on one line. Wrapping made this
                card grow taller with every stop and swallow the screen. */}
            <div className="no-scrollbar flex flex-wrap items-center gap-x-2 gap-y-2 min-h-[40px] max-md:h-8 max-md:min-h-0 max-md:flex-nowrap max-md:gap-y-0 max-md:overflow-x-auto">
              {route.length === 0 && (
                <span className="font-sans text-[15px] max-md:text-[13px] max-md:whitespace-nowrap text-toursl-muted">
                  No stops yet. Pick one below.
                </span>
              )}
              {route.map((d, i) => (
                <span
                  key={d.id}
                  className="flex flex-shrink-0 items-center gap-2 max-md:gap-1"
                >
                  {i > 0 && <RouteConnector className="flex-shrink-0" />}
                  <button
                    type="button"
                    onClick={() => toggle(d.id)}
                    title={`Remove ${d.name}`}
                    className="whitespace-nowrap rounded-full bg-toursl-dark px-4 py-2 max-md:px-3 max-md:py-1.5 font-sans text-sm max-md:text-xs font-medium text-white transition-all duration-300 hover:bg-toursl-accent active:scale-95"
                  >
                    {d.name}
                  </button>
                </span>
              ))}
            </div>

            {route.length > 0 && (
              <button
                type="button"
                onClick={() => setSelected([])}
                aria-label="Reset route"
                className="flex flex-shrink-0 items-center gap-2 rounded-full border border-toursl-line bg-transparent px-4 py-2 max-md:h-8 max-md:w-8 max-md:justify-center max-md:p-0 font-sans text-sm font-medium text-toursl-muted transition-colors hover:text-toursl-text active:scale-95"
              >
                <RotateCcw className="h-4 w-4 flex-shrink-0" />
                <span className="max-md:hidden">Reset</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-4 gap-4 border-t border-toursl-line pt-6 max-md:gap-2 max-md:pt-3">
            <Stat label="Stops" value={String(route.length)} />
            <Stat label="Days" value={String(totals.days)} />
            <Stat label="Distance" value={`${totals.km} km`} />
            <Stat
              label="Driving"
              value={totals.hours ? `${totals.hours.toFixed(1)} h` : '0 h'}
            />
          </div>
        </div>

        {/* Destination picker */}
        {/* Two compact columns on phones: the blurb is dropped and the card
            shrinks to name, region and length, so all eight fit on one screen */}
        <div className="grid grid-cols-4 gap-4 max-md:grid-cols-2 max-md:gap-2.5">
          {DESTINATIONS.map((d) => {
            const isOn = selected.includes(d.id);
            const order = selected.indexOf(d.id) + 1;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => toggle(d.id)}
                aria-pressed={isOn}
                className={[
                  'group relative overflow-hidden rounded-[24px] max-md:rounded-[18px] border p-6 max-md:p-3.5 text-left cursor-pointer',
                  'transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 active:scale-[0.98]',
                  isOn
                    ? 'border-toursl-dark bg-toursl-dark text-white'
                    : 'border-toursl-line bg-white text-toursl-text hover:border-toursl-accent/50',
                ].join(' ')}
              >
                <span
                  className={[
                    'absolute right-5 top-5 max-md:right-3 max-md:top-3 flex h-7 w-7 max-md:h-6 max-md:w-6 items-center justify-center rounded-full transition-all duration-500',
                    isOn
                      ? 'bg-white text-toursl-dark'
                      : 'bg-toursl-sand text-toursl-muted group-hover:bg-toursl-accent group-hover:text-white',
                  ].join(' ')}
                >
                  {isOn ? (
                    <span className="font-sans text-xs font-semibold">
                      {order}
                    </span>
                  ) : (
                    <Plus className="h-4 w-4 max-md:h-3.5 max-md:w-3.5" />
                  )}
                </span>

                <p
                  className={[
                    'font-sans text-xs max-md:text-[10px] font-medium uppercase tracking-[0.08em] mb-2 max-md:mb-1 max-md:pr-7',
                    isOn ? 'text-white/55' : 'text-toursl-muted',
                  ].join(' ')}
                >
                  {d.region}
                </p>
                <p className="font-sans text-xl max-md:text-[15px] font-medium tracking-[-0.02em] mb-2 max-md:mb-0 max-md:leading-snug">
                  {d.name}
                </p>
                <p
                  className={[
                    'font-sans text-sm leading-relaxed max-md:hidden',
                    isOn ? 'text-white/70' : 'text-toursl-muted',
                  ].join(' ')}
                >
                  {d.blurb}
                </p>
                <p
                  className={[
                    'mt-4 max-md:mt-1.5 font-sans text-sm max-md:text-xs font-medium',
                    isOn ? 'text-white' : 'text-toursl-accent',
                  ].join(' ')}
                >
                  {d.days} {d.days === 1 ? 'day' : 'days'}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-10 max-md:mt-6 flex flex-wrap items-center gap-4 max-md:gap-3">
          <button
            type="button"
            onClick={() => setShowPlan((v) => !v)}
            disabled={route.length === 0}
            className="flex items-center justify-center gap-2 max-md:w-full bg-toursl-dark text-[#fafafa] border-none cursor-pointer font-sans text-[15px] max-md:text-[13px] font-medium uppercase tracking-[0.04em] px-7 py-4 max-md:px-5 max-md:py-3.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#333] hover:scale-[1.03] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
          >
            <Check className="h-[18px] w-[18px] flex-shrink-0" />
            {showPlan ? 'Hide the plan' : 'Generate the day-by-day plan'}
          </button>
          <span className="font-sans text-sm max-md:text-xs text-toursl-muted">
            Distances are estimates. The real planner uses live route data.
          </span>
        </div>

        {/* Next stage: the route turned into an actual schedule */}
        {showPlan && route.length > 0 && (
          <div className="mt-8 max-md:mt-5 rounded-[28px] max-md:rounded-[20px] border border-toursl-line bg-white p-8 max-md:p-4 shadow-[0_18px_60px_-40px_rgba(0,0,0,0.45)]">
            <div className="mb-7 max-md:mb-5 flex items-start justify-between gap-6 border-b border-toursl-line pb-6 max-md:pb-4 max-md:gap-3">
              <div>
                <p className="font-display text-[26px] max-md:text-[18px] leading-none text-toursl-text mb-2">
                  {route[0].name}
                  {route.length > 1 && ` to ${route[route.length - 1].name}`}
                </p>
                <p className="font-sans text-[15px] max-md:text-[13px] text-toursl-muted">
                  {totals.days} {totals.days === 1 ? 'day' : 'days'} ·{' '}
                  {route.length} {route.length === 1 ? 'stop' : 'stops'} ·{' '}
                  {totals.km} km
                </p>
              </div>
              <span className="flex flex-shrink-0 items-center gap-2 border-b border-toursl-accent/40 pb-1 font-display text-[14px] max-md:text-[12px] leading-none text-toursl-accent">
                <Sparkles className="h-4 w-4 max-md:h-3.5 max-md:w-3.5" />
                Draft plan
              </span>
            </div>

            <ol className="flex flex-col">
              {plan.map((entry) => (
                <li key={entry.key} className="flex gap-6 max-md:gap-3">
                  <div className="flex flex-col items-center">
                    <span className="font-display text-[22px] max-md:text-[17px] leading-none text-toursl-accent pt-1">
                      {entry.day}
                    </span>
                    <span className="mt-2 w-px flex-1 bg-toursl-line" />
                  </div>

                  <div className="flex-1 pb-7 max-md:pb-5">
                    {entry.arrivalFrom && (
                      <p className="mb-2 max-md:mb-1 flex flex-wrap items-center gap-x-2 gap-y-1 font-sans text-[13px] max-md:text-[11px] text-toursl-muted">
                        <span className="flex items-center">
                          {entry.arrivalFrom.from}
                          <RouteConnector className="mx-1.5" />
                          {entry.place}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Car className="h-3.5 w-3.5" />
                          {entry.arrivalFrom.km} km
                          <Clock className="ml-1 h-3.5 w-3.5" />
                          {entry.arrivalFrom.hours.toFixed(1)} h
                        </span>
                      </p>
                    )}
                    <p className="font-sans text-lg max-md:text-[15px] font-medium text-toursl-text tracking-[-0.02em]">
                      {entry.place}
                    </p>
                    <p className="font-sans text-[15px] max-md:text-[13px] text-toursl-muted leading-relaxed">
                      {entry.activity}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="flex flex-wrap items-center gap-4 max-md:gap-2.5 border-t border-toursl-line pt-6 max-md:pt-4">
              <button
                type="button"
                className="inline-flex h-12 max-md:h-11 max-md:flex-1 items-center justify-center gap-2 rounded-full border border-toursl-dark bg-toursl-dark px-6 max-md:px-4 font-sans text-[14px] max-md:text-[12px] font-medium uppercase tracking-[0.04em] text-[#fafafa] cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#333] hover:scale-[1.03] active:scale-95"
              >
                Save this plan
              </button>
              <button
                type="button"
                className="inline-flex h-12 max-md:h-11 max-md:flex-1 items-center justify-center gap-2 rounded-full border border-toursl-text/25 bg-transparent px-6 max-md:px-4 font-sans text-[14px] max-md:text-[12px] font-medium uppercase tracking-[0.04em] text-toursl-text cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-toursl-sand hover:scale-[1.03] active:scale-95"
              >
                Find guides for it
              </button>
              <span className="font-sans text-sm max-md:text-xs text-toursl-muted">
                Sample output. The planner fills these days from real place data.
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-sans text-xs max-md:text-[9px] font-medium uppercase tracking-[0.08em] text-toursl-muted mb-1 max-md:mb-0">
        {label}
      </p>
      <p className="font-sans text-[28px] max-md:text-[17px] font-medium tracking-[-0.03em] text-toursl-text tabular-nums">
        {value}
      </p>
    </div>
  );
}
