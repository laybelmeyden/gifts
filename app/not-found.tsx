import { AuthLayout } from '@app/layouts';
import { NotFoundPage } from '@pages/not-found';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'страница не найдена' };

export default function NotFound() {
  return (
    <AuthLayout>
      <NotFoundPage />
    </AuthLayout>
  );
}
