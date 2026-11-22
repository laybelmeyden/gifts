'use client';

import { Button, useModal, type ButtonVariant } from '@shared/ui';
import type { ReactNode } from 'react';
import { CREATE_WISHLIST_MODAL } from './CreateWishlistModal';

type CreateWishlistButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
};

export function CreateWishlistButton({ children, ...rest }: CreateWishlistButtonProps) {
  const { openModal } = useModal();
  return (
    <Button {...rest} onClick={() => openModal(CREATE_WISHLIST_MODAL)}>
      {children}
    </Button>
  );
}
