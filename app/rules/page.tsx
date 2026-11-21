import { RulesPage } from '@pages/rules';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'пользовательское соглашение' };

export default function RulesRoute() {
  return <RulesPage />;
}
