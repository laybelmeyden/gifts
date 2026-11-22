'use client';

import { t } from '@contracts/i18n';
import type { ReactNode } from 'react';
import { Button, type ButtonVariant } from '../button/Button';
import { useToast } from '../ui-context/UiProvider';

type SoonButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: 'md' | 'sm';
  block?: boolean;
  className?: string;
};

export function SoonButton({ children, ...rest }: SoonButtonProps) {
  const showToast = useToast();
  return (
    <Button {...rest} onClick={() => showToast(t.common.soon)}>
      {children}
    </Button>
  );
}
