import type { ReserveGiftInput, UpdateReservationInput } from '@contracts/reservation';
import { apiFetch } from '@shared/api';

export function reserveGift(giftId: string, input: ReserveGiftInput) {
  return apiFetch<void>(`/gifts/${encodeURIComponent(giftId)}/reservation`, { method: 'POST', json: input });
}

export function updateReservation(giftId: string, input: UpdateReservationInput) {
  return apiFetch<void>(`/gifts/${encodeURIComponent(giftId)}/reservation`, { method: 'PATCH', json: input });
}

export function cancelReservation(giftId: string) {
  return apiFetch<void>(`/gifts/${encodeURIComponent(giftId)}/reservation`, { method: 'DELETE' });
}
