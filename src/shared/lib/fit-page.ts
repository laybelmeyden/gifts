'use client';

import { useLayoutEffect, useState, type RefObject } from 'react';

export type TileSize = {
  minWidth: number;
  minHeight: number;
};

export type FitPage = {
  pageSize: number;
  columns: number;
};

/** Высота/ширина слота, а не контента: пустая сетка не схлопывается в 1 ряд. */
function slotSize(el: HTMLElement) {
  const wrap = el.parentElement ?? el;
  return {
    width: el.clientWidth || wrap.clientWidth,
    height: Math.max(el.clientHeight, wrap.clientHeight),
  };
}

function columnCount(el: HTMLElement, width: number, minWidth: number) {
  const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
  return Math.max(1, Math.floor((width + gap) / (minWidth + gap)));
}

export function fitPageSize(el: HTMLElement, tile: TileSize, singleColumnPageSize?: number): FitPage | null {
  const { width, height } = slotSize(el);
  if (width < 1) return null;
  const cols = columnCount(el, width, tile.minWidth);
  if (singleColumnPageSize && cols <= 1) return { pageSize: singleColumnPageSize, columns: cols };
  if (height < 1) return null;
  const gapY = parseFloat(getComputedStyle(el).rowGap) || 0;
  const rows = Math.max(1, Math.floor((height + gapY) / (tile.minHeight + gapY)));
  return { pageSize: cols * rows, columns: cols };
}

type FitPageOptions = {
  /** Не дергать размер страницы на каждый пиксель ресайза — карточки не мигают. */
  delay?: number;
  /** Одна колонка: не считать ряды по высоте, а показать столько карточек. */
  singleColumnPageSize?: number;
};

export function useFitPageSize(ref: RefObject<HTMLElement | null>, tile: TileSize, options: FitPageOptions = {}) {
  const { delay = 160, singleColumnPageSize } = options;
  const [fit, setFit] = useState<FitPage | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    let ready = false;
    let timer = 0;

    const apply = () => {
      const next = fitPageSize(el, tile, singleColumnPageSize);
      if (next == null) return false;
      ready = true;
      setFit((current) =>
        current && current.pageSize === next.pageSize && current.columns === next.columns ? current : next,
      );
      return true;
    };

    apply();

    const observer = new ResizeObserver(() => {
      if (!ready) {
        apply();
        return;
      }
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        apply();
      }, delay);
    });
    observer.observe(el);
    if (el.parentElement) observer.observe(el.parentElement);

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, [ref, tile, delay, singleColumnPageSize]);

  return { pageSize: fit?.pageSize ?? null, columns: fit?.columns ?? 0 };
}
