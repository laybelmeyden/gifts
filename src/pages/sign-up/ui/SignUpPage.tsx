import { routes } from '@shared/config';
import { ButtonLink, Card } from '@shared/ui';

export function SignUpPage() {
  return (
    <Card kicker="Регистрация" title="Мечтатель">
      <p className="quote">Войди тихо. За этим порогом уже ждут подарки, которые ты сам себе обещал</p>
      <ButtonLink variant="link" block href={routes.signIn}>
        Уже есть аккаунт? Войти
      </ButtonLink>
      <ButtonLink variant="link" block href={routes.home}>
        На главную
      </ButtonLink>
    </Card>
  );
}
