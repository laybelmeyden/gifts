export const VIDEO_W = 1080;
export const VIDEO_H = 1920;
export const VIDEO_FPS = 30;
export const INTRO_SEC = 2.6;
export const GIFT_SEC = 2.3;
export const OUTRO_SEC = 3.4;
export const MAX_GIFTS = 6;

export function videoDuration(giftCount: number) {
  return INTRO_SEC + giftCount * GIFT_SEC + OUTRO_SEC;
}

export type VideoScene = { kind: 'intro' | 'outro'; local: number } | { kind: 'gift'; index: number; local: number };

export function sceneAt(time: number, giftCount: number): VideoScene {
  if (time < INTRO_SEC) return { kind: 'intro', local: time };
  const giftStart = INTRO_SEC;
  const giftsEnd = giftStart + giftCount * GIFT_SEC;
  if (time < giftsEnd && giftCount > 0) {
    const into = time - giftStart;
    const index = Math.min(giftCount - 1, Math.floor(into / GIFT_SEC));
    return { kind: 'gift', index, local: into - index * GIFT_SEC };
  }
  return { kind: 'outro', local: time - giftsEnd };
}
