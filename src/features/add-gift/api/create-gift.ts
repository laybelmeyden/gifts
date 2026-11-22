import type { CreateGiftInput } from '@contracts/gift';
import { apiFetch } from '@shared/api';

export function createGift(input: CreateGiftInput) {
  return apiFetch<{ id: string }>('/gifts', { method: 'POST', json: input });
}
