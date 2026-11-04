'use client';

import { authClient } from '@shared/api';
import { routes } from '@shared/config';
import { Button, useToast } from '@shared/ui';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { NETWORK_ERROR_MESSAGE } from '../model/auth-errors';

export function SignOutButton() {
  const router = useRouter();
  const showToast = useToast();
  const [pending, setPending] = useState(false);

  async function handleClick() {
    setPending(true);
    try {
      await authClient.signOut();
    } catch {
      showToast(NETWORK_ERROR_MESSAGE);
      setPending(false);
      return;
    }
    router.replace(routes.home);
    router.refresh();
  }

  return (
    <Button variant="link" onClick={handleClick} disabled={pending}>
      Выйти
    </Button>
  );
}
