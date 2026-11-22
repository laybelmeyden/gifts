export const routes = {
  home: '/',
  rules: '/rules',
  signIn: '/sign-in',
  signUp: '/sign-up',
  myList: '/list',
  profile: '/profile',
  userList: (userId: string) => `/u/${encodeURIComponent(userId)}`,
  admin: '/admin',
} as const;
