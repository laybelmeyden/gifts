import Link from 'next/link';
import type { ButtonHTMLAttributes, ComponentProps } from 'react';
import { cx } from '../../lib';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'pink' | 'ghost' | 'link';

type ButtonStyleProps = {
  variant?: ButtonVariant;
  size?: 'md' | 'sm';
  block?: boolean;
};

function buttonClassName({ variant = 'primary', size = 'md', block }: ButtonStyleProps, className?: string) {
  return cx(styles.btn, styles[variant], size === 'sm' && styles.sm, block && styles.block, className);
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonStyleProps & {
    loading?: boolean;
  };

export function Button({
  variant,
  size,
  block,
  loading = false,
  className,
  type = 'button',
  disabled,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClassName({ variant, size, block }, cx(loading && styles.loading, className))}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <span className={styles.stage}>
          <span className={styles.heart} aria-hidden="true" />
        </span>
      ) : null}
      <span className={loading ? styles.srOnly : styles.label}>{children}</span>
    </button>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & ButtonStyleProps;

export function ButtonLink({ variant, size, block, className, ...rest }: ButtonLinkProps) {
  return <Link className={buttonClassName({ variant, size, block }, className)} {...rest} />;
}
