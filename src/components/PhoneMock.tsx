import {
  BadgeCheck,
  Car,
  Clock,
  MapPin,
  MoveRight,
  Plus,
  Search,
  Star,
} from 'lucide-react';
import RouteConnector from '@/components/RouteConnector';

/** Rows animate in one after another; index sets the stagger. */
function Row({
  children,
  index,
  className = '',
}: {
  children: React.ReactNode;
  index: number;
  className?: string;
}) {
  return (
    <div
      className={`animate-step-in ${className}`}
      style={{ animationDelay: `${index * 90}ms` }}
    >
      {children}
    </div>
  );
}

function DiscoverScreen() {
  const results = [
    { name: 'Unawatuna Beach', meta: 'Beach · 12 min away', rating: '4.6' },
    { name: 'Jungle Beach', meta: 'Cove · 21 min away', rating: '4.8' },
    { name: 'Dalawella', meta: 'Swing spot · 9 min away', rating: '4.4' },
  ];

  return (
    <div className="flex flex-col gap-3">
      <Row index={0}>
        <div className="flex items-center gap-2 rounded-2xl border border-toursl-line bg-toursl-sand px-4 py-3">
          <Search className="h-4 w-4 flex-shrink-0 text-toursl-muted" />
          <span className="font-sans text-[13px] text-toursl-text">
            Beaches near Galle
          </span>
        </div>
      </Row>

      {results.map((r, i) => (
        <Row key={r.name} index={i + 1}>
          <div className="flex items-center gap-3 rounded-2xl border border-toursl-line bg-white p-3">
            <span className="h-11 w-11 flex-shrink-0 rounded-xl bg-toursl-sand" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-sans text-[13px] font-semibold text-toursl-text">
                {r.name}
              </p>
              <p className="truncate font-sans text-[11px] text-toursl-muted">
                {r.meta}
              </p>
              <p className="mt-1 flex items-center gap-1 font-sans text-[11px] text-toursl-accent">
                <Star className="h-3 w-3 fill-current" />
                {r.rating}
              </p>
            </div>
            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-toursl-dark">
              <Plus className="h-3.5 w-3.5 text-white" />
            </span>
          </div>
        </Row>
      ))}
    </div>
  );
}

