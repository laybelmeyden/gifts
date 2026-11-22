import { t } from '@contracts/i18n';
import styles from './PageLoader.module.css';

export function PageLoader() {
  return (
    <div className={styles.screen} role="status" aria-live="polite">
      <span className={styles.heart} aria-hidden="true" />
      <p className={styles.text}>{t.common.loading}</p>
    </div>
  );
}
