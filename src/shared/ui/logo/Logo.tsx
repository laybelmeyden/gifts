import { t } from '@contracts/i18n';
import { routes } from '@contracts/routes';
import Link from 'next/link';
import { cx } from '../../lib';
import { PixelHeart } from '../pixel-heart/PixelHeart';
import styles from './Logo.module.css';

export function Logo({ className, href = routes.home }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cx(styles.logo, className)}>
      <PixelHeart className={styles.heart} />
      {t.common.brand}
    </Link>
  );
}
