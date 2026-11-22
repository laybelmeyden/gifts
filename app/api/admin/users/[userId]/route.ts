import { adminFromRequest, readJson, updateUser } from '@server/admin';

export async function PATCH(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  const auth = await adminFromRequest();
  if ('response' in auth) return auth.response;
  const json = await readJson(request);
  if ('response' in json) return json.response;

  const { userId } = await params;
  const result = await updateUser(userId, json.body);
  if (!result.ok) {
    return Response.json(
      { error: { code: result.code, message: result.message, fields: result.fields } },
      { status: result.status },
    );
  }

  return Response.json(result.user);
}
