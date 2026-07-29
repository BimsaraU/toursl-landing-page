import { BadgeCheck, Car, Clock, MapPin, Star } from 'lucide-react';
import RouteConnector from '@/components/RouteConnector';

/**
 * Mobile counterpart to PhoneMock. A phone frame inside a phone screen reads as
 * clutter, so small viewports get the same three moments as flat, full-width
 * rows at readable type sizes instead.
 */

function Row({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  return (
    <div
      className="animate-step-in"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      {children}
    </div>
  );
}

function Discover() {
  const results = [
    { name: 'Unawatuna Beach', meta: 'Beach · 12 min away', rating: '4.6' },
    { name: 'Jungle Beach', meta: 'Cove · 21 min away', rating: '4.8' },
  ];

  return (
    <div className="flex flex-col gap-2.5">
      {results.map((r, i) => (
        <Row key={r.name} index={i}>
          <div className="flex items-center gap-3 rounded-2xl border border-toursl-line bg-white p-3.5">
            <span className="h-12 w-12 flex-shrink-0 rounded-xl bg-toursl-sand" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-sans text-[15px] font-semibold text-toursl-text">
                {r.name}
              </p>
              <p className="truncate font-sans text-[13px] text-toursl-muted">
                {r.meta}
              </p>
            </div>
            <span className="flex flex-shrink-0 items-center gap-1 font-sans text-[13px] text-toursl-accent">
              <Star className="h-3.5 w-3.5 fill-current" />
              {r.rating}
            </span>
          </div>
        </Row>
      ))}
    </div>
  );
}

function Itinerary() {
  return (
    <div className="flex flex-col gap-2.5">
      <Row index={0}>
        <div className="rounded-2xl border border-toursl-line bg-white p-3.5">
          <p className="mb-2 font-sans text-[11px] font-medium uppercase tracking-[0.08em] text-toursl-muted">
            Day 1
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {['Galle Fort', 'Unawatuna'].map((s) => (
              <span
                key={s}
                className="flex items-center gap-1.5 font-sans text-[14px] text-toursl-text"
              >
                <MapPin className="h-3.5 w-3.5 text-toursl-accent" />
                {s}
              </span>
            ))}
          </div>
        </div>
      </Row>

      <Row index={1}>
        <div className="rounded-2xl bg-toursl-dark p-3.5 text-white">
          <p className="flex items-center font-sans text-[14px] font-medium">
            Galle
            <RouteConnector tone="light" className="mx-2" />
            Mirissa
          </p>
          <div className="mt-2 flex items-center gap-4 font-sans text-[12px] text-white/65">
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

function Booking() {
  return (
    <div className="flex flex-col gap-2.5">
      <Row index={0}>
        <div className="flex items-center gap-3 rounded-2xl border border-toursl-line bg-white p-3.5">
          <span className="h-10 w-10 flex-shrink-0 rounded-full bg-toursl-sand" />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1 font-sans text-[15px] font-semibold text-toursl-text">
              Nuwan P.
              <BadgeCheck className="h-4 w-4 text-toursl-accent" />
            </p>
            <p className="font-sans text-[13px] text-toursl-muted">
              Licensed guide · 84 tours
            </p>
          </div>
          <p className="font-sans text-[15px] font-semibold text-toursl-text">
            $210
          </p>
        </div>
      </Row>

      <Row index={1}>
        <div className="relative overflow-hidden rounded-2xl bg-toursl-dark px-4 py-3.5 text-white">
          <span className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-toursl-sand" />
          <span className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-toursl-sand" />
          <p className="border-b border-dashed border-white/25 pb-2.5 font-display text-[15px] leading-none">
            Request booking
          </p>
          <p className="pt-2.5 font-sans text-[11px] uppercase tracking-[0.1em] text-white/45">
            4 days · 2 travellers · Apr 12
          </p>
        </div>
      </Row>
    </div>
  );
}

const PREVIEWS = [Discover, Itinerary, Booking];

export default function StepPreviewMobile({ step }: { step: number }) {
  const Preview = PREVIEWS[step] ?? PREVIEWS[0];
  return (
    <div key={step} className="mt-5">
      <Preview />
    </div>
  );
}