function ItineraryScreen() {
  return (
    <div className="flex flex-col gap-3">
      <Row index={0}>
        <div className="flex items-center justify-between">
          <p className="font-sans text-[13px] font-semibold text-toursl-text">
            South Coast Run
          </p>
          <span className="border-b border-toursl-accent/40 pb-0.5 font-display text-[12px] leading-none text-toursl-accent">
            4 days
          </span>
        </div>
      </Row>

      {[
        { day: 'Day 1', stops: ['Galle Fort', 'Unawatuna'] },
        { day: 'Day 2', stops: ['Mirissa', 'Whale point'] },
      ].map((d, i) => (
        <Row key={d.day} index={i + 1}>
          <div className="rounded-2xl border border-toursl-line bg-white p-3">
            <p className="mb-2 font-sans text-[10px] font-medium uppercase tracking-[0.08em] text-toursl-muted">
              {d.day}
            </p>
            <div className="flex flex-col gap-2">
              {d.stops.map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-toursl-accent" />
                  <span className="font-sans text-[12px] text-toursl-text">
                    {s}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Row>
      ))}

      <Row index={3}>
        <div className="rounded-2xl bg-toursl-dark p-3.5 text-white">
          <p className="mb-2.5 font-sans text-[10px] font-medium uppercase tracking-[0.08em] text-white/45">
            Drive between days
          </p>
          <p className="flex items-center font-sans text-[13px] font-medium">
            Galle
            <RouteConnector tone="light" className="mx-2" />
            Mirissa
          </p>
          <div className="mt-2.5 flex items-center gap-4 font-sans text-[11px] text-white/65">
            <span className="flex items-center gap-1.5">
              <Car className="h-3.5 w-3.5" />
              42 km
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              1h 05m
            </span>
          </div>
        </div>
      </Row>
    </div>
  );
}

function BookingScreen() {
  return (
    <div className="flex flex-col gap-3">
      <Row index={0}>
        <div className="rounded-2xl border border-toursl-line bg-white p-3">
          <div className="mb-3 h-20 w-full rounded-xl bg-toursl-sand" />
          <p className="font-sans text-[13px] font-semibold text-toursl-text">
            Southern Coast, 4 days
          </p>
          <p className="font-sans text-[11px] text-toursl-muted">
            Private van · English, Sinhala
          </p>
        </div>
      </Row>

      <Row index={1}>
        <div className="flex items-center gap-3 rounded-2xl border border-toursl-line bg-white p-3">
          <span className="h-9 w-9 flex-shrink-0 rounded-full bg-toursl-sand" />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1 font-sans text-[12px] font-semibold text-toursl-text">
              Nuwan P.
              <BadgeCheck className="h-3.5 w-3.5 text-toursl-accent" />
            </p>
            <p className="font-sans text-[11px] text-toursl-muted">
              Licensed guide · 84 tours
            </p>
          </div>
          <p className="font-sans text-[13px] font-semibold text-toursl-text">
            $210
          </p>
        </div>
      </Row>

      <Row index={2}>
        {/* Ticket stub rather than a button: perforated edge, notched sides */}
        <div className="relative overflow-hidden rounded-2xl bg-toursl-dark px-4 py-3.5 text-white">
          <span className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white" />
          <span className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white" />
          <div className="flex items-center justify-between border-b border-dashed border-white/25 pb-2.5">
            <span className="font-display text-[13px] leading-none">
              Request booking
            </span>
            <MoveRight className="h-4 w-4 text-white/70" />
          </div>
          <p className="pt-2.5 font-sans text-[10px] uppercase tracking-[0.1em] text-white/45">
            4 days · 2 travellers · Apr 12
          </p>
        </div>
      </Row>

      <Row index={3}>
        <div className="flex items-center gap-2 rounded-2xl border border-toursl-accent/30 bg-toursl-accent/10 p-3">
          <BadgeCheck className="h-4 w-4 flex-shrink-0 text-toursl-accent" />
          <span className="font-sans text-[11px] text-toursl-text">
            Nuwan usually replies within an hour.
          </span>
        </div>
      </Row>
    </div>
  );
}

const SCREENS = [DiscoverScreen, ItineraryScreen, BookingScreen];

export default function PhoneMock({ step }: { step: number }) {
  const Screen = SCREENS[step] ?? SCREENS[0];

  return (
    <div className="relative w-[300px] max-md:w-full max-md:max-w-[300px]">
      {/* Soft glow so the device lifts off the white section */}
      <div
        aria-hidden
        className="absolute -inset-6 rounded-[60px] blur-2xl"
        style={{
          background:
            'radial-gradient(60% 60% at 50% 40%, rgba(144,88,49,0.16) 0%, rgba(255,255,255,0) 100%)',
        }}
      />

      <div className="relative rounded-[44px] border-[10px] border-toursl-dark bg-toursl-dark shadow-[0_40px_80px_-40px_rgba(0,0,0,0.55)]">
        <div className="relative h-[560px] overflow-hidden rounded-[34px] bg-white">
          {/* Notch */}
          <div className="absolute left-1/2 top-2 z-[2] h-6 w-24 -translate-x-1/2 rounded-full bg-toursl-dark" />

          <div className="flex h-full flex-col px-4 pb-5 pt-11">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-display text-[18px] leading-none text-toursl-text">
                toursl
              </span>
              <span className="font-sans text-[11px] text-toursl-muted">
                Sri Lanka
              </span>
            </div>

            {/* Remounting on step change replays the entry animation */}
            <div key={step} className="flex-1 overflow-hidden">
              <Screen />
            </div>

            <div className="mt-4 flex justify-center gap-1.5">
              {SCREENS.map((_, i) => (
                <span
                  key={i}
                  className={[
                    'h-1.5 rounded-full transition-all duration-500',
                    i === step ? 'w-6 bg-toursl-dark' : 'w-1.5 bg-toursl-line',
                  ].join(' ')}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
