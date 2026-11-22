import { getSessionUser } from '@server/auth';
import { updateProfile } from '@server/profile';

export async function PATCH(request: Request) {
  const session = await getSessionUser();
  if (!session) {
    return Response.json({ error: { code: 'unauthorized', message: 'Нужно войти.' } }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: { code: 'invalid_json', message: 'Некорректный запрос.' } }, { status: 400 });
  }

  const result = await updateProfile(session.id, body);
  if (!result.ok) {
    return Response.json(
      { error: { code: result.code, message: result.message, fields: result.fields } },
      { status: result.status },
    );
  }

  return Response.json(result.profile);
}
