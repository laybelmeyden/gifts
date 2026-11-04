import { RootLayout, rootMetadata, rootViewport } from '@app/layouts';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = rootMetadata;
export const viewport: Viewport = rootViewport;

export default function Layout({ children }: { children: ReactNode }) {
  return <RootLayout user={null}>{children}</RootLayout>;
}
