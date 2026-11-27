export { routes, safeNext, withNext } from '@contracts/routes';

export const API_BASE = '/api';

/** Размер ячейки сетки, чтобы на страницу влезало сколько влезает до скролла. */
export const TILE = {
  wishlist: { minWidth: 279, minHeight: 240 },
  giftRow: { minWidth: 509, minHeight: 100 },
  giftCard: { minWidth: 172, minHeight: 220 },
} as const;

/** Ниже этой ширины окна вишлисты — одна колонка на всю ширину, по 5 на странице. */
export const WISHLIST_STACK_AT = 930;
export const WISHLIST_STACK_PAGE_SIZE = 5;
