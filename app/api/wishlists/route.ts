import { t } from '@contracts/i18n';
import { getSessionUser } from '@server/auth';
import { createWishlist } from '@server/wishlists';

export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session) {
    return Response.json({ error: { code: 'unauthorized', message: t.api.unauthorized } }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: { code: 'invalid_json', message: t.api.invalidJson } }, { status: 400 });
  }

  const result = await createWishlist(session.id, body);
  if (!result.ok) {
    return Response.json(
      { error: { code: result.code, message: result.message, fields: result.fields } },
      { status: result.status },
    );
  }

  return Response.json({ id: result.id }, { status: 201 });
}
