import type { WishlistCover } from '@contracts/wishlist';
import { cx } from '@shared/lib';
import styles from './CoverIcon.module.css';

type CoverIconProps = {
  cover: WishlistCover;
  className?: string;
};

export function CoverIcon({ cover, className }: CoverIconProps) {
  return <span className={cx(styles.icon, styles[cover], className)} aria-hidden="true" />;
}
