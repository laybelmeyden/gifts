'use client';

import { t } from '@contracts/i18n';
import { cancelReservation } from '@entities/gift';
import { ApiError } from '@shared/api';
import { ConfirmModal, useModal, useToast } from '@shared/ui';
import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';

type CancelReservationProps = {
  giftId: string;
  title: string;
  /** Хозяйка вишлиста - для фразы «… ничего не узнает». */
  ownerName: string;
  className?: string;
  children: ReactNode;
};

export function CancelReservation({ giftId, title, ownerName, className, children }: CancelReservationProps) {
  const router = useRouter();
  const showToast = useToast();
  const { openModal, closeModal } = useModal();
  const [cancelling, setCancelling] = useState(false);
  const modal = `cancel-reservation:${giftId}`;

  async function cancel() {
    setCancelling(true);
    try {
      await cancelReservation(giftId);
      closeModal();
      showToast(t.shared.cancelled);
      router.refresh();
    } catch (error) {
      showToast(error instanceof ApiError ? error.message : t.common.networkError);
    } finally {
      setCancelling(false);
    }
  }

  return (
    <>
      <button className={className} type="button" onClick={() => openModal(modal)}>
        {children}
      </button>
      <ConfirmModal
        name={modal}
        title={t.giving.cancelTitle}
        lead={t.giving.cancelLead(title, ownerName)}
        keepLabel={t.giving.keep}
        confirmLabel={t.giving.confirm}
        tone="soft"
        loading={cancelling}
        onConfirm={() => void cancel()}
      />
    </>
  );
}
