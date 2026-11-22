import { apiFetch } from '@shared/api';

export function deleteWishlist(wishlistId: string) {
  return apiFetch<void>(`/wishlists/${encodeURIComponent(wishlistId)}`, { method: 'DELETE' });
}
