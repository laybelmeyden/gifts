import { adminFromRequest, readJson } from '@server/admin';
import { setNavVisibility } from '@server/settings';

export async function PUT(request: Request) {
  const auth = await adminFromRequest();
  if ('response' in auth) return auth.response;
  const json = await readJson(request);
  if ('response' in json) return json.response;

  const result = await setNavVisibility(json.body);
  if (!result.ok) {
    return Response.json({ error: { code: result.code, message: result.message } }, { status: result.status });
  }

  return new Response(null, { status: 204 });
}
