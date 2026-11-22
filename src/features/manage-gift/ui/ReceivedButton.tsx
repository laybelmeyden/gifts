'use client';

import { t } from '@contracts/i18n';
import { updateGift } from '@entities/gift';
import { ApiError } from '@shared/api';
import { cx } from '@shared/lib';
import { Button, useToast } from '@shared/ui';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './ManageGift.module.css';

export function ReceivedButton({ giftId, received }: { giftId: string; received: boolean }) {
  const router = useRouter();
  const showToast = useToast();
  const [saving, setSaving] = useState(false);

  async function toggle() {
    setSaving(true);
    try {
      await updateGift(giftId, { received: !received });
      router.refresh();
    } catch (error) {
      showToast(error instanceof ApiError ? error.message : t.common.networkError);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Button
      className={cx(styles.action, styles.received, received && styles.receivedOn)}
      loading={saving}
      aria-pressed={received}
      title={received ? t.gift.unmarkReceived : undefined}
      onClick={() => void toggle()}
    >
      <span className={cx(styles.icon, styles.check)} aria-hidden="true" />
      {received ? t.gift.received : t.gift.markReceived}
    </Button>
  );
}
