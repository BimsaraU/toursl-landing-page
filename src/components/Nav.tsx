import { useEffect, useRef, useState } from 'react';

const LINKS = [
  { label: 'How it works', href: '#how-it-works' },
  { label: "Who it's for", href: '#for-guides' },
  { label: 'Try it', href: '#try-it' },
  { label: 'What’s next', href: '#ai' },
];

export default function Nav() {
  const containerRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [pill, setPill] = useState({ left: 0, top: 0, width: 0, height: 0 });

  function movePillTo(index: number) {
    const container = containerRef.current;
    const link = linkRefs.current[index];
    if (!container || !link) return;
    const containerRect = container.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    setPill({
      left: linkRect.left - containerRect.left,
      top: linkRect.top - containerRect.top,
      width: linkRect.width,
      height: linkRect.height,
    });
  }

  useEffect(() => {
    movePillTo(0);
  }, []);

  return (
    <nav className="relative z-[3] flex items-center justify-between px-20 pt-6 pb-4 max-md:px-6 max-md:pt-5">
      <span className="font-display text-[40px] max-md:text-[32px] text-black leading-none select-none">
        toursl
      </span>

      <div
        ref={containerRef}
        onMouseLeave={() => setHoverIndex(null)}
        className="absolute left-1/2 -translate-x-1/2 flex gap-3 max-lg:hidden"
      >
        <span
          aria-hidden
          className="absolute rounded-full bg-toursl-dark transition-[left,top,width,height,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none"
          style={{
            left: pill.left,
            top: pill.top,
            width: pill.width,
            height: pill.height,
            opacity: hoverIndex !== null ? 1 : 0,
          }}
        />
        {LINKS.map((link, i) => (
          <a
            key={link.href}
            ref={(el) => {
              linkRefs.current[i] = el;
            }}
            href={link.href}
            onMouseEnter={() => {
              setHoverIndex(i);
              movePillTo(i);
            }}
            className={[
              'relative z-[1] inline-flex h-12 w-[168px] items-center justify-center bg-transparent border-none cursor-pointer font-sans text-[15px] font-medium uppercase tracking-[0.04em] rounded-full transition-colors duration-300',
              hoverIndex === i ? 'text-white' : 'text-toursl-text',
            ].join(' ')}
          >
            {link.label}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="inline-flex h-12 w-[150px] items-center justify-center bg-transparent text-toursl-text border border-toursl-text/25 cursor-pointer font-sans text-[15px] font-medium uppercase tracking-[0.04em] rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-toursl-sand hover:scale-[1.04] active:scale-95 active:duration-150"
        >
          Login
        </button>
      </div>
    </nav>
  );
}
