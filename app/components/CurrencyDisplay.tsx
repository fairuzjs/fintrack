'use client';

import { useCurrency } from "../context/CurrencyContext";

interface CurrencyDisplayProps {
    amount: number;
    className?: string;
    showSign?: boolean;
    incomeType?: 'INCOME' | 'EXPENSE';
}

export default function CurrencyDisplay({ amount, className = "", showSign = false, incomeType }: CurrencyDisplayProps) {
    const { convertAndFormat, isLoadingRate } = useCurrency();

    // If still loading rates from API over network, show a skeleton or just the IDR value quickly
    if (isLoadingRate) {
        return (
            <span className={`animate-pulse opacity-70 ${className}`}>
                {showSign ? (incomeType === 'INCOME' ? '+' : '-') : ''} Rp {amount.toLocaleString('id-ID')}
            </span>
        );
    }

    const formattedAmount = convertAndFormat(amount);
    const sign = showSign ? (incomeType === 'INCOME' ? '+' : '-') : '';

    return (
        <span className={className}>
            {sign}{formattedAmount}
        </span>
    );
}
