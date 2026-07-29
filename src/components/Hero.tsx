import { useCallback, useRef, useState } from 'react';
import { CalendarDays, MapPin, Route } from 'lucide-react';
import Nav from '@/components/Nav';
import RouteConnector from '@/components/RouteConnector';
import HeroScrollCanvas, {
  HERO_POSTER,
  HERO_POSTER_MOBILE,
} from '@/components/HeroScrollCanvas';

const ITINERARY = [
  {
    day: 'Day 1',
    from: 'Colombo',
    to: 'Kandy',
    detail: 'Temple of the Tooth · 3h 10m drive · 116 km',
    icon: Route,
  },
  {
    day: 'Day 2',
    from: 'Kandy',
    to: null,
    detail: 'Royal Botanical Gardens · Tea factory tour',
    icon: MapPin,
  },
  {
    day: 'Day 3',
    from: 'Kandy',
    to: 'Ella',
    detail: 'Scenic train · Nine Arch Bridge at sunset',
    icon: CalendarDays,
  },
];

// Clears the top of the artwork so it dissolves into the pale page instead of
// sitting in a box. Nothing is painted over the imagery.
const HERO_MASK =
  'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.18) 10%, rgba(0,0,0,0.6) 22%, rgba(0,0,0,0.9) 34%, #000 44%)';

/** Scroll-progress windows for the two elements that fly in. CTA lands first. */
const CTA = { in: 0.12, out: 0.34 };
const CARD = { in: 0.36, out: 0.66 };

