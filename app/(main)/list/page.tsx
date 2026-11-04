import { BoardPage } from '@pages/board';
import { requireUser } from '@server/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'мой список' };

export default async function MyListRoute() {
  await requireUser();
  return <BoardPage />;
}
