import React, { useEffect } from 'react';
import { useToast } from '../../contexts/ToastContext';

const Toast: React.FC = () => {
  const { toasts, removeToast } = useToast();

  const toastConfig = {
    success: {
      bg: 'bg-green-500/20 border-green-500',
      icon: '✅',
    },
    error: {
      bg: 'bg-red-500/20 border-red-500',
      icon: '❌',
    },
    info: {
      bg: 'bg-blue-500/20 border-blue-500',
      icon: 'ℹ️',
    },
  };

  return (
    <div className="fixed bottom-5 right-5 z-[100] space-y-3">
      {toasts.map((toast) => {
        const config = toastConfig[toast.type];
        return (
          <div
            key={toast.id}
            className={`flex items-center p-4 rounded-lg border text-white shadow-lg animate-fade-in-up ${config.bg}`}
          >
            <span className="mr-3">{config.icon}</span>
            <span className="flex-grow">{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="ml-4 text-2xl font-light leading-none">&times;</button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
