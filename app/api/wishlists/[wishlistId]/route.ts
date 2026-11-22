import { t } from '@contracts/i18n';
import { ownerOfWishlist } from '@server/admin';
import { getSessionUser } from '@server/auth';
import { deleteWishlist } from '@server/wishlists';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function DELETE(_request: Request, { params }: RouteContext<'/api/wishlists/[wishlistId]'>) {
  const session = await getSessionUser();
  if (!session) {
    return Response.json({ error: { code: 'unauthorized', message: t.api.unauthorized } }, { status: 401 });
  }
  const { wishlistId } = await params;
  if (!UUID.test(wishlistId) || !(await deleteWishlist(await ownerOfWishlist(session, wishlistId), wishlistId))) {
    return Response.json({ error: { code: 'not_found', message: t.api.notFound } }, { status: 404 });
  }
  return new Response(null, { status: 204 });
}
