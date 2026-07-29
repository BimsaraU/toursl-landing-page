import { useEffect, useRef } from 'react';

// Vite resolves the globs at build time, so each frame is hashed and emitted.
function urls(mod: Record<string, unknown>) {
  return Object.entries(mod)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, url]) => url as string);
}

const FRAMES = urls(
  import.meta.glob('@/assets/hero-frames/*.jpg', {
    eager: true,
    query: '?url',
    import: 'default',
  })
);

// Smaller, harder-compressed copies. Phones get these so the sequence still
// runs there without downloading 5 MB or holding full-size decoded bitmaps.
// Sized so that after DPR and the cover-crop they are still downscaled, never
// stretched: a phone canvas is ~780px wide and the crop adds ~25% zoom.
const FRAMES_MOBILE = urls(
  import.meta.glob('@/assets/hero-frames-mobile/*.jpg', {
    eager: true,
    query: '?url',
    import: 'default',
  })
);

export const HERO_POSTER = FRAMES[0];
export const HERO_POSTER_MOBILE = FRAMES_MOBILE[0];

type Props = {
  /** Scrolled element that drives playback. */
  scrollRef: React.RefObject<HTMLElement>;
  /** Fired once every frame is decoded. */
  onLoaded?: () => void;
  /** Called on each scroll tick with progress in 0..1. */
  onProgress?: (p: number) => void;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Scroll-scrubbed frame sequence. Progress through the section maps to a frame
 * index, so scrolling plays the shot rather than just moving it. Frames are
 * decoded up front and drawn to a canvas, so scrubbing never hits the network.
 *
 * Small screens and reduced-motion users keep the first frame as a still: the
 * sequence is decorative and holding ~80 decoded bitmaps is not worth it there.
 */
export default function HeroScrollCanvas({
  scrollRef,
  onLoaded,
  onProgress,
  className = '',
  style,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loadedRef = useRef(onLoaded);
  const progressRef = useRef(onProgress);
  loadedRef.current = onLoaded;
  progressRef.current = onProgress;

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = scrollRef.current;
    if (!canvas || !section || FRAMES.length === 0) return;

    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const small = window.matchMedia('(max-width: 760px)').matches;

    if (reduced) {
      loadedRef.current?.();
      progressRef.current?.(0);
      return;
    }

    const sources = small && FRAMES_MOBILE.length > 0 ? FRAMES_MOBILE : FRAMES;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingQuality = 'high';

    let cancelled = false;
    let rafId = 0;
    let queued = false;
    const images: HTMLImageElement[] = [];

    function draw(img: HTMLImageElement) {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (small) {
        // Phones: fill the band and crop the sides. Full frame width on a narrow
        // screen leaves a strip too short to read as artwork.
        const scale = Math.max(
          canvas.width / img.naturalWidth,
          canvas.height / img.naturalHeight
        );
        const w = img.naturalWidth * scale;
        const h = img.naturalHeight * scale;
        ctx.drawImage(img, (canvas.width - w) / 2, canvas.height - h, w, h);
        return;
      }

      // Full frame width, bottom-anchored: nothing is cropped horizontally, and
      // any excess height runs off the top where the mask has already faded it.
      const scale = canvas.width / img.naturalWidth;
      const h = img.naturalHeight * scale;
      ctx.drawImage(img, 0, canvas.height - h, canvas.width, h);
    }

    function render() {
      queued = false;
      if (!section || images.length === 0) return;

      const rect = section.getBoundingClientRect();
      const distance = rect.height - window.innerHeight;
      const progress =
        distance <= 0 ? 0 : Math.min(Math.max(-rect.top / distance, 0), 1);

      const index = Math.min(
        images.length - 1,
        Math.round(progress * (images.length - 1))
      );
      draw(images[index]);
      progressRef.current?.(progress);
    }

    function onScroll() {
      if (queued) return;
      queued = true;
      rafId = requestAnimationFrame(render);
    }

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      render();
    }

    async function load() {
      const loaded = await Promise.all(
        sources.map(
          (src) =>
            new Promise<HTMLImageElement | null>((resolve) => {
              const img = new Image();
              img.decoding = 'async';
              img.onload = () => resolve(img);
              img.onerror = () => resolve(null);
              img.src = src;
            })
        )
      );
      if (cancelled) return;

      images.push(...loaded.filter((i): i is HTMLImageElement => i !== null));
      if (images.length === 0) return;

      resize();
      loadedRef.current?.();
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resize);
    void load();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resize);
    };
  }, [scrollRef]);

  return <canvas ref={canvasRef} className={className} style={style} />;
}
