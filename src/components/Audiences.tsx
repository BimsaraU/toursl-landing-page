import { Check } from 'lucide-react';

const TOURIST = [
  'Multi-day itineraries with stops, activities and notes per day',
  'Driving routes, distances and travel times between destinations',
  'Place discovery with photos, hours and ratings',
  'Save trips, revise them, and share the plan with travel companions',
];

const GUIDE = [
  'Create tour packages with a fixed route, duration and price',
  'Publish to the marketplace and take bookings from tourists',
  'Reuse your best itineraries as templates for new packages',
  'Manage availability and booking requests in one dashboard',
];

function Panel({
  eyebrow,
  title,
  body,
  items,
  cta,
  dark,
}: {
  eyebrow: string;
  title: string;
  body: string;
  items: string[];
  cta: string;
  dark?: boolean;
}) {
  return (
    <div
      className={[
        'rounded-[32px] p-10 max-md:p-7 border',
        dark
          ? 'bg-toursl-dark border-toursl-dark text-white'
          : 'bg-toursl-sand border-toursl-line text-toursl-text',
      ].join(' ')}
    >
      <p
        className={[
          'font-display font-medium text-[26px] tracking-[0.02em] mb-4',
          dark ? 'text-white/60' : 'text-toursl-accent',
        ].join(' ')}
      >
        {eyebrow}
      </p>
      <h3 className="font-sans text-[clamp(26px,3vw,34px)] font-medium tracking-[-0.03em] leading-[1.15] mb-4">
        {title}
      </h3>
      <p
        className={[
          'font-sans text-base leading-relaxed mb-8',
          dark ? 'text-white/70' : 'text-toursl-muted',
        ].join(' ')}
      >
        {body}
      </p>

      <ul className="flex flex-col gap-4 mb-10">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <Check
              className={[
                'mt-1 h-[18px] w-[18px] flex-shrink-0',
                dark ? 'text-white' : 'text-toursl-accent',
              ].join(' ')}
            />
            <span
              className={[
                'font-sans text-[15px] leading-relaxed',
                dark ? 'text-white/85' : 'text-toursl-text',
              ].join(' ')}
            >
              {item}
            </span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className={[
          'border-none cursor-pointer font-sans text-[15px] font-medium uppercase tracking-[0.04em] px-6 py-3.5 rounded-full transition-all active:scale-95',
          dark
            ? 'bg-white text-toursl-dark hover:bg-white/85'
            : 'bg-toursl-dark text-[#fafafa] hover:bg-[#333]',
        ].join(' ')}
      >
        {cta}
      </button>
    </div>
  );
}

export default function Audiences() {
  return (
    <section
      id="for-guides"
      className="w-full border-t border-toursl-line bg-white"
    >
      <div className="mx-auto max-w-[1360px] px-20 py-24 max-md:px-6 max-md:py-16">
        <div className="grid grid-cols-2 gap-8 max-md:grid-cols-1">
          <Panel
            eyebrow="For travellers"
            title="Plan the whole trip, not just the flights"
            body="Everything from the first temple to the last train, laid out day by day with the driving between them already worked out."
            items={TOURIST}
            cta="Start Planning"
          />
          <Panel
            eyebrow="For guides"
            title="Turn your routes into bookable packages"
            body="Publish the tours you already run. Travellers find them while planning, and book without leaving the platform."
            items={GUIDE}
            cta="Become a Guide"
            dark
          />
        </div>
      </div>
    </section>
  );
}
