'use client';

import Link from 'next/link';
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../lib';
import styles from './Dropdown.module.css';

export type DropdownItem = {
  label: string;
  href?: string;
  onSelect?: () => void;
  danger?: boolean;
};

type DropdownProps = {
  label: string;
  items: DropdownItem[];
  className?: string;
  triggerClassName?: string;
  /** Иконка кнопки вместо стандартной. */
  children?: ReactNode;
  /** side — меню справа от кнопки, below — под ней, по правому краю. */
  placement?: 'side' | 'below';
};

type MenuPosition = { top: number; left: number };

const MENU_GAP = 8;
const VIEWPORT_GAP = 12;

export function Dropdown({ label, items, className, triggerClassName, children, placement = 'side' }: DropdownProps) {
  const [position, setPosition] = useState<MenuPosition | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const open = position !== null;

  useEffect(() => {
    if (!open) return;
    const close = () => setPosition(null);
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!menuRef.current?.contains(target) && !triggerRef.current?.contains(target)) close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', close);
    window.addEventListener('scroll', close, true);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', close);
      window.removeEventListener('scroll', close, true);
    };
  }, [open]);

  useLayoutEffect(() => {
    const menu = menuRef.current;
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!menu || !rect || !position) return;
    const maxTop = window.innerHeight - menu.offsetHeight - VIEWPORT_GAP;
    const top = Math.max(VIEWPORT_GAP, Math.min(position.top, maxTop));
    let left: number;
    if (placement === 'below') {
      left = Math.max(VIEWPORT_GAP, rect.right - menu.offsetWidth);
    } else {
      const fitsRight = rect.right + MENU_GAP + menu.offsetWidth <= window.innerWidth - VIEWPORT_GAP;
      left = fitsRight ? position.left : Math.max(VIEWPORT_GAP, rect.left - MENU_GAP - menu.offsetWidth);
    }
    if (top !== position.top || left !== position.left) setPosition({ top, left });
  }, [position, placement]);

  function toggle() {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (open || !rect) setPosition(null);
    else if (placement === 'below') setPosition({ top: rect.bottom + MENU_GAP, left: rect.right });
    else setPosition({ top: rect.top, left: rect.right + MENU_GAP });
  }

  function select(item: DropdownItem) {
    setPosition(null);
    item.onSelect?.();
  }

  return (
    <div className={cx(styles.root, className)}>
      <button
        ref={triggerRef}
        className={cx('px', styles.trigger, open && styles.open, triggerClassName)}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={toggle}
      >
        {children ?? <span className={styles.icon} aria-hidden="true" />}
      </button>
      {position &&
        createPortal(
          <div ref={menuRef} className={cx('px', styles.menu)} style={position} role="menu">
            {items.map((item) => {
              const className = cx(styles.item, item.danger && styles.danger);
              return item.href ? (
                <Link
                  key={item.label}
                  className={className}
                  href={item.href}
                  role="menuitem"
                  onClick={() => select(item)}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.label}
                  className={className}
                  type="button"
                  role="menuitem"
                  onClick={() => select(item)}
                >
                  {item.label}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </div>
  );
}
