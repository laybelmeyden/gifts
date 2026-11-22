import { t } from '@contracts/i18n';
import { BoardPage } from '@pages/board';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: t.meta.titles.board };

type UserListRouteProps = {
  params: Promise<{ userId: string }>;
};

export default async function UserListRoute({ params }: UserListRouteProps) {
  const { userId } = await params;
  return <BoardPage userId={userId} />;
}
