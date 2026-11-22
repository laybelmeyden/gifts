'use client';

import { t } from '@contracts/i18n';
import type { NavKey } from '@contracts/nav';
import { ApiError } from '@shared/api';
import { cx } from '@shared/lib';
import { useToast } from '@shared/ui';
import { setNavVisibility } from '../api/set-nav-visibility';
import styles from './NavVisibilityToggle.module.css';

type NavVisibilityToggleProps = {
  navKey: NavKey;
  label: string;
  visible: boolean;
  onChange: (key: NavKey, visible: boolean) => void;
  className?: string;
};

export function NavVisibilityToggle({ navKey, label, visible, onChange, className }: NavVisibilityToggleProps) {
  const showToast = useToast();

  async function toggle() {
    const next = !visible;
    onChange(navKey, next);
    try {
      await setNavVisibility({ key: navKey, visible: next });
    } catch (error) {
      onChange(navKey, visible);
      showToast(error instanceof ApiError ? error.message : t.common.networkError);
    }
  }

  return (
    <button
      className={cx(styles.toggle, !visible && styles.hidden, className)}
      type="button"
      aria-pressed={visible}
      aria-label={visible ? t.nav.visibility.hide(label) : t.nav.visibility.show(label)}
      title={visible ? t.nav.visibility.visibleHint : t.nav.visibility.hiddenHint}
      onClick={() => void toggle()}
    >
      <span className={styles.icon} aria-hidden="true" />
    </button>
  );
}
