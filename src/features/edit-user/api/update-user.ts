import type { AdminUser, UpdateUserInput } from '@contracts/admin';
import { apiFetch } from '@shared/api';

export function updateUser(userId: string, input: UpdateUserInput) {
  return apiFetch<AdminUser>(`/admin/users/${encodeURIComponent(userId)}`, { method: 'PATCH', json: input });
}
