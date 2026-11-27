'use client';

import { t } from '@contracts/i18n';
import type { WishlistDetail } from '@contracts/wishlist';
import { formatPrice } from '@entities/gift';
import { cx, ruPlural } from '@shared/lib';
import { Button, useToast } from '@shared/ui';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { coverSrc, loadImage } from '../lib/assets';
import { drawVideoFrame } from '../lib/draw-frame';
import { downloadBlob, pickRecorderMime, recordCanvas } from '../lib/record';
import { MAX_GIFTS, VIDEO_H, VIDEO_W, videoDuration } from '../lib/timeline';
import { VIDEO_HOOKS, type VideoGift, type VideoHook, type VideoModel } from '../model/types';
import styles from './ExportWishlistVideo.module.css';

const text = t.video;

type ExportWishlistVideoProps = {
  list: WishlistDetail;
  host: string;
};

function giftPool(list: WishlistDetail) {
  const open = list.gifts.filter((gift) => !gift.received);
  return open.length > 0 ? open : list.gifts;
}

function pickGifts(list: WishlistDetail) {
  return giftPool(list).slice(0, MAX_GIFTS);
}

function fonts() {
  const pixel = getComputedStyle(document.body).fontFamily;
  const monoValue = getComputedStyle(document.documentElement).getPropertyValue('--font-text').trim();
  return { pixel, mono: monoValue ? `${monoValue}, monospace` : 'monospace' };
}

export function ExportWishlistVideo({ list, host }: ExportWishlistVideoProps) {
  const showToast = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const clockRef = useRef({ recording: false, startedAt: 0 });
  const modelRef = useRef<VideoModel | null>(null);
  const [hook, setHook] = useState<VideoHook>('guess');
  const [ready, setReady] = useState(false);
  const [recording, setRecording] = useState(false);

  const selected = useMemo(() => pickGifts(list), [list]);
  const duration = videoDuration(selected.length);

  const buildModel = useCallback(
    async (nextHook: VideoHook): Promise<VideoModel> => {
      await document.fonts.ready;
      const icons = new Map(
        await Promise.all(selected.map(async (gift) => [gift.cover, await loadImage(coverSrc(gift.cover))] as const)),
      );
      const gifts: VideoGift[] = await Promise.all(
        selected.map(async (gift) => ({
          title: gift.title,
          priceLabel: gift.price ? formatPrice(gift.price) : null,
          cover: gift.cover,
          photo: gift.imageUrl ? await loadImage(gift.imageUrl) : null,
          icon: icons.get(gift.cover) ?? null,
        })),
      );
      const { pixel, mono } = fonts();
      return {
        title: list.title,
        occasion: t.createWishlist.occasions[list.occasion],
        host,
        hook: text.hook[nextHook],
        brand: t.common.brand,
        cta: text.cta,
        want: text.want,
        pixel,
        mono,
        gifts,
      };
    },
    [host, list.occasion, list.title, selected],
  );

  useEffect(() => {
    let alive = true;
    buildModel(hook).then((model) => {
      if (!alive) return;
      modelRef.current = model;
      setReady(true);
    });
    return () => {
      alive = false;
    };
  }, [buildModel, hook]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !ready) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let frame = 0;

    const tick = (now: number) => {
      const model = modelRef.current;
      if (!model) return;
      const clock = clockRef.current;
      const time = clock.recording
        ? Math.min(duration, (now - clock.startedAt) / 1000)
        : (now / 1000) % Math.max(duration, 0.1);
      drawVideoFrame(ctx, model, time);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration, ready]);

  async function download() {
    const canvas = canvasRef.current;
    const model = modelRef.current;
    if (!canvas || !model || recording) return;

    const mimeType = pickRecorderMime();
    if (!mimeType) {
      showToast(text.unsupported);
      return;
    }

    setRecording(true);
    clockRef.current = { recording: true, startedAt: performance.now() };
    const { recorder, done } = recordCanvas(canvas, mimeType);

    try {
      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, duration * 1000 + 250);
      });
      if (recorder.state !== 'inactive') recorder.stop();
      const blob = await done;
      downloadBlob(blob, `pixelgifts-${list.id.slice(0, 8)}.webm`);
      showToast(text.done);
    } catch {
      if (recorder.state !== 'inactive') recorder.stop();
      showToast(text.failed);
    } finally {
      clockRef.current = { recording: false, startedAt: 0 };
      setRecording(false);
    }
  }

  const capped = giftPool(list).length > MAX_GIFTS;

  return (
    <div className={styles.layout}>
      <div className={styles.preview}>
        <canvas ref={canvasRef} className={styles.stage} width={VIDEO_W} height={VIDEO_H} aria-label={text.title} />
      </div>

      <div className={styles.panel}>
        <p className={styles.lead}>{text.lead}</p>
        <p className={styles.meta}>
          {capped ? text.giftsCap : text.giftsUsed(selected.length, ruPlural(selected.length, text.gifts))}
        </p>

        {selected.length > 0 ? (
          <>
            <div className={styles.hooks} role="radiogroup" aria-label={text.hooks}>
              {VIDEO_HOOKS.map((item) => (
                <button
                  key={item}
                  className={cx('px', styles.chip, hook === item && styles.chipOn)}
                  type="button"
                  role="radio"
                  aria-checked={hook === item}
                  disabled={recording}
                  onClick={() => setHook(item)}
                >
                  {text.hook[item]}
                </button>
              ))}
            </div>
            <Button variant="pink" disabled={!ready || recording} loading={recording} onClick={() => void download()}>
              {recording ? text.recording : text.download}
            </Button>
          </>
        ) : (
          <p className={styles.empty}>{text.empty}</p>
        )}
      </div>
    </div>
  );
}
