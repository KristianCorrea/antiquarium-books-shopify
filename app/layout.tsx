import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { clsx } from 'clsx';
import { siteConfig } from '@/lib/site-config';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export const metadata: Metadata = {
  metadataBase: siteConfig.metadataBase,
  title: {
    default: `${siteConfig.name} - Vintage Books & Antiques`,
    template: `%s - ${siteConfig.name}`
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.metadataBase,
    siteName: siteConfig.name,
    locale: 'en_US',
    type: 'website'
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={clsx('min-h-screen bg-parchment text-ink')}> 
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1 px-4 pb-16 pt-10 sm:px-8 lg:px-16">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
