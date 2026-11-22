export const routes = {
  home: '/',
  rules: '/rules',
  signIn: '/sign-in',
  signUp: '/sign-up',
  myList: '/list',
  wishlist: (wishlistId: string) => `/list/${encodeURIComponent(wishlistId)}`,
  gift: (wishlistId: string, giftId: string) => `/list/${encodeURIComponent(wishlistId)}/${encodeURIComponent(giftId)}`,
  sharedWishlist: (wishlistId: string) => `/w/${encodeURIComponent(wishlistId)}`,
  sharedGift: (wishlistId: string, giftId: string) =>
    `/w/${encodeURIComponent(wishlistId)}/${encodeURIComponent(giftId)}`,
  reserved: (wishlistId: string, giftId: string) =>
    `/w/${encodeURIComponent(wishlistId)}/${encodeURIComponent(giftId)}/reserved`,
  giving: '/giving',
  profile: '/profile',
  userList: (userId: string) => `/u/${encodeURIComponent(userId)}`,
  admin: '/admin',
  adminUser: (userId: string) => `/admin/users/${encodeURIComponent(userId)}`,
  adminLists: (userId: string) => `/admin/users/${encodeURIComponent(userId)}/lists`,
  adminWishlist: (userId: string, wishlistId: string) =>
    `/admin/users/${encodeURIComponent(userId)}/lists/${encodeURIComponent(wishlistId)}`,
  adminGift: (userId: string, wishlistId: string, giftId: string) =>
    `/admin/users/${encodeURIComponent(userId)}/lists/${encodeURIComponent(wishlistId)}/${encodeURIComponent(giftId)}`,
} as const;

/** Вход/регистрация с возвратом на страницу, откуда пришли. */
export function withNext(path: typeof routes.signIn | typeof routes.signUp, next: string | null) {
  return next ? `${path}?next=${encodeURIComponent(next)}` : path;
}

/** Только внутренний путь: `//evil.com` и абсолютные ссылки отбрасываем. */
export function safeNext(value: unknown): string | null {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || value.includes('\\'))
    return null;
  return value;
}
