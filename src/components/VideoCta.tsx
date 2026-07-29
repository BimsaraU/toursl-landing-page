import WaveText from '@/components/WaveText';

const VIDEO_SRC =
  'https://pollen-batch-41236914.figma.site/_components/v2/f0ee2dae7671c170c34f12e31c4cb41418976c98/769c564298c132f7919405cd9f17c1b1231f341d.769c5642.mp4';

// Masks the top of the footage to fully transparent, so the video itself has no
// hard edge. Nothing is painted over it.
// It dissolves into the page instead of sitting in a box, and the pale upper
// band is what the dark headline sits on.
const VIDEO_MASK =
  'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.06) 14%, rgba(0,0,0,0.28) 30%, rgba(0,0,0,0.7) 46%, #000 60%)';

export default function VideoCta() {
  return (
    <section className="relative w-full min-h-svh overflow-hidden bg-toursl-sand max-md:flex max-md:min-h-0 max-md:flex-col">
      {/* Desktop: fills the section behind the copy. Phones: drops below the
          copy in flow, at the full width of the footage with nothing cropped. */}
      <video
        className="absolute inset-0 h-full w-full object-cover z-0 max-md:static max-md:order-2 max-md:h-auto"
        src={VIDEO_SRC}
        autoPlay
        muted
        loop
        playsInline
        style={{
          maskImage: VIDEO_MASK,
          WebkitMaskImage: VIDEO_MASK,
        }}
      />

      <div className="relative z-[2] w-full max-w-[1360px] mx-auto px-20 pt-[15vh] max-md:order-1 max-md:px-5 max-md:pt-14 max-md:pb-7 flex flex-col items-center text-center">
        <h2 className="font-display text-[clamp(34px,5.4vw,74px)] max-md:text-[30px] leading-[1.12] tracking-[-0.01em] text-toursl-text max-w-[900px] mb-7 max-md:mb-4">
          <WaveText text="A short stay." />
          <br className="max-md:hidden" />
          <WaveText text="A very long list." />
        </h2>

        <p className="font-sans text-lg max-md:text-[14px] font-medium text-toursl-text/75 leading-relaxed max-w-[560px] max-md:max-w-[340px] mb-10 max-md:mb-6 text-balance">
          Start ticking it off. Your first itinerary takes a few minutes, it is
          free, no card needed, and yours to change right up until you land.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 max-md:w-full max-md:flex-nowrap max-md:gap-2.5">
          <button
            type="button"
            className="inline-flex h-14 w-[210px] max-md:h-12 max-md:w-auto max-md:flex-1 items-center justify-center bg-toursl-dark text-[#fafafa] border border-toursl-dark cursor-pointer font-sans text-[15px] max-md:text-[12px] font-medium uppercase tracking-[0.04em] rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#333] hover:scale-[1.03] active:scale-95"
          >
            Plan My Trip
          </button>
          <button
            type="button"
            className="inline-flex h-14 w-[210px] max-md:h-12 max-md:w-auto max-md:flex-1 items-center justify-center bg-white/40 text-toursl-text border border-toursl-text/25 cursor-pointer font-sans text-[15px] max-md:text-[12px] font-medium uppercase tracking-[0.04em] rounded-full backdrop-blur-[14px] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-white/70 hover:scale-[1.03] active:scale-95"
          >
            Publish a Tour
          </button>
        </div>
      </div>
    </section>
  );
}
