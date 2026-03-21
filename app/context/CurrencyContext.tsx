'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Currency = 'IDR' | 'USD';

interface CurrencyContextType {
    currency: Currency;
    exchangeRate: number; // How much 1 IDR is in USD (e.g., 0.000064)
    toggleCurrency: () => void;
    convertAndFormat: (amountIdr: number) => string;
    isLoadingRate: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const [currency, setCurrency] = useState<Currency>('IDR');
    const [exchangeRate, setExchangeRate] = useState<number>(0);
    const [isLoadingRate, setIsLoadingRate] = useState<boolean>(true);

    useEffect(() => {
        // Fetch real-time exchange rate on mount
        const fetchRate = async () => {
            try {
                const res = await fetch('https://open.er-api.com/v6/latest/IDR');
                const data = await res.json();

                if (data && data.rates && data.rates.USD) {
                    setExchangeRate(data.rates.USD);
                } else {
                    // Fallback rate if API fails (approximate)
                    setExchangeRate(1 / 15500);
                }
            } catch (error) {
                console.error("Failed to fetch exchange rate:", error);
                // Fallback rate if network fails
                setExchangeRate(1 / 15500);
            } finally {
                setIsLoadingRate(false);
            }
        };

        fetchRate();
    }, []);

    const toggleCurrency = () => {
        setCurrency(prev => prev === 'IDR' ? 'USD' : 'IDR');
    };

    const convertAndFormat = (amountIdr: number) => {
        if (currency === 'IDR') {
            return `Rp ${amountIdr.toLocaleString('id-ID')}`;
        } else {
            // Convert to USD and format
            const amountUsd = amountIdr * exchangeRate;
            return `$${amountUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
    };

    return (
        <CurrencyContext.Provider value={{ currency, exchangeRate, toggleCurrency, convertAndFormat, isLoadingRate }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}
