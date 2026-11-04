import { routes } from '@shared/config';
import { ButtonLink, Card } from '@shared/ui';

export function SignInPage() {
  return (
    <Card kicker="Вход" title="Мечтатель">
      <p className="quote">Войди тихо. За этим порогом уже ждут подарки, которые ты сам себе обещал</p>
      <ButtonLink variant="link" block href={routes.signUp}>
        Нет аккаунта? Создать
      </ButtonLink>
      <ButtonLink variant="link" block href={routes.recovery}>
        Забыли пароль?
      </ButtonLink>
      <ButtonLink variant="link" block href={routes.home}>
        На главную
      </ButtonLink>
    </Card>
  );
}
