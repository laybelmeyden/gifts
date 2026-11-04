const messages: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: 'Неверная почта или пароль.',
  USER_ALREADY_EXISTS: 'Эта почта уже зарегистрирована.',
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: 'Эта почта уже зарегистрирована.',
  INVALID_EMAIL: 'Некорректная почта.',
  PASSWORD_TOO_SHORT: 'Пароль слишком короткий.',
  PASSWORD_TOO_LONG: 'Пароль слишком длинный.',
};

type AuthClientError = {
  code?: string;
  status: number;
};

export function authErrorMessage(error: AuthClientError): string {
  if (error.status === 429) return 'Слишком много попыток. Подождите минуту.';
  return (error.code && messages[error.code]) || 'Не получилось. Попробуйте ещё раз.';
}

export const NETWORK_ERROR_MESSAGE = 'Нет сети или сервер недоступен.';
