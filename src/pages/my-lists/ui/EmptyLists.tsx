import type { ManagedUser } from '@contracts/admin';
import { t } from '@contracts/i18n';
import { CreateWishlistButton } from '@features/create-wishlist';
import { HeroScene } from '@widgets/hero-scene';
import styles from './EmptyLists.module.css';

export function EmptyLists({ name, managedUser }: { name: string; managedUser?: ManagedUser }) {
  const first = name.trim().split(/\s+/)[0] || t.common.defaultName;

  return (
    <section className={styles.page}>
      <h1>{managedUser ? t.admin.userLists(managedUser.name) : t.myLists.greeting(first)}</h1>
      <div className={styles.center}>
        <HeroScene empty />
        <h2>{managedUser ? t.admin.noLists : t.myLists.emptyTitle}</h2>
        {!managedUser && (
          <>
            <p>{t.myLists.emptyText}</p>
            <CreateWishlistButton>
              <span className={styles.plus} aria-hidden="true" />
              {t.myLists.createFirst}
            </CreateWishlistButton>
          </>
        )}
      </div>
    </section>
  );
}
