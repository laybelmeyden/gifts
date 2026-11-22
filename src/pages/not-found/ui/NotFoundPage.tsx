import { t } from '@contracts/i18n';
import { routes } from '@shared/config';
import { ButtonLink } from '@shared/ui';
import { HeroScene } from '@widgets/hero-scene';
import styles from './NotFoundPage.module.css';

export function NotFoundPage() {
  return (
    <section className={styles.page}>
      <HeroScene empty />
      <p className={styles.code}>404</p>
      <h1>{t.notFound.title}</h1>
      <p className={styles.text}>{t.notFound.text}</p>
      <ButtonLink href={routes.home}>
        <span className={styles.home} aria-hidden="true" />
        {t.common.toHome}
      </ButtonLink>
    </section>
  );
}
