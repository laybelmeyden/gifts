import type { ReactNode } from 'react';
import { cx } from '../../lib';
import { Panel } from '../panel/Panel';
import styles from './Card.module.css';

type CardProps = {
  /** Декор над заголовком, например HeartField. */
  cover?: ReactNode;
  kicker?: string;
  title?: string;
  className?: string;
  children?: ReactNode;
};

export function Card({ cover, kicker, title, className, children }: CardProps) {
  return (
    <Panel className={cx(styles.card, className)}>
      {cover}
      {kicker && <p className="kicker">{kicker}</p>}
      {title && <h1 className={styles.title}>{title}</h1>}
      {children}
    </Panel>
  );
}
