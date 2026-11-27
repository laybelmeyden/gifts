'use client';

import type { ReactNode, Ref } from 'react';
import { cx } from '../../lib';
import { PageLoader } from '../page-loader/PageLoader';
import styles from './FitGrid.module.css';

type FitGridProps = {
  ready: boolean;
  /** Одна колонка: сетка по контенту, крутится общий скролл. */
  flow?: boolean;
  gridRef: Ref<HTMLDivElement | null>;
  className?: string;
  children: ReactNode;
};

/** Сетка занимает место сразу, карточки — после замера. Пока меряем, лоадер. */
export function FitGrid({ ready, flow = false, gridRef, className, children }: FitGridProps) {
  return (
    <div className={cx(styles.wrap, ready && flow && styles.flow)}>
      <div ref={gridRef} className={className}>
        {ready ? children : null}
      </div>
      {ready ? null : <PageLoader embed />}
    </div>
  );
}
