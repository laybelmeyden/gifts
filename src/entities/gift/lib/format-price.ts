const CURRENCY = /[₽$€£¥]|руб|р\.|usd|eur/i;

/** Цену вводят свободным текстом: к числу без валюты дописываем разряды и ₽, остальное не трогаем. */
export function formatPrice(price: string) {
  const value = price.trim();
  if (CURRENCY.test(value)) return value;

  const plain = value.replace(/[\s\u00a0]/g, '');
  if (/^\d+([.,]\d{1,2})?$/.test(plain)) {
    const [whole, fraction] = plain.split(/[.,]/);
    const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return `${grouped}${fraction ? `,${fraction}` : ''} ₽`;
  }

  return `${value} ₽`;
}

/** Первое число из цены («6 490 ₽» → 6490); null, если чисел нет. */
export function priceValue(price: string | null): number | null {
  const match = price?.replace(/[\s\u00a0]/g, '').match(/\d+([.,]\d+)?/);
  return match ? Number(match[0].replace(',', '.')) : null;
}
