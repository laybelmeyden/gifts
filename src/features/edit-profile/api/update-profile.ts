import type { ProfileFields, UpdateProfileInput } from '@contracts/profile';
import { apiFetch } from '@shared/api';

export function updateProfile(input: UpdateProfileInput) {
  return apiFetch<ProfileFields>('/profile', { method: 'PATCH', json: input });
}
