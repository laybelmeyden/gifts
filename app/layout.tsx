import { RootLayout, rootMetadata, rootViewport } from '@app/layouts';
import { getSessionUser } from '@server/auth';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = rootMetadata;
export const viewport: Viewport = rootViewport;

export default async function Layout({ children }: { children: ReactNode }) {
  const user = await getSessionUser();
  return <RootLayout user={user}>{children}</RootLayout>;
}
