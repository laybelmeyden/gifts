import { t } from '@contracts/i18n';
import type { SessionUser } from '@contracts/user';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { AppProviders } from '../providers';
import { pixelFont, textFont } from '../styles/fonts';
import '../styles/globals.css';

export const rootMetadata: Metadata = {
  title: {
    default: 'Gifts',
    template: 'Gifts - %s',
  },
  description: t.meta.description,
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
