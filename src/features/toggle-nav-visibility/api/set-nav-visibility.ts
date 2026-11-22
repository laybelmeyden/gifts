import type { NavVisibilityInput } from '@contracts/nav';
import { apiFetch } from '@shared/api';

export function setNavVisibility(input: NavVisibilityInput) {
  return apiFetch<void>('/admin/nav', { method: 'PUT', json: input });
}
