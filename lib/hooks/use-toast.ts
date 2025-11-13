import { useState, useCallback } from 'react';

export type ToastVariant = 'default' | 'destructive' | 'success';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

let toastCounter = 0;
let listeners: Array<(toast: Toast | null) => void> = [];

export function useToast() {
  const [currentToast, setCurrentToast] = useState<Toast | null>(null);

  // Subscribe to toast events
  useState(() => {
    const listener = (toast: Toast | null) => {
      setCurrentToast(toast);
      if (toast) {
        setTimeout(() => setCurrentToast(null), 5000);
      }
    };
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  });

  const toast = useCallback((options: ToastOptions) => {
    const id = `toast-${++toastCounter}`;
    const newToast: Toast = {
      id,
      title: options.title,
      description: options.description,
      variant: options.variant || 'default',
    };

    // Notify all listeners
    listeners.forEach(listener => listener(newToast));

    // Auto dismiss after duration
    setTimeout(() => {
      listeners.forEach(listener => listener(null));
    }, options.duration || 5000);
  }, []);

  return { toast, currentToast };
}
