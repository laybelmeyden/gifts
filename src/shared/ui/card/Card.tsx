import type { ReactNode } from 'react';
import { cx } from '../../lib';
import { Panel } from '../panel/Panel';
import styles from './Card.module.css';

type CardProps = {
  kicker?: string;
  title?: string;
  className?: string;
  children?: ReactNode;
};

export function Card({ kicker, title, className, children }: CardProps) {
  return (
    <Panel className={cx(styles.card, className)}>
      {kicker && <p className="kicker">{kicker}</p>}
      {title && <h1 className={styles.title}>{title}</h1>}
      {children}
    </Panel>
  );
}
