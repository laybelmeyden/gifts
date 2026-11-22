import { t } from '@contracts/i18n';
import { AuthLayout } from '@app/layouts';
import { NotFoundPage } from '@pages/not-found';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: t.meta.titles.notFound };

export default function NotFound() {
  return (
    <AuthLayout>
      <NotFoundPage />
    </AuthLayout>
  );
}
