import type { ProfileFields, UpdateProfileInput } from '@contracts/profile';
import { apiFetch } from '@shared/api';

export function updateProfile(input: UpdateProfileInput) {
  return apiFetch<ProfileFields>('/profile', { method: 'PATCH', json: input });
}

export function updateUserProfile(userId: string, input: UpdateProfileInput) {
  return apiFetch<ProfileFields>(`/admin/users/${encodeURIComponent(userId)}/profile`, {
    method: 'PATCH',
    json: input,
  });
}
