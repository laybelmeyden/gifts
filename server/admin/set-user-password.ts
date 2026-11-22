import 'server-only';
import { setUserPasswordSchema } from '../../contracts/admin';
import { t } from '../../contracts/i18n';
import { auth } from '../auth';

export type SetUserPasswordResult =
  { ok: true } | { ok: false; status: number; code: string; message: string; fields?: Partial<Record<string, string>> };

export async function setUserPassword(adminId: string, userId: string, input: unknown): Promise<SetUserPasswordResult> {
  const parsed = setUserPasswordSchema.safeParse(input);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? t.api.checkFields;
    return { ok: false, status: 400, code: 'validation', message, fields: { password: message } };
  }

  const ctx = await auth.$context;
  const user = await ctx.internalAdapter.findUserById(userId);
  if (!user) return { ok: false, status: 404, code: 'not_found', message: t.api.userNotFound };

  const hash = await ctx.password.hash(parsed.data.password);
  await ctx.internalAdapter.updatePassword(userId, hash);
  if (userId !== adminId) await ctx.internalAdapter.deleteUserSessions(userId);
  return { ok: true };
}
