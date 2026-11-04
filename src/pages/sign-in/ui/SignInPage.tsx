import { SignInForm } from '@features/auth';
import { routes } from '@shared/config';
import { ButtonLink, Card, HeartField } from '@shared/ui';

export function SignInPage() {
  return (
    <Card cover={<HeartField />} kicker="Вход" title="Мечтатель">
      <p className="quote">Войди тихо. За этим порогом уже ждут подарки, которые ты сам себе обещал</p>
      <SignInForm />
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
