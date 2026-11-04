import { routes } from '@shared/config';
import { ButtonLink, Card } from '@shared/ui';

export function NotFoundPage() {
  return (
    <Card kicker="404" title="Такой страницы нет">
      <p className="quote">Похоже, подарок спрятали слишком хорошо.</p>
      <ButtonLink variant="link" block href={routes.home}>
        На главную
      </ButtonLink>
    </Card>
  );
}
