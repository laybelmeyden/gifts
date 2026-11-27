import { t } from '@contracts/i18n';
import { cx } from '../../lib';
import styles from './PageLoader.module.css';

export function PageLoader({ embed = false }: { embed?: boolean } = {}) {
  return (
    <div className={cx(styles.screen, embed && styles.embed)} role="status" aria-live="polite">
      <span className={styles.heart} aria-hidden="true" />
      <p className={styles.text}>{t.common.loading}</p>
    </div>
  );
}
