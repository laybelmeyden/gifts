import 'server-only';
import { t } from '../../contracts/i18n';
import type { SessionUser } from '../../contracts/user';
import { getSessionUser } from '../auth';

export async function adminFromRequest(): Promise<{ admin: SessionUser } | { response: Response }> {
  const session = await getSessionUser();
  if (!session) {
    return {
      response: Response.json({ error: { code: 'unauthorized', message: t.api.unauthorized } }, { status: 401 }),
    };
  }
  if (session.role !== 'admin') {
    return { response: Response.json({ error: { code: 'not_found', message: t.api.notFound } }, { status: 404 }) };
  }
  return { admin: session };
}

export async function readJson(request: Request): Promise<{ body: unknown } | { response: Response }> {
  try {
    return { body: await request.json() };
  } catch {
    return {
      response: Response.json({ error: { code: 'invalid_json', message: t.api.invalidJson } }, { status: 400 }),
    };
  }
}
