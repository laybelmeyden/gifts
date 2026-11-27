import type { VideoGift, VideoModel } from '../model/types';
import { GIFT_SEC, INTRO_SEC, OUTRO_SEC, VIDEO_H, VIDEO_W, sceneAt } from './timeline';

const BG = '#07040d';
const CARD = '#140c24';
const INK = '#f6f1ff';
const MUTED = '#a99ccb';
const LINE = '#4a3775';
const PINK = '#ff4d9a';
const LILAC = '#b9a3ff';
const HEART = {
  top: '#e9d5ff',
  body: '#c084fc',
  shine: '#f5f3ff',
  row3: '#a855f7',
  row4: '#7c3aed',
  tip: '#5b21b6',
} as const;

const STARS = Array.from({ length: 70 }, (_, i) => {
  const seed = ((i + 1) * 16807) % 2147483647;
  return {
    x: (seed % VIDEO_W) + 0.5,
    y: ((seed * 13) % VIDEO_H) + 0.5,
    size: seed % 5 === 0 ? 3 : 2,
    phase: (seed % 628) / 100,
  };
});

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function easeOut(value: number) {
  const t = clamp01(value);
  return 1 - (1 - t) ** 3;
}

function appear(local: number, duration: number) {
  const fadeIn = 0.22;
  const fadeOut = 0.18;
  if (local < fadeIn) return easeOut(local / fadeIn);
  if (local > duration - fadeOut) return easeOut((duration - local) / fadeOut);
  return 1;
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width <= maxWidth) {
      line = next;
      continue;
    }
    if (line) lines.push(line);
    if (ctx.measureText(word).width <= maxWidth) {
      line = word;
      continue;
    }
    let chunk = '';
    for (const char of word) {
      if (ctx.measureText(chunk + char).width <= maxWidth) chunk += char;
      else {
        if (chunk) lines.push(chunk);
        chunk = char;
      }
    }
    line = chunk;
  }
  if (line) lines.push(line);
  return lines;
}

function fillLines(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  x: number,
  y: number,
  lineHeight: number,
  align: CanvasTextAlign,
) {
  ctx.textAlign = align;
  lines.forEach((line, index) => ctx.fillText(line, x, y + index * lineHeight));
}

function drawStars(ctx: CanvasRenderingContext2D, time: number) {
  for (const star of STARS) {
    const twinkle = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(time * 2.2 + star.phase));
    ctx.fillStyle = `rgba(196, 181, 253, ${twinkle})`;
    ctx.fillRect(star.x, star.y, star.size, star.size);
  }
}

function drawPixelHeart(ctx: CanvasRenderingContext2D, left: number, top: number, cell: number) {
  const rect = (x: number, y: number, w: number, h: number, fill: string) => {
    ctx.fillStyle = fill;
    ctx.fillRect(left + x * cell, top + y * cell, w * cell, h * cell);
  };
  rect(0, 1, 7, 2, HEART.body);
  rect(1, 0, 2, 1, HEART.top);
  rect(4, 0, 2, 1, HEART.top);
  rect(2, 1, 1, 1, HEART.shine);
  rect(1, 3, 5, 1, HEART.row3);
  rect(2, 4, 3, 1, HEART.row4);
  rect(3, 5, 1, 1, HEART.tip);
}

function pixelBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  fill: string | null,
  line: string,
) {
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fillRect(x, y, w, h);
  }
  ctx.fillStyle = line;
  ctx.fillRect(x, y, w, 8);
  ctx.fillRect(x, y + h - 8, w, 8);
  ctx.fillRect(x, y, 8, h);
  ctx.fillRect(x + w - 8, y, 8, h);
  ctx.fillStyle = BG;
  ctx.fillRect(x, y, 8, 8);
  ctx.fillRect(x + w - 8, y, 8, 8);
  ctx.fillRect(x, y + h - 8, 8, 8);
  ctx.fillRect(x + w - 8, y + h - 8, 8, 8);
}

const tintedIcons = new WeakMap<HTMLImageElement, HTMLCanvasElement>();

function tintedIcon(image: HTMLImageElement) {
  const cached = tintedIcons.get(image);
  if (cached) return cached;
  const size = 128;
  const offscreen = document.createElement('canvas');
  offscreen.width = size;
  offscreen.height = size;
  const ink = offscreen.getContext('2d');
  if (!ink) return image;
  ink.drawImage(image, 0, 0, size, size);
  ink.globalCompositeOperation = 'source-in';
  ink.fillStyle = '#e6dcff';
  ink.fillRect(0, 0, size, size);
  tintedIcons.set(image, offscreen);
  return offscreen;
}

