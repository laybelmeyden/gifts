import { t } from '@contracts/i18n';
import { RulesPage } from '@pages/rules';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: t.meta.titles.rules };

export default function RulesRoute() {
  return <RulesPage />;
}
