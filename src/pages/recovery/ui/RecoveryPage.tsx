import { routes } from '@shared/config';
import { ButtonLink, Card } from '@shared/ui';

export function RecoveryPage() {
  return (
    <div className="center-screen">
    <Card kicker="Восстановление" title="Забыли пароль?">
      <p className="quote">Сброс по коду восстановления появится следующим шагом. Писем не будет.</p>
      <ButtonLink variant="link" block href={routes.signIn}>
        Вернуться ко входу
      </ButtonLink>
    </Card>
    </div>
  );
}