function drawCover(ctx: CanvasRenderingContext2D, gift: VideoGift, x: number, y: number, w: number, h: number) {
  ctx.fillStyle = '#22183c';
  ctx.fillRect(x, y, w, h);
  if (gift.photo) {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    const image = gift.photo;
    const scale = Math.max(w / image.width, h / image.height);
    const dw = image.width * scale;
    const dh = image.height * scale;
    ctx.drawImage(image, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
    return;
  }
  if (!gift.icon) return;
  ctx.imageSmoothingEnabled = false;
  const icon = tintedIcon(gift.icon);
  const size = Math.min(w, h) * 0.28;
  ctx.drawImage(icon, x + (w - size) / 2, y + (h - size) / 2, size, size);
}

function drawIntro(ctx: CanvasRenderingContext2D, model: VideoModel, local: number) {
  const alpha = appear(local, INTRO_SEC);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(0, (1 - alpha) * 36);

  const heartW = 14 * 7;
  drawPixelHeart(ctx, (VIDEO_W - heartW) / 2, 280, 14);

  ctx.fillStyle = INK;
  ctx.font = `72px ${model.pixel}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(model.brand, VIDEO_W / 2, 430);

  ctx.fillStyle = INK;
  ctx.font = `64px ${model.pixel}`;
  const hook = wrapLines(ctx, model.hook, VIDEO_W - 160);
  fillLines(ctx, hook.slice(0, 4), VIDEO_W / 2, 620, 78, 'center');

  ctx.fillStyle = MUTED;
  ctx.font = `28px ${model.mono}`;
  ctx.fillText(model.occasion.toUpperCase(), VIDEO_W / 2, 1180);

  ctx.fillStyle = LILAC;
  ctx.font = `48px ${model.pixel}`;
  const title = wrapLines(ctx, model.title, VIDEO_W - 180);
  fillLines(ctx, title.slice(0, 3), VIDEO_W / 2, 1240, 58, 'center');

  ctx.restore();
}

function drawGift(ctx: CanvasRenderingContext2D, model: VideoModel, gift: VideoGift, local: number) {
  const alpha = appear(local, GIFT_SEC);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(0, (1 - alpha) * 48);

  ctx.fillStyle = PINK;
  ctx.font = `36px ${model.mono}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(model.want.toUpperCase(), VIDEO_W / 2, 200);

  const cardX = 90;
  const cardY = 300;
  const cardW = VIDEO_W - 180;
  const cardH = 1280;
  pixelBox(ctx, cardX, cardY, cardW, cardH, CARD, LINE);

  const photoH = 860;
  drawCover(ctx, gift, cardX + 8, cardY + 8, cardW - 16, photoH);

  ctx.fillStyle = INK;
  ctx.font = `44px ${model.pixel}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  const title = wrapLines(ctx, gift.title, cardW - 80);
  fillLines(ctx, title.slice(0, 3), cardX + 40, cardY + photoH + 48, 54, 'left');

  if (gift.priceLabel) {
    ctx.fillStyle = PINK;
    ctx.font = `52px ${model.pixel}`;
    ctx.fillText(gift.priceLabel, cardX + 40, cardY + photoH + 48 + title.slice(0, 3).length * 54 + 16);
  }

  ctx.restore();
}

function drawOutro(ctx: CanvasRenderingContext2D, model: VideoModel, local: number) {
  const alpha = appear(local, OUTRO_SEC);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(0, (1 - alpha) * 28);

  const heartW = 16 * 7;
  drawPixelHeart(ctx, (VIDEO_W - heartW) / 2, 420, 16);

  ctx.fillStyle = INK;
  ctx.font = `56px ${model.pixel}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  const cta = wrapLines(ctx, model.cta, VIDEO_W - 160);
  fillLines(ctx, cta.slice(0, 3), VIDEO_W / 2, 620, 70, 'center');

  ctx.fillStyle = PINK;
  ctx.font = `64px ${model.pixel}`;
  ctx.fillText(model.host, VIDEO_W / 2, 920);

  ctx.fillStyle = MUTED;
  ctx.font = `28px ${model.mono}`;
  ctx.fillText(model.brand, VIDEO_W / 2, 1040);

  ctx.restore();
}

export function drawVideoFrame(ctx: CanvasRenderingContext2D, model: VideoModel, time: number) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, VIDEO_W, VIDEO_H);
  drawStars(ctx, time);
  pixelBox(ctx, 28, 28, VIDEO_W - 56, VIDEO_H - 56, null, LINE);

  const scene = sceneAt(time, model.gifts.length);
  if (scene.kind === 'intro') drawIntro(ctx, model, scene.local);
  else if (scene.kind === 'gift') drawGift(ctx, model, model.gifts[scene.index], scene.local);
  else drawOutro(ctx, model, scene.local);
}
