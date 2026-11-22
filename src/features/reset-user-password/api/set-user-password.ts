import type { SetUserPasswordInput } from '@contracts/admin';
import { apiFetch } from '@shared/api';

export function setUserPassword(userId: string, input: SetUserPasswordInput) {
  return apiFetch<void>(`/admin/users/${encodeURIComponent(userId)}/password`, { method: 'POST', json: input });
}
