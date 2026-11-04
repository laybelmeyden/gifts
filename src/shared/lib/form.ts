import type { z } from 'zod';

export type FieldErrors = Partial<Record<string, string>>;

/** Первая ошибка по каждому полю — для подписи под инпутом. */
export function fieldErrors(error: z.ZodError): FieldErrors {
  const result: FieldErrors = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? '');
    if (field && !result[field]) result[field] = issue.message;
  }
  return result;
}
