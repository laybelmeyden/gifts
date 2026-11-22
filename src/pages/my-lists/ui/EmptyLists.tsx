import { t } from '@contracts/i18n';
import { SoonButton } from '@shared/ui';
import { HeroScene } from '@widgets/hero-scene';
import styles from './EmptyLists.module.css';

export function EmptyLists({ name }: { name: string }) {
  const first = name.trim().split(/\s+/)[0] || t.common.defaultName;

  return (
    <section className={styles.page}>
      <h1>{t.myLists.greeting(first)}</h1>
      <div className={styles.center}>
        <HeroScene empty />
        <h2>{t.myLists.emptyTitle}</h2>
        <p>{t.myLists.emptyText}</p>
        <SoonButton>
          <span className={styles.plus} aria-hidden="true" />
          {t.myLists.createFirst}
        </SoonButton>
      </div>
    </section>
  );
}
