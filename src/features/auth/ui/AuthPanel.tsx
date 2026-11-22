'use client';

import { signInSchema, signUpSchema, type SignInInput, type SignUpInput } from '@contracts/auth';
import { t } from '@contracts/i18n';
import { authClient } from '@shared/api';
import { routes } from '@shared/config';
import { fieldErrors, type FieldErrors } from '@shared/lib';
import { Button, ButtonLink, Input, Logo, PasswordInput, useModal } from '@shared/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent, type ReactNode } from 'react';
import { authErrorMessage, NETWORK_ERROR_MESSAGE } from '../model/auth-errors';
import { FORGOT_PASSWORD_MODAL, ForgotPasswordModal } from './ForgotPasswordModal';
import styles from './AuthPanel.module.css';

type Mode = 'sign-in' | 'sign-up';

const copy = {
  'sign-in': t.auth.signIn,
  'sign-up': t.auth.signUp,
};

export function AuthPanel({ mode, art }: { mode: Mode; art: ReactNode }) {
  const text = copy[mode];
  const isSignUp = mode === 'sign-up';

  return (
    <div className={`${styles.screen} starfield`}>
      <div className={styles.art}>
        <Logo className={styles.brand} />
        <div className={styles.scene}>{art}</div>
      </div>
      <div className={styles.column}>
        <PixelHeartMark />
        <div className={styles.formWrap}>
          <ButtonLink variant="link" href={routes.home} className={styles.back}>
            <span className={styles.arrow} aria-hidden="true" />
            {t.common.toHome}
          </ButtonLink>
          <h1 className={styles.title}>{text.title}</h1>
          <p className={styles.subtitle}>{text.subtitle}</p>
          <div className={styles.tabs}>
            <Tab href={routes.signIn} active={!isSignUp}>
              {t.auth.tabSignIn}
            </Tab>
            <Tab href={routes.signUp} active={isSignUp}>
              {t.auth.tabSignUp}
            </Tab>
          </div>
          <AuthForm mode={mode} submitLabel={text.submit} />
        </div>
      </div>
      {!isSignUp && <ForgotPasswordModal />}
    </div>
  );
}

function Tab({ href, active, children }: { href: string; active: boolean; children: string }) {
  return (
    <Link className={`px ${styles.tab} ${active ? styles.tabOn : ''}`} href={href}>
      {children}
    </Link>
  );
}

function AuthForm({ mode, submitLabel }: { mode: Mode; submitLabel: string }) {
  const router = useRouter();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState('');
  const [pending, setPending] = useState(false);
  const { openModal } = useModal();
  const isSignUp = mode === 'sign-up';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError('');
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const parsed = parseAuth(isSignUp, data);
    if (!parsed.ok) {
      setErrors(parsed.fields);
      return;
    }
    setErrors({});
    setPending(true);

    try {
      const { error } = parsed.kind === 'sign-up'
        ? await authClient.signUp.email(parsed.input)
        : await authClient.signIn.email(parsed.input);
      if (error) {
        setFormError(authErrorMessage(error));
        setPending(false);
        return;
      }
    } catch {
      setFormError(NETWORK_ERROR_MESSAGE);
      setPending(false);
      return;
    }

    router.replace(routes.myList);
    router.refresh();
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {isSignUp && (
        <Input
          label={t.auth.nameLabel}
          name="name"
          autoComplete="nickname"
          placeholder={t.auth.namePlaceholder}
          required
          error={errors.name}
        />
      )}
      <Input
        label={t.fields.email}
        name="email"
        type="email"
        autoComplete="email"
        inputMode="email"
        placeholder={t.fields.emailPlaceholder}
        required
        error={errors.email}
      />
      <PasswordInput
        label={t.fields.password}
        name="password"
        autoComplete={isSignUp ? 'new-password' : 'current-password'}
        placeholder={t.fields.passwordPlaceholder}
        required
        error={errors.password}
      />
      {!isSignUp && (
        <Button variant="link" className={styles.forgot} onClick={() => openModal(FORGOT_PASSWORD_MODAL)}>
          {t.auth.forgotPassword}
        </Button>
      )}
      {formError && (
        <p className={styles.formError} role="alert">
          * {formError}
        </p>
      )}
      <Button type="submit" block loading={pending}>
        {submitLabel}
      </Button>
      {isSignUp && (
        <p className={styles.note}>
          {t.auth.termsBefore}
          <Link href={routes.rules} className={styles.rules}>
            {t.auth.termsLink}
          </Link>
          {t.auth.termsAfter}
        </p>
      )}
    </form>
  );
}

type ParsedAuth =
  | { ok: false; fields: FieldErrors }
  | { ok: true; kind: 'sign-up'; input: SignUpInput }
  | { ok: true; kind: 'sign-in'; input: SignInInput };

function parseAuth(isSignUp: boolean, data: Record<string, FormDataEntryValue>): ParsedAuth {
  if (isSignUp) {
    const parsed = signUpSchema.safeParse(data);
    if (!parsed.success) return { ok: false, fields: fieldErrors(parsed.error) };
    return { ok: true, kind: 'sign-up', input: parsed.data };
  }
  const parsed = signInSchema.safeParse(data);
  if (!parsed.success) return { ok: false, fields: fieldErrors(parsed.error) };
  return { ok: true, kind: 'sign-in', input: parsed.data };
}

function PixelHeartMark() {
  return (
    <svg className={styles.mark} viewBox="0 0 7 6" aria-hidden="true">
      <rect x="1" y="0" width="2" height="1" fill="#e9d5ff" />
      <rect x="4" y="0" width="2" height="1" fill="#e9d5ff" />
      <rect x="0" y="1" width="7" height="2" fill="#c084fc" />
      <rect x="2" y="1" width="1" height="1" fill="#f5f3ff" />
      <rect x="1" y="3" width="5" height="1" fill="#a855f7" />
      <rect x="2" y="4" width="3" height="1" fill="#7c3aed" />
      <rect x="3" y="5" width="1" height="1" fill="#5b21b6" />
    </svg>
  );
}
