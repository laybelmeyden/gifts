import type { CreateWishlistInput } from '@contracts/wishlist';
import { apiFetch } from '@shared/api';

export function createWishlist(input: CreateWishlistInput) {
  return apiFetch<{ id: string }>('/wishlists', { method: 'POST', json: input });
}
