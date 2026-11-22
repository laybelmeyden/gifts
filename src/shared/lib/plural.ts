import type { PluralForms } from '@contracts/i18n';

export function ruPlural(count: number, [one, few, many]: PluralForms) {
  const n = Math.abs(count) % 100;
  const d = n % 10;
  if (n > 10 && n < 20) return many;
  if (d > 1 && d < 5) return few;
  if (d === 1) return one;
  return many;
}
