import type { GiftCover } from '@contracts/gift';

export const VIDEO_HOOKS = ['guess', 'instead', 'newyear', 'book', 'thirty'] as const;

export type VideoHook = (typeof VIDEO_HOOKS)[number];

export type VideoGift = {
  title: string;
  priceLabel: string | null;
  cover: GiftCover;
  photo: HTMLImageElement | null;
  icon: HTMLImageElement | null;
};

export type VideoModel = {
  title: string;
  occasion: string;
  host: string;
  hook: string;
  brand: string;
  cta: string;
  want: string;
  pixel: string;
  mono: string;
  gifts: VideoGift[];
};
