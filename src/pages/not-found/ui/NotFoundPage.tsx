import { t } from '@contracts/i18n';
import { routes } from '@shared/config';
import { ButtonLink, Card } from '@shared/ui';

export function NotFoundPage() {
  return (
    <div className="center-screen">
    <Card kicker="404" title={t.notFound.title}>
      <p className="quote">{t.notFound.text}</p>
      <ButtonLink variant="link" block href={routes.home}>
        {t.common.toHome}
      </ButtonLink>
    </Card>
    </div>
  );
}
