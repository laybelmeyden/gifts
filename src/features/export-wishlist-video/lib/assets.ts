import type { GiftCover } from '@contracts/gift';

const COVER_SRC: Record<GiftCover, string> = {
  gift: '/gift/gift.svg',
  star: '/gift/star.svg',
  heart: '/hero/heart.png',
};

export function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  });
}

export function coverSrc(cover: GiftCover) {
  return COVER_SRC[cover];
}
