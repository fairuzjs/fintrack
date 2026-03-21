'use client';

import { SessionProvider } from 'next-auth/react';
import { CurrencyProvider } from '../context/CurrencyContext';
import { ToastProvider } from '../context/ToastContext';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <CurrencyProvider>
                <ToastProvider>
                    {children}
                </ToastProvider>
            </CurrencyProvider>
        </SessionProvider>
    );
}
