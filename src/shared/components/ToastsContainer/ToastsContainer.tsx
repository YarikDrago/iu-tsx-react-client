import React, { FC, useEffect } from 'react';

export type ToastVariant = 'error' | 'warning' | 'success' | 'info' | 'neutral';

export interface ToastItem {
  id: string;
  message: string;
  variant?: ToastVariant;
  /** Lifetime of the toast in milliseconds. */
  duration?: number;
}

interface ToastsContainerProps {
  toasts: ToastItem[];
  /** Callback function to be called when a toast is closed or expires. */
  onClose: (id: string) => void;
}

const Toast: FC<ToastItem & { onClose: (id: string) => void }> = ({
  id,
  message,
  variant = 'neutral',
  duration = 4000,
  onClose,
}) => {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      onClose(id);
    }, duration);

    return () => {
      window.clearTimeout(timer);
    };
  }, [id, duration, onClose]);

  return (
    <div className={`toast toast--${variant}`}>
      <span className="toast__message">{message}</span>
      <button
        type="button"
        className="toast__close"
        onClick={() => onClose(id)}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

export const ToastsContainer: FC<ToastsContainerProps> = ({ toasts, onClose }) => {
  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
};
