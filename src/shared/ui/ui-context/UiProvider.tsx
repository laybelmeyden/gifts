'use client';

import { createContext, use, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Toast } from '../toast/Toast';

const TOAST_MS = 2200;

type UiContextValue = {
  activeModal: string | null;
  openModal: (name: string) => void;
  closeModal: () => void;
  showToast: (message: string) => void;
};

const UiContext = createContext<UiContextValue | null>(null);

type ToastState = { id: number; message: string };

export function UiProvider({ children }: { children: ReactNode }) {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const openModal = useCallback((name: string) => setActiveModal(name), []);
  const closeModal = useCallback(() => setActiveModal(null), []);
  const showToast = useCallback((message: string) => setToast({ id: Date.now(), message }), []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), TOAST_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!activeModal) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveModal(null);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [activeModal]);

  const value = useMemo(
    () => ({ activeModal, openModal, closeModal, showToast }),
    [activeModal, openModal, closeModal, showToast],
  );

  return (
    <UiContext value={value}>
      {children}
      {toast && <Toast key={toast.id} message={toast.message} />}
    </UiContext>
  );
}

function useUi(): UiContextValue {
  const context = use(UiContext);
  if (!context) throw new Error('useUi нужно вызывать внутри UiProvider');
  return context;
}

export function useToast() {
  return useUi().showToast;
}

export function useModal() {
  const { activeModal, openModal, closeModal } = useUi();
  return { activeModal, openModal, closeModal };
}
