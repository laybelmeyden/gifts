import { z } from 'zod';
import { nameSchema, passwordSchema } from './auth';
import { t } from './i18n';
import { handleSchema } from './profile';
import type { UserRole } from './user';

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  handle: string | null;
  role: UserRole;
};

/** Пользователь, чьи вишлисты админ открыл из админки и управляет ими от его имени. */
export type ManagedUser = {
  id: string;
  name: string;
};

export type AdminGift = {
  id: string;
  title: string;
  price: string | null;
  imageUrl: string | null;
};

export const setUserPasswordSchema = z.object({
  password: passwordSchema,
});

export type SetUserPasswordInput = z.infer<typeof setUserPasswordSchema>;

export const updateUserSchema = z
  .object({
    name: nameSchema.optional(),
    handle: handleSchema.optional(),
  })
  .refine((data) => data.name !== undefined || data.handle !== undefined, t.api.checkFields);

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
