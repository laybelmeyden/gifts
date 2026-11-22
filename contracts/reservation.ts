import { z } from 'zod';
import type { GiftCover, GiftDetail, WishlistGift } from './gift';
import { t } from './i18n';
import type { WishlistDetail } from './wishlist';

export const RESERVATION_NAME_MAX = 60;

const v = t.reserve.validation;

export const reserveGiftSchema = z.object({
  name: z.string().trim().min(1, v.nameRequired).max(RESERVATION_NAME_MAX, v.nameMax(RESERVATION_NAME_MAX)),
  anonymous: z.boolean(),
});

export type ReserveGiftInput = z.input<typeof reserveGiftSchema>;

export const updateReservationSchema = z.object({ purchased: z.boolean() });

export type UpdateReservationInput = z.input<typeof updateReservationSchema>;

/** Как подарок выглядит для гостя: `mine` - забронировал сам смотрящий. */
export type GiftStatus = 'free' | 'booked' | 'mine' | 'received';

export type SharedGift = WishlistGift & { status: GiftStatus };

export type SharedWishlist = Omit<WishlistDetail, 'visibility' | 'bookedCount' | 'gifts'> & {
  ownerName: string;
  gifts: SharedGift[];
};

export type SharedGiftDetail = GiftDetail & { status: GiftStatus; ownerName: string };

/** Подарок из раздела «Я дарю». */
export type GivingGift = {
  giftId: string;
  wishlistId: string;
  wishlistTitle: string;
  ownerName: string;
  title: string;
  price: string | null;
  cover: GiftCover;
  imageUrl: string | null;
  received: boolean;
  /** Дарящий отметил «Купила». */
  purchased: boolean;
  /** `YYYY-MM-DD` праздника или null. */
  date: string | null;
  /** Дней до праздника: 0 - сегодня, меньше нуля - уже прошёл. */
  daysLeft: number | null;
};
