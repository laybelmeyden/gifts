'use client';

import { useSession } from '@entities/session';
import { routes } from '@shared/config';
import { ButtonLink } from '@shared/ui';

export function HomeEnterButton({ className }: { className?: string }) {
  const session = useSession();
  const signedIn = session.status === 'authenticated';

  return (
    <ButtonLink fixed className={className} href={signedIn ? routes.myList : routes.signIn}>
      {signedIn ? 'Мой список' : 'Войти'}
    </ButtonLink>
  );
}
