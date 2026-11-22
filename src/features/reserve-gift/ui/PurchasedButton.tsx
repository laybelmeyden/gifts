'use client';

import { t } from '@contracts/i18n';
import { updateReservation } from '@entities/gift';
import { ApiError } from '@shared/api';
import { useToast } from '@shared/ui';
import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';

type PurchasedButtonProps = {
  giftId: string;
  purchased: boolean;
  className?: string;
  children: ReactNode;
};

/** «Купила» переводит бронь в «Куплено»; повторное нажатие возвращает обратно. */
export function PurchasedButton({ giftId, purchased, className, children }: PurchasedButtonProps) {
  const router = useRouter();
  const showToast = useToast();
  const [saving, setSaving] = useState(false);

  async function toggle() {
    setSaving(true);
    try {
      await updateReservation(giftId, { purchased: !purchased });
      router.refresh();
    } catch (error) {
      showToast(error instanceof ApiError ? error.message : t.common.networkError);
    } finally {
      setSaving(false);
    }
  }

  return (
    <button
      className={className}
      type="button"
      disabled={saving}
      aria-pressed={purchased}
      title={purchased ? t.giving.unmarkPurchased : undefined}
      onClick={() => void toggle()}
    >
      {children}
    </button>
  );
}
