import { Header } from '@widgets/header';
import styles from './AdminPage.module.css';

export function AdminPage() {
  return (
    <section className={styles.admin}>
      <Header />
      <h1 className={styles.title}>Админка</h1>
      <p className="lead">Поиск по почте и одноразовые ссылки для сброса пароля.</p>
    </section>
  );
}
