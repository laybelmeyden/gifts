import { BoardPage } from '@pages/board';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'мой список' };

export default function MyListRoute() {
  return <BoardPage />;
}
