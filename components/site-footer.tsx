import Link from 'next/link';

const footerLinks = [
  { label: 'AbeBooks', href: 'https://www.abebooks.com/antiquarian-book-company-miami-fl-u.s.a/63474458/sf' },
  { label: 'Ebay', href: 'https://www.ebay.com/str/lunacanecollectibles?_trksid=p4429486.m3561.l161211' }
];

export const SiteFooter = () => (
  <footer className="border-t border-black/10 bg-white/70">
    <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-black/60 sm:flex-row sm:items-center sm:justify-between">
      <p>(c) {new Date().getFullYear()} Antiquarium Books Co</p>
      <div className="flex flex-wrap gap-4 uppercase tracking-widest">
        {footerLinks.map((link) => (
          <Link key={link.href} href={link.href} className="hover:text-ink">
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  </footer>
);
