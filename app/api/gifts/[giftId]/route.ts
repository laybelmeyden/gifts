import { t } from '@contracts/i18n';
import { ownerOfGift } from '@server/admin';
import { getSessionUser } from '@server/auth';
import { deleteGift, updateGift } from '@server/gifts';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const unauthorized = () =>
  Response.json({ error: { code: 'unauthorized', message: t.api.unauthorized } }, { status: 401 });
const notFound = () => Response.json({ error: { code: 'not_found', message: t.api.notFound } }, { status: 404 });

export async function PATCH(request: Request, { params }: RouteContext<'/api/gifts/[giftId]'>) {
  const session = await getSessionUser();
  if (!session) return unauthorized();
  const { giftId } = await params;
  if (!UUID.test(giftId)) return notFound();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: { code: 'invalid_json', message: t.api.invalidJson } }, { status: 400 });
  }

  const result = await updateGift(await ownerOfGift(session, giftId), giftId, body);
  if (!result.ok) {
    return Response.json(
      { error: { code: result.code, message: result.message, fields: result.fields } },
      { status: result.status },
    );
  }
  return new Response(null, { status: 204 });
}

export async function DELETE(_request: Request, { params }: RouteContext<'/api/gifts/[giftId]'>) {
  const session = await getSessionUser();
  if (!session) return unauthorized();
  const { giftId } = await params;
  if (!UUID.test(giftId) || !(await deleteGift(await ownerOfGift(session, giftId), giftId))) return notFound();
  return new Response(null, { status: 204 });
}
