import { t } from '@contracts/i18n';
import type { SessionUser } from '@contracts/user';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { AppProviders } from '../providers';
import { pixelFont, textFont } from '../styles/fonts';
import '../styles/globals.css';

function siteUrl() {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

const SITE_NAME = 'Gifts';

/** Картинку рисует `app/opengraph-image.tsx`; сюда она не подтягивается сама, если страница задаёт свой openGraph. */
const SHARE_IMAGE = { url: '/opengraph-image', width: 1200, height: 630, alt: t.meta.imageAlt, type: 'image/png' };

/** openGraph и twitter при слиянии заменяются целиком, поэтому страницы собирают их через эту функцию. */
export function shareMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    openGraph: { type: 'website', siteName: SITE_NAME, locale: 'ru_RU', title, description, images: [SHARE_IMAGE] },
    twitter: { card: 'summary_large_image', title, description, images: [SHARE_IMAGE] },
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  ...shareMetadata(SITE_NAME, t.meta.lead),
  title: {
    default: SITE_NAME,
    template: `${SITE_NAME} - %s`,
  },
};

export const rootViewport: Viewport = {
  themeColor: '#07040d',
};

type RootLayoutProps = {
  user: SessionUser | null;
  children: ReactNode;
};

export function RootLayout({ user, children }: RootLayoutProps) {
  return (
    <html lang="ru" className={`${pixelFont.variable} ${textFont.variable}`}>
      <body>
        <div className="stars" aria-hidden="true" />
        <AppProviders user={user}>{children}</AppProviders>
      </body>
    </html>
  );
}
