import Link from 'next/link';

const footerLinks = [
  { label: 'Customer Care', href: '/support' },
  { label: 'Press & Provenance', href: '/press' },
  { label: 'Authentication Process', href: '/authentication' }
];

export const SiteFooter = () => (
  <footer className="border-t border-black/10 bg-white/70">
    <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-black/60 sm:flex-row sm:items-center sm:justify-between">
      <p>(c) {new Date().getFullYear()} Atelier Scriptorium - Provenance guaranteed.</p>
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
