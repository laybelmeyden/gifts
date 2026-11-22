/** Оставляет только цифры и расставляет точки: `24102026` → `24.10.2026`. */
export function maskDate(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)].filter(Boolean).join('.');
}

/** `24.10.2026` → `2026-10-24`; null, если дата введена не полностью. */
export function toIsoDate(value: string) {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value);
  return match ? `${match[3]}-${match[2]}-${match[1]}` : null;
}

export function fromIsoDate(value: string) {
  const [year, month, day] = value.split('-');
  return year && month && day ? `${day}.${month}.${year}` : '';
}
