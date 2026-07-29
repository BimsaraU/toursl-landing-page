const COLUMNS = [
  {
    heading: 'Platform',
    links: ['Itinerary planner', 'Tour packages', 'Route calculator', 'Pricing'],
  },
  {
    heading: 'Guides',
    links: ['Become a guide', 'Publishing rules', 'Payouts', 'Guide support'],
  },
  {
    heading: 'Company',
    links: ['About', 'Contact', 'Privacy', 'Terms'],
  },
];

export default function Footer() {
  return (
    <footer className="w-full bg-toursl-dark text-white">
      <div className="mx-auto max-w-[1360px] px-20 py-16 max-md:px-6 max-md:py-12">
        <div className="flex justify-between gap-12 max-md:flex-col">
          <div className="max-w-[320px]">
            <span className="font-display text-[36px] leading-none select-none">
              toursl
            </span>
            <p className="mt-4 font-sans text-[15px] text-white/60 leading-relaxed">
              Tour planning and guide bookings for Sri Lanka: itineraries,
              routes and packages in one platform.
            </p>
          </div>

          <div className="flex gap-16 max-md:gap-10 max-md:flex-wrap">
            {COLUMNS.map(({ heading, links }) => (
              <div key={heading}>
                <p className="font-sans text-[13px] font-medium uppercase tracking-[0.08em] text-white/50 mb-4">
                  {heading}
                </p>
                <ul className="flex flex-col gap-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="font-sans text-[15px] text-white/85 transition-opacity hover:opacity-55"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 border-t border-white/15 pt-6">
          <p className="font-sans text-sm text-white/50">
            © {new Date().getFullYear()} TourSL. Made for travellers and guides
            in Sri Lanka.
          </p>
        </div>
      </div>
    </footer>
  );
}
