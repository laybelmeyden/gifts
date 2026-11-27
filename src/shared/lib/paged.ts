'use client';

import { parseAsInteger, useQueryState } from 'nuqs';
import { useLayoutEffect, useRef } from 'react';

const pageQuery = parseAsInteger.withDefault(1).withOptions({ clearOnDefault: true, history: 'replace' });

export function usePaged<T>(items: readonly T[], pageSize: number | null, resetKey: unknown) {
  const [page, setPage] = useQueryState('page', pageQuery);
  const prevKey = useRef(resetKey);

  useLayoutEffect(() => {
    if (prevKey.current === resetKey) return;
    prevKey.current = resetKey;
    void setPage(1);
  }, [resetKey, setPage]);

  const size = Math.max(1, pageSize ?? 1);
  const pageCount = Math.max(1, Math.ceil(items.length / size));
  const safe = Number.isFinite(page) && page >= 1 ? Math.floor(page) : 1;
  const current = Math.min(safe, pageCount);

  useLayoutEffect(() => {
    if (current !== page) void setPage(current);
  }, [current, page, setPage]);

  const start = (current - 1) * size;
  return {
    page: current,
    pageCount,
    items: pageSize == null ? [] : items.slice(start, start + size),
    setPage,
  };
}
