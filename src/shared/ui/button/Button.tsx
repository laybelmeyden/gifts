import Link from 'next/link';
import type { ButtonHTMLAttributes, ComponentProps } from 'react';
import { cx } from '../../lib';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'ghost' | 'link';

type ButtonStyleProps = {
  variant?: ButtonVariant;
  /** Фиксированная ширина 135px, как у кнопок на доске и на главной. */
  fixed?: boolean;
  block?: boolean;
};

function buttonClassName({ variant = 'primary', fixed, block }: ButtonStyleProps, className?: string) {
  return cx(styles.btn, styles[variant], fixed && styles.fixed, block && styles.block, className);
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & ButtonStyleProps;

export function Button({ variant, fixed, block, className, type = 'button', ...rest }: ButtonProps) {
  return <button type={type} className={buttonClassName({ variant, fixed, block }, className)} {...rest} />;
}

type ButtonLinkProps = ComponentProps<typeof Link> & ButtonStyleProps;

export function ButtonLink({ variant, fixed, block, className, ...rest }: ButtonLinkProps) {
  return <Link className={buttonClassName({ variant, fixed, block }, className)} {...rest} />;
}
