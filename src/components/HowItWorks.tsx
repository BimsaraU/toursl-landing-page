import { useEffect, useState } from 'react';
import PhoneMock from '@/components/PhoneMock';
import StepPreviewMobile from '@/components/StepPreviewMobile';

const STEP_DURATION = 5200;

const STEPS = [
  {
    title: 'Discover places',
    body: 'Search beaches, temples, hikes and restaurants across Sri Lanka. Place details, photos and ratings come straight from Google Places.',
  },
  {
    title: 'Build the itinerary',
    body: 'Drop stops into days, add activities and timings, and reorder as plans change. Routes and travel times between destinations update with the plan.',
  },
  {
    title: 'Book a guide, or go solo',
    body: 'Browse packages published by local guides and book the ones that fit your route, or keep the trip fully self-planned.',
  },
];

const HEADING = 'Your whole trip, from first idea to final drive';

function Heading() {
  return (
    <>
      <p className="font-display font-medium text-[32px] max-md:text-[26px] tracking-[0.02em] text-toursl-accent mb-4">
        How it works
      </p>
      <h2 className="font-sans text-[clamp(30px,4vw,46px)] font-medium text-toursl-text leading-[1.1] tracking-[-0.03em] max-w-[640px] mb-12 max-md:mb-8">
        {HEADING}
      </h2>
    </>
  );
}

function TimerBar({ active, paused }: { active: number; paused: boolean }) {
  return (
    <span
      aria-hidden
      className="absolute inset-x-0 bottom-0 h-[3px] bg-toursl-line/60"
    >
      {!paused && (
        <span
          key={active}
          className="block h-full w-full bg-toursl-accent animate-bar-fill"
          style={
            { '--bar-duration': `${STEP_DURATION}ms` } as React.CSSProperties
          }
        />
      )}
    </span>
  );
}

export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setTimeout(
      () => setActive((i) => (i + 1) % STEPS.length),
      STEP_DURATION
    );
    return () => window.clearTimeout(id);
  }, [active, paused]);

  return (
    <section
      id="how-it-works"
      // Accent rule marks where the scroll-scrubbed hero ends.
      className="w-full border-t-[5px] border-toursl-accent bg-white"
    >
      {/* Desktop: steps on the left, phone centred against the whole block */}
      <div className="mx-auto max-w-[1360px] px-20 py-24 max-md:hidden">
        <div
          className="grid grid-cols-[1fr_auto] items-center gap-20"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div>
            <Heading />

            <div className="flex flex-col gap-2">
              {STEPS.map((step, i) => {
                const isOn = i === active;
                return (
                  <button
                    key={step.title}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-pressed={isOn}
                    className={[
                      'relative overflow-hidden rounded-[24px] border p-7 text-left cursor-pointer',
                      'transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                      isOn
                        ? 'border-toursl-line bg-toursl-sand'
                        : 'border-transparent bg-transparent hover:bg-toursl-sand/50',
                    ].join(' ')}
                  >
                    <div className="flex items-center gap-6">
                      <span
                        className={[
                          'w-12 flex-shrink-0 text-center font-display text-[40px] leading-none transition-colors duration-500',
                          isOn ? 'text-toursl-accent' : 'text-toursl-line',
                        ].join(' ')}
                      >
                        {i + 1}
                      </span>

                      <div>
                        <h3 className="font-sans text-2xl font-medium text-toursl-text tracking-[-0.02em] mb-2">
                          {step.title}
                        </h3>
                        <p
                          className={[
                            'font-sans text-base leading-relaxed transition-colors duration-500',
                            isOn ? 'text-toursl-text/75' : 'text-toursl-muted',
                          ].join(' ')}
                        >
                          {step.body}
                        </p>
                      </div>
                    </div>

                    {isOn && <TimerBar active={active} paused={paused} />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center">
            <PhoneMock step={active} />
          </div>
        </div>
      </div>

      {/* Mobile: no device frame. The active step opens its own preview inline */}
      <div className="mx-auto max-w-[1360px] px-6 py-16 md:hidden">
        <Heading />

        <div className="flex flex-col gap-3">
          {STEPS.map((step, i) => {
            const isOn = i === active;
            return (
              <div
                key={step.title}
                className={[
                  'relative overflow-hidden rounded-[24px] border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                  isOn
                    ? 'border-toursl-line bg-toursl-sand p-5'
                    : 'border-toursl-line/70 bg-white p-5',
                ].join(' ')}
              >
                <button
                  type="button"
                  onClick={() => {
                    setActive(i);
                    setPaused(true);
                  }}
                  aria-expanded={isOn}
                  className="w-full bg-transparent border-none cursor-pointer text-center"
                >
                  <span
                    className={[
                      'block font-display text-[52px] leading-none mb-3 transition-colors duration-500',
                      isOn ? 'text-toursl-accent' : 'text-toursl-line',
                    ].join(' ')}
                  >
                    {i + 1}
                  </span>
                  <h3 className="font-sans text-xl font-medium text-toursl-text tracking-[-0.02em] mb-2">
                    {step.title}
                  </h3>
                  {isOn && (
                    <p className="font-sans text-[15px] text-toursl-text/75 leading-relaxed">
                      {step.body}
                    </p>
                  )}
                </button>

                {isOn && <StepPreviewMobile step={active} />}
                {isOn && <TimerBar active={active} paused={paused} />}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
