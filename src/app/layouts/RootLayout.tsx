import type { SessionUser } from '@contracts/user';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { AppProviders } from '../providers';
import { pixelFont } from '../styles/fonts';
import '../styles/globals.css';

export const rootMetadata: Metadata = {
  title: {
    default: 'Gifts',
    template: 'Gifts — %s',
  },
  description: 'Список подарков твоей мечты',
};

export const rootViewport: Viewport = {
  themeColor: '#050208',
};

type RootLayoutProps = {
  user: SessionUser | null;
  children: ReactNode;
};

export function RootLayout({ user, children }: RootLayoutProps) {
  return (
    <html lang="ru" className={pixelFont.variable}>
      <body>
        <div className="stars" aria-hidden="true" />
        <div className="scanlines" aria-hidden="true" />
        <AppProviders user={user}>{children}</AppProviders>
      </body>
    </html>
  );
}
