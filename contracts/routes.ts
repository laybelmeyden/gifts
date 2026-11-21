export const routes = {
  home: '/',
  rules: '/rules',
  signIn: '/sign-in',
  signUp: '/sign-up',
  myList: '/list',
  userList: (userId: string) => `/u/${encodeURIComponent(userId)}`,
  recovery: '/recovery',
  resetPassword: '/reset-password',
  admin: '/admin',
} as const;
