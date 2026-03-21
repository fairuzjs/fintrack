'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextValue {
    toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => { } });

export const useToast = () => useContext(ToastContext);

// ─── Config ───────────────────────────────────────────────────────────────────
const TOAST_CONFIG = {
    success: {
        icon: CheckCircle2,
        border: 'border-emerald-500/30',
        iconColor: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
    },
    error: {
        icon: XCircle,
        border: 'border-rose-500/30',
        iconColor: 'text-rose-400',
        bg: 'bg-rose-500/10',
    },
    warning: {
        icon: AlertTriangle,
        border: 'border-amber-500/30',
        iconColor: 'text-amber-400',
        bg: 'bg-amber-500/10',
    },
    info: {
        icon: Info,
        border: 'border-blue-500/30',
        iconColor: 'text-blue-400',
        bg: 'bg-blue-500/10',
    },
};

// ─── Single Toast ─────────────────────────────────────────────────────────────
function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
    const cfg = TOAST_CONFIG[toast.type];
    const Icon = cfg.icon;

    return (
        <div
            className={`pointer-events-auto flex items-start gap-3 px-4 py-3 min-w-[280px] max-w-xs rounded-2xl border ${cfg.border} ${cfg.bg} bg-[#111827]/95 backdrop-blur-md shadow-2xl shadow-black/40 animate-in slide-in-from-right-5 fade-in duration-300`}
        >
            <Icon className={`w-4.5 h-4.5 mt-0.5 flex-shrink-0 ${cfg.iconColor}`} />
            <p className="text-white/80 text-sm font-medium flex-1 leading-snug">{toast.message}</p>
            <button
                onClick={onDismiss}
                className="text-white/25 hover:text-white/60 transition-colors flex-shrink-0 mt-0.5"
            >
                <X className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const toast = useCallback((message: string, type: ToastType = 'success') => {
        const id = Math.random().toString(36).slice(2, 9);
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    }, []);

    const dismiss = (id: string) =>
        setToasts(prev => prev.filter(t => t.id !== id));

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}

            {/* ── Toast container (bottom-right on desktop, bottom-center on mobile) */}
            <div className="fixed bottom-20 md:bottom-6 right-0 md:right-6 left-0 md:left-auto z-[9999] flex flex-col items-center md:items-end gap-2 px-4 md:px-0 pointer-events-none">
                {toasts.map(t => (
                    <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}
