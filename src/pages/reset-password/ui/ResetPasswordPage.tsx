import { routes } from '@shared/config';
import { ButtonLink, Card } from '@shared/ui';

export function ResetPasswordPage() {
  return (
    <Card kicker="Сброс пароля" title="Новый пароль">
      <p className="quote">Ссылка одноразовая и действует 24 часа.</p>
      <ButtonLink variant="link" block href={routes.signIn}>
        Вернуться ко входу
      </ButtonLink>
    </Card>
  );
}
