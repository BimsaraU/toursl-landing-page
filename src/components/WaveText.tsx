import { useRef } from 'react';

type Props = {
  text: string;
  className?: string;
};

/**
 * Headline whose letters lift toward the cursor, strongest at the pointer and
 * falling off to either side. Styles are written straight to the DOM so a
 * pointer move never re-renders the tree.
 */
export default function WaveText({ text, className = '' }: Props) {
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

  function handleMove(e: React.PointerEvent<HTMLSpanElement>) {
    const x = e.clientX;
    const y = e.clientY;

    for (const el of charRefs.current) {
      if (!el) continue;
      const r = el.getBoundingClientRect();
      const dx = x - (r.left + r.width / 2);
      const dy = y - (r.top + r.height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Falloff radius in px: letters outside it stay put.
      const strength = Math.max(0, 1 - dist / 190);
      const eased = strength * strength;

      el.style.transform = `translate3d(${dx * 0.06 * eased}px, ${
        -26 * eased
      }px, 0) scale(${1 + 0.22 * eased}) rotate(${dx * 0.02 * eased}deg)`;
      el.style.transitionDuration = '120ms';
    }
  }

  function handleLeave() {
    for (const el of charRefs.current) {
      if (!el) continue;
      el.style.transform = 'translate3d(0,0,0) scale(1) rotate(0deg)';
      el.style.transitionDuration = '650ms';
    }
  }

  let index = -1;

  return (
    <span
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={`inline-block cursor-default select-none ${className}`}
    >
      {text.split(' ').map((word, w) => (
        <span key={`${word}-${w}`} className="inline-block whitespace-nowrap">
          {word.split('').map((char, c) => {
            index += 1;
            const i = index;
            return (
              <span
                key={`${char}-${c}`}
                ref={(el) => {
                  charRefs.current[i] = el;
                }}
                className="inline-block will-change-transform transition-transform ease-[cubic-bezier(0.22,1,0.36,1)]"
              >
                {char}
              </span>
            );
          })}
          {/* Keeps the space between words selectable and sized normally */}
          <span className="inline-block">&nbsp;</span>
        </span>
      ))}
    </span>
  );
}
