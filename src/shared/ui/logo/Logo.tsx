import { routes } from '@contracts/routes';
import Link from 'next/link';
import { cx } from '../../lib';
import { PixelHeart } from '../pixel-heart/PixelHeart';
import styles from './Logo.module.css';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href={routes.home} className={cx(styles.logo, className)}>
      <PixelHeart className={styles.heart} />
      GIFTS
    </Link>
  );
}
