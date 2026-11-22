import { t } from '@contracts/i18n';
import { Header } from '@widgets/header';
import styles from './AdminPage.module.css';

export function AdminPage() {
  return (
    <section className={styles.admin}>
      <Header />
      <h1 className={styles.title}>{t.admin.title}</h1>
      <p className="lead">{t.admin.lead}</p>
    </section>
  );
}
