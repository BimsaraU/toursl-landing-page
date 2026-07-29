type Props = {
  /** 'dark' for pale surfaces, 'light' for dark surfaces. */
  tone?: 'dark' | 'light';
  className?: string;
};

/**
 * Trail-and-arrowhead connector used between stops in a route: three dots that
 * build in weight, then a small solid head. Replaces a plain arrow glyph.
 */
export default function RouteConnector({ tone = 'dark', className = '' }: Props) {
  const color = tone === 'light' ? 'bg-white/70' : 'bg-toursl-muted';
  const head = tone === 'light' ? 'text-white/70' : 'text-toursl-muted';

  return (
    <span
      aria-hidden
      className={`inline-flex items-center gap-[3px] px-1 align-middle ${className}`}
    >
      <span className={`h-[3px] w-[3px] rounded-full opacity-40 ${color}`} />
      <span className={`h-[3px] w-[3px] rounded-full opacity-70 ${color}`} />
      <span className={`h-[3px] w-[3px] rounded-full ${color}`} />
      <svg
        viewBox="0 0 6 8"
        className={`h-[8px] w-[6px] ${head}`}
        fill="currentColor"
      >
        <path d="M0 0 L6 4 L0 8 Z" />
      </svg>
    </span>
  );
}
