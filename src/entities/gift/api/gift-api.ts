import type { UpdateGiftInput } from '@contracts/gift';
import { apiFetch } from '@shared/api';

export function updateGift(giftId: string, input: UpdateGiftInput) {
  return apiFetch<void>(`/gifts/${encodeURIComponent(giftId)}`, { method: 'PATCH', json: input });
}

export function deleteGift(giftId: string) {
  return apiFetch<void>(`/gifts/${encodeURIComponent(giftId)}`, { method: 'DELETE' });
}