/** 0..1 eased progress of `p` through a window. */
function windowed(p: number, w: { in: number; out: number }) {
  const t = Math.min(Math.max((p - w.in) / (w.out - w.in), 0), 1);
  return 1 - Math.pow(1 - t, 3);
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [isSmall] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 760px)').matches
  );

  // Scroll drives both elements imperatively, so scrubbing never re-renders.
  const handleProgress = useCallback((p: number) => {
    const card = cardRef.current;
    if (card) {
      const e = windowed(p, CARD);
      card.style.opacity = String(e);
      card.style.transform = `translate3d(0, ${(1 - e) * 70}px, 0) scale(${
        0.94 + e * 0.06
      })`;
    }

    const cta = ctaRef.current;
    if (cta) {
      const e = windowed(p, CTA);
      cta.style.opacity = String(e);
      cta.style.transform = `translate3d(0, ${(1 - e) * 34}px, 0)`;
    }
  }, []);

  const hiddenStyle = (offset: number) =>
    isSmall
      ? undefined
      : {
          opacity: 0,
          transform: `translate3d(0, ${offset}px, 0)`,
          willChange: 'opacity, transform' as const,
        };

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[560vh] max-md:h-[340vh]"
      style={{ background: 'linear-gradient(180deg, #faf8f6 0%, #ffffff 40%)' }}
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* Accent rule rides the bottom of the pinned stage, so it sits on the
            screen edge for the whole hero instead of only at the very end. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-[5px] bg-toursl-accent"
        />
        {/* Artwork sits along the bottom. Its top edge is masked away, so the
            headline above it reads on the pale page. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 z-0 h-[66vh] max-md:h-[52vh] bg-[length:100%_auto] bg-bottom bg-no-repeat max-md:bg-cover"
          style={{
            backgroundImage: HERO_POSTER_MOBILE
              ? `url(${isSmall ? HERO_POSTER_MOBILE : HERO_POSTER})`
              : undefined,
            maskImage: HERO_MASK,
            WebkitMaskImage: HERO_MASK,
            opacity: loaded ? 0 : 1,
            transition: 'opacity 600ms ease',
          }}
        />

        <HeroScrollCanvas
          scrollRef={sectionRef}
          onLoaded={() => setLoaded(true)}
          onProgress={handleProgress}
          className="absolute inset-x-0 bottom-0 z-0 h-[66vh] max-md:h-[52vh] w-full"
          style={{
            maskImage: HERO_MASK,
            WebkitMaskImage: HERO_MASK,
            // Once the halo is up, the artwork steps back and brightens so the
            // card and its glow stay the focus.
            opacity: loaded ? 0.82 : 1,
            filter: loaded ? 'brightness(1.12) saturate(0.92)' : 'none',
            transition: 'opacity 900ms ease, filter 900ms ease',
          }}
        />

        <div className="relative z-[2] flex h-full flex-col">
          <div className="mx-auto w-full max-w-[1360px]">
            <Nav />
          </div>

          <div className="mx-auto flex w-full max-w-[1360px] flex-1 flex-col items-center justify-center gap-[2.4vh] px-6 pb-[3vh] text-center max-md:gap-[2vh] max-md:px-4 max-md:pb-[2vh]">
            <div>
              <span className="font-sans text-[13px] max-md:text-[11px] font-medium uppercase tracking-[0.1em] text-toursl-accent">
                Built for Sri Lanka
              </span>
              <h1 className="mt-3 max-md:mt-2 font-display text-[clamp(34px,4.2vw,62px)] max-md:text-[26px] text-toursl-text leading-[1.1] tracking-[-0.01em] max-w-[1100px]">
                Plan every day of your Sri Lanka trip in one place
              </h1>
              <p className="mx-auto mt-4 max-md:mt-3 font-sans text-base max-md:text-[13px] font-medium text-toursl-text/70 leading-relaxed max-w-[540px] max-md:max-w-[320px]">
                Build multi-day itineraries stop by stop, add activities, and
                get real driving routes between destinations.
              </p>
            </div>

            {/* CTA lands before the itinerary does */}
            <div ref={ctaRef} style={hiddenStyle(34)}>
              <button
                type="button"
                className="inline-flex h-14 w-[210px] max-md:h-12 max-md:w-[180px] items-center justify-center bg-toursl-dark text-[#fafafa] border border-toursl-dark cursor-pointer font-sans text-[15px] max-md:text-[13px] font-medium uppercase tracking-[0.04em] rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#333] hover:scale-[1.03] active:scale-95"
              >
                Plan My Trip
              </button>
            </div>

            {/* Itinerary card: rises in as the section is scrolled */}
            <div
              ref={cardRef}
              className="relative w-full max-w-[820px]"
              style={hiddenStyle(70)}
            >
              {/* Halo, revealed once every frame has decoded. Light rather than
                  brown: the warm artwork behind it swallowed a brown glow. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-1000"
                style={{ opacity: loaded ? 1 : 0 }}
              >
                {/* Steady sand glow. No hard ring: a 1px white edge read as a
                    harsh border against the artwork. */}
                <div
                  className={`absolute inset-0 rounded-[20px] ${
                    loaded ? 'animate-halo-breathe' : ''
                  }`}
                  style={{
                    // Let the fade-in finish before the breathing takes over.
                    animationDelay: '1000ms',
                    boxShadow:
                      '0 0 30px 6px rgba(247,244,240,0.5), 0 0 70px 22px rgba(240,231,220,0.42), 0 0 130px 50px rgba(236,225,212,0.3), 0 40px 70px -30px rgba(0,0,0,0.5)',
                  }}
                />

                {/* Light travelling around the border itself */}
                <div className="halo-ring absolute -inset-[2px] rounded-[22px]" />
              </div>

              <div className="relative z-[1] overflow-hidden rounded-[20px] max-md:rounded-[16px] border border-toursl-line bg-white text-left shadow-[0_44px_90px_-30px_rgba(0,0,0,0.62)]">
                <div className="flex items-center justify-between border-b border-toursl-line px-8 py-[1.6vh] max-md:px-4 max-md:py-3">
                  <div>
                    <p className="font-sans text-base max-md:text-sm font-semibold text-toursl-text">
                      Southern Highlands Loop
                    </p>
                    <p className="font-sans text-sm max-md:text-xs text-toursl-muted">
                      7 days · 12 stops · 486 km
                    </p>
                  </div>
                  <span className="border-b border-toursl-accent/40 pb-0.5 font-display text-[14px] max-md:text-[12px] leading-none text-toursl-accent">
                    Draft
                  </span>
                </div>

                <ul className="divide-y divide-toursl-line">
                  {ITINERARY.map(({ day, from, to, detail, icon: Icon }) => (
                    <li
                      key={day}
                      className="flex items-start gap-4 max-md:gap-3 px-8 py-[1.25vh] max-md:px-4 max-md:py-2.5 transition-colors hover:bg-toursl-sand/50"
                    >
                      <span className="mt-0.5 flex h-9 w-9 max-md:h-7 max-md:w-7 flex-shrink-0 items-center justify-center rounded-full bg-toursl-sand">
                        <Icon className="h-[18px] w-[18px] max-md:h-[14px] max-md:w-[14px] text-toursl-accent" />
                      </span>
                      <div>
                        <p className="font-sans text-xs max-md:text-[10px] font-medium uppercase tracking-[0.08em] text-toursl-muted">
                          {day}
                        </p>
                        <p className="flex items-center font-sans text-lg max-md:text-[15px] font-medium text-toursl-text leading-snug">
                          {from}
                          {to && (
                            <>
                              <RouteConnector className="mx-2 max-md:mx-1.5" />
                              {to}
                            </>
                          )}
                        </p>
                        <p className="font-sans text-[15px] max-md:text-[12px] text-toursl-muted leading-snug">
                          {detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
