import { z } from 'zod';
import type { WishlistGift } from './gift';
import { t } from './i18n';

export const WISHLIST_OCCASIONS = ['birthday', 'newyear', 'march8', 'wedding', 'just'] as const;
export const WISHLIST_COVERS = ['cake', 'tree', 'heart', 'star', 'gift'] as const;
export const WISHLIST_VISIBILITIES = ['link', 'friends', 'private'] as const;

export type WishlistOccasion = (typeof WISHLIST_OCCASIONS)[number];
export type WishlistCover = (typeof WISHLIST_COVERS)[number];
export type WishlistVisibility = (typeof WISHLIST_VISIBILITIES)[number];

export const OCCASION_COVERS: Record<WishlistOccasion, WishlistCover> = {
  birthday: 'cake',
  newyear: 'tree',
  march8: 'heart',
  wedding: 'star',
  just: 'gift',
};

export const WISHLIST_TITLE_MAX = 80;

const v = t.createWishlist.validation;

function isIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

export const createWishlistSchema = z.object({
  title: z.string().trim().min(1, v.titleRequired).max(WISHLIST_TITLE_MAX, v.titleMax(WISHLIST_TITLE_MAX)),
  occasion: z.enum(WISHLIST_OCCASIONS),
  date: z.string().refine((value) => value === '' || isIsoDate(value), v.dateFormat),
  cover: z.enum(WISHLIST_COVERS),
  visibility: z.enum(WISHLIST_VISIBILITIES),
});

export type CreateWishlistInput = z.input<typeof createWishlistSchema>;

export type WishlistSummary = {
  id: string;
  title: string;
  occasion: WishlistOccasion;
  cover: WishlistCover;
  /** `YYYY-MM-DD` или null, если дата не задана. */
  date: string | null;
  /** Дней до даты: 0 - сегодня, меньше нуля - уже прошла. */
  daysLeft: number | null;
  giftCount: number;
};

export type WishlistDetail = Omit<WishlistSummary, 'giftCount'> & {
  visibility: WishlistVisibility;
  /** Хозяину видно только число броней, без подарков и имён. */
  bookedCount: number;
  gifts: WishlistGift[];
};
