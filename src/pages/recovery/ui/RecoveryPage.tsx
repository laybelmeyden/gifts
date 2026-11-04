import { routes } from '@shared/config';
import { ButtonLink, Card } from '@shared/ui';

export function RecoveryPage() {
  return (
    <Card kicker="Восстановление" title="Забыли пароль">
      <p className="quote">Введите почту, один из кодов восстановления и новый пароль.</p>
      <ButtonLink variant="link" block href={routes.signIn}>
        Вернуться ко входу
      </ButtonLink>
    </Card>
  );
}
