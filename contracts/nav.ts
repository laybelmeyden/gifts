import { z } from 'zod';

export const NAV_KEYS = ['lists', 'friends', 'giving', 'calendar', 'profile'] as const;

export type NavKey = (typeof NAV_KEYS)[number];

export type NavCounts = Partial<Record<NavKey, number>>;

export const navVisibilitySchema = z.object({
  key: z.enum(NAV_KEYS),
  visible: z.boolean(),
});

export type NavVisibilityInput = z.infer<typeof navVisibilitySchema>;
