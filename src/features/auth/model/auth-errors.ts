import { t } from '@contracts/i18n';

const errors = t.auth.errors;

const messages: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: errors.invalidCredentials,
  USER_ALREADY_EXISTS: errors.emailRegistered,
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: errors.emailRegistered,
  INVALID_EMAIL: errors.invalidEmail,
  PASSWORD_TOO_SHORT: errors.passwordTooShort,
  PASSWORD_TOO_LONG: errors.passwordTooLong,
};

type AuthClientError = {
  code?: string;
  status: number;
};

export function authErrorMessage(error: AuthClientError): string {
  if (error.status === 429) return errors.tooManyAttempts;
  return (error.code && messages[error.code]) || errors.unknown;
}

export const NETWORK_ERROR_MESSAGE = t.common.networkError;
