import { t } from '@contracts/i18n';
import { ownerOfWishlist } from '@server/admin';
import { getSessionUser } from '@server/auth';
import { createGift } from '@server/gifts';

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

  const wishlistId = body && typeof body === 'object' && 'wishlistId' in body ? body.wishlistId : undefined;
  const result = await createGift(await ownerOfWishlist(session, wishlistId), body);
  if (!result.ok) {
    return Response.json(
      { error: { code: result.code, message: result.message, fields: result.fields } },
      { status: result.status },
    );
  }

  return Response.json({ id: result.id }, { status: 201 });
}
