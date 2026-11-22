import { z } from 'zod';
import { t } from './i18n';

export const GIFT_CATEGORIES = [
  'home',
  'clothes',
  'beauty',
  'tech',
  'books',
  'hobby',
  'food',
  'experience',
  'other',
] as const;
export const GIFT_DESIRES = ['want', 'really', 'dream'] as const;
export const GIFT_COVERS = ['gift', 'star', 'heart'] as const;

export type GiftCategory = (typeof GIFT_CATEGORIES)[number];
export type GiftDesire = (typeof GIFT_DESIRES)[number];
export type GiftCover = (typeof GIFT_COVERS)[number];

export const GIFT_TITLE_MAX = 120;
export const GIFT_PRICE_MAX = 30;
export const GIFT_COMMENT_MAX = 500;
export const GIFT_URL_MAX = 2000;
/** Фото хранится data URL-ом прямо в базе, поэтому держим его маленьким. */
export const GIFT_PHOTO_MAX = 400_000;

const v = t.addGift.validation;

const productUrlSchema = z
  .string()
  .trim()
  .max(GIFT_URL_MAX, v.urlFormat)
  .transform((value) => (value && !/^https?:\/\//i.test(value) ? `https://${value}` : value))
  .refine((value) => value === '' || z.url().safeParse(value).success, v.urlFormat);

const photoSchema = z
  .string()
  .max(GIFT_PHOTO_MAX, v.photoTooBig)
  .refine((value) => value === '' || /^data:image\/(png|jpeg|webp);base64,[a-z0-9+/=]+$/i.test(value), v.photoFormat);

const giftFields = {
  productUrl: productUrlSchema,
  title: z.string().trim().min(1, v.titleRequired).max(GIFT_TITLE_MAX, v.titleMax(GIFT_TITLE_MAX)),
  price: z.string().trim().max(GIFT_PRICE_MAX, v.priceMax(GIFT_PRICE_MAX)),
  category: z.enum(GIFT_CATEGORIES),
  desire: z.enum(GIFT_DESIRES),
  comment: z.string().trim().max(GIFT_COMMENT_MAX, v.commentMax(GIFT_COMMENT_MAX)),
  cover: z.enum(GIFT_COVERS),
  photo: photoSchema,
};

export const createGiftSchema = z.object({ wishlistId: z.uuid(t.api.notFound), ...giftFields });

export type CreateGiftInput = z.input<typeof createGiftSchema>;

export const updateGiftSchema = z
  .object({ ...giftFields, received: z.boolean() })
  .partial()
  .refine((value) => Object.values(value).some((field) => field !== undefined), t.api.checkFields);

export type UpdateGiftInput = z.input<typeof updateGiftSchema>;

export type WishlistGift = {
  id: string;
  title: string;
  price: string | null;
  productUrl: string | null;
  category: GiftCategory;
  desire: GiftDesire;
  cover: GiftCover;
  imageUrl: string | null;
  received: boolean;
};

export type GiftDetail = WishlistGift & {
  wishlistId: string;
  wishlistTitle: string;
  comment: string | null;
};

/** Бронь, которую видит хозяин: `name` = null, если дарящий выбрал «Анонимно». */
export type GiftBooking = { name: string | null };

export type OwnerGift = WishlistGift & { booking: GiftBooking | null };

export type OwnerGiftDetail = GiftDetail & { booking: GiftBooking | null };
