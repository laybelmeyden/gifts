'use client';

import { Button, useModal, type ButtonVariant } from '@shared/ui';
import type { ReactNode } from 'react';
import { ADD_GIFT_MODAL } from './AddGiftModal';

type AddGiftButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
};

export function AddGiftButton({ children, ...rest }: AddGiftButtonProps) {
  const { openModal } = useModal();
  return (
    <Button {...rest} onClick={() => openModal(ADD_GIFT_MODAL)}>
      {children}
    </Button>
  );
}
