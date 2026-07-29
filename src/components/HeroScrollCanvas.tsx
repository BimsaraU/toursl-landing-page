import { useEffect, useRef } from 'react';

// Vite resolves the glob at build time, so each frame is hashed and emitted.
const FRAMES = Object.entries(
  import.meta.glob('@/assets/hero-frames/*.jpg', {
    eager: true,
    query: '?url',
    import: 'default',
  }) as Record<string, string>
)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, url]) => url);

export const HERO_POSTER = FRAMES[0];

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

    if (reduced || small) {
      loadedRef.current?.();
      progressRef.current?.(0);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cancelled = false;
    let rafId = 0;
    let queued = false;
    const images: HTMLImageElement[] = [];

    function draw(img: HTMLImageElement) {
      if (!canvas || !ctx) return;
      // Full frame width, bottom-anchored: nothing is cropped horizontally, and
      // any excess height runs off the top where the mask has already faded it.
      const scale = canvas.width / img.naturalWidth;
      const h = img.naturalHeight * scale;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
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
        FRAMES.map(
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
