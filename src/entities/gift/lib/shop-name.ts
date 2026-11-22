/** `https://www.ozon.ru/product/...` → `ozon.ru`. */
export function shopName(url: string | null) {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}
