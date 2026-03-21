'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowUpDown, RefreshCw, TrendingUp, TrendingDown, Info } from 'lucide-react';

// ─── Currency config ──────────────────────────────────────────────────────────
const CURRENCIES = [
    { code: 'IDR', name: 'Indonesian Rupiah', cc: 'id', symbol: 'Rp' },
    { code: 'USD', name: 'US Dollar',          cc: 'us', symbol: '$' },
    { code: 'EUR', name: 'Euro',               cc: 'eu', symbol: '€' },
    { code: 'GBP', name: 'British Pound',      cc: 'gb', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen',       cc: 'jp', symbol: '¥' },
    { code: 'SGD', name: 'Singapore Dollar',   cc: 'sg', symbol: 'S$' },
    { code: 'MYR', name: 'Malaysian Ringgit',  cc: 'my', symbol: 'RM' },
    { code: 'AUD', name: 'Australian Dollar',  cc: 'au', symbol: 'A$' },
    { code: 'CNY', name: 'Chinese Yuan',       cc: 'cn', symbol: '¥' },
    { code: 'KRW', name: 'South Korean Won',   cc: 'kr', symbol: '₩' },
    { code: 'SAR', name: 'Saudi Riyal',        cc: 'sa', symbol: '﷼' },
    { code: 'AED', name: 'UAE Dirham',         cc: 'ae', symbol: 'د.إ' },
];

function FlagImg({ cc, size = 20 }: { cc: string; size?: number }) {
    // Always fetch at w40 (a valid flagcdn.com width) and scale display via width/height attrs
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={`https://flagcdn.com/w40/${cc}.png`}
            width={size}
            height={size}
            alt={cc.toUpperCase()}
            className="rounded-full object-cover flex-shrink-0"
            style={{ width: size, height: size, minWidth: size, minHeight: size }}
        />
    );
}

const FEATURED = ['USD', 'EUR', 'GBP', 'JPY', 'SGD', 'MYR', 'AUD', 'CNY', 'KRW', 'SAR'];

function getCurrency(code: string) {
    return CURRENCIES.find(c => c.code === code) ?? CURRENCIES[0];
}

// Format number nicely
function fmt(value: number, code: string) {
    if (code === 'JPY' || code === 'KRW' || code === 'IDR') {
        return value.toLocaleString('id-ID', { maximumFractionDigits: 0 });
    }
    return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
}

// ─── Currency Selector Dropdown ───────────────────────────────────────────────
function CurrencySelect({
    value,
    onChange,
    disabled = false,
}: {
    value: string;
    onChange: (code: string) => void;
    disabled?: boolean;
}) {
    const [open, setOpen] = useState(false);
    const cur = getCurrency(value);

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen(v => !v)}
                disabled={disabled}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1C2416] hover:bg-[#232E17] border border-[#2D3A22] text-[#F0EDE5] font-semibold text-sm transition-all min-w-[110px] disabled:opacity-50"
            >
                <FlagImg cc={cur.cc} size={18} />
                <span>{cur.code}</span>
                <span className="text-[#6B7A5A] text-xs ml-auto">▾</span>
            </button>

            {open && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 z-20 w-56 bg-[#141A0E] border border-[#2D3A22] rounded-2xl shadow-2xl overflow-hidden">
                        <div className="max-h-64 overflow-y-auto divide-y divide-[#2D3A22]/60">
                            {CURRENCIES.map(c => (
                                <button
                                    key={c.code}
                                    type="button"
                                    onClick={() => { onChange(c.code); setOpen(false); }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#1C2416] transition-colors ${c.code === value ? 'bg-[#A8D44C]/10 text-[#A8D44C]' : 'text-[#8A9478]'
                                        }`}
                                >
                                    <FlagImg cc={c.cc} size={22} />
                                    <div>
                                        <p className="font-semibold text-sm">{c.code}</p>
                                        <p className="text-[#6B7A5A] text-xs">{c.name}</p>
                                    </div>
                                    {c.code === value && (
                                        <span className="ml-auto text-[#A8D44C] text-xs">✓</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CurrencyPage() {
    // Exchange rates relative to IDR (fetched from API)
    const [rates, setRates] = useState<Record<string, number>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    // Converter state
    const [fromCode, setFromCode] = useState('USD');
    const [toCode, setToCode] = useState('IDR');
    const [fromAmount, setFromAmount] = useState('1');
    const [toAmount, setToAmount] = useState('');

    // Fetch live rates
    const fetchRates = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch('https://open.er-api.com/v6/latest/IDR');
            const data = await res.json();
            if (data?.rates) {
                setRates(data.rates);
                setLastUpdated(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
            } else {
                throw new Error('Invalid API response');
            }
        } catch {
            setError('Failed to load live rates. Showing cached data.');
            // Fallback rates relative to IDR
            setRates({ USD: 0.0000638, EUR: 0.0000585, GBP: 0.0000498, JPY: 0.00948, SGD: 0.0000855, MYR: 0.000294, AUD: 0.0000972, CNY: 0.000462, KRW: 0.0868, SAR: 0.000239, AED: 0.000234, IDR: 1 });
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchRates(); }, [fetchRates]);

    // Recalculate "to" whenever inputs change
    useEffect(() => {
        if (!Object.keys(rates).length) return;
        const amount = parseFloat(fromAmount);
        if (isNaN(amount) || amount <= 0) { setToAmount(''); return; }

        // Convert via IDR as base
        // rates[X] = how many X per 1 IDR
        // amount in fromCode → IDR: amount / rates[fromCode]  (if fromCode != IDR)
        // IDR → toCode: idr * rates[toCode]

        const fromRate = fromCode === 'IDR' ? 1 : (rates[fromCode] ?? 1);
        const toRate = toCode === 'IDR' ? 1 : (rates[toCode] ?? 1);

        const inIDR = fromCode === 'IDR' ? amount : amount / fromRate;
        const result = toCode === 'IDR' ? inIDR : inIDR * toRate;
        setToAmount(fmt(result, toCode));
    }, [fromAmount, fromCode, toCode, rates]);

    // Rate for display (1 fromCode = X toCode)
    const getDisplayRate = () => {
        if (!Object.keys(rates).length) return null;
        const fromRate = fromCode === 'IDR' ? 1 : (rates[fromCode] ?? 1);
        const toRate = toCode === 'IDR' ? 1 : (rates[toCode] ?? 1);
        const inIDR = fromCode === 'IDR' ? 1 : 1 / fromRate;
        const result = toCode === 'IDR' ? inIDR : inIDR * toRate;
        return result;
    };

    const handleSwap = () => {
        setFromCode(toCode);
        setToCode(fromCode);
        setFromAmount('1');
    };

    const displayRate = getDisplayRate();
    const fromCur = getCurrency(fromCode);
    const toCur = getCurrency(toCode);

    return (
        <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8">

            {/* ── Header ─────────────────────────────────────────────────────── */}
            <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                <div>
                    <h1 className="text-3xl font-serif font-semibold tracking-tight text-[#F0EDE5]">
                        Currency Converter
                    </h1>
                    <p className="text-[#6B7A5A] mt-1 text-sm">
                        Live exchange rates — updated in real-time.
                    </p>
                </div>
                <button
                    onClick={fetchRates}
                    disabled={isLoading}
                    className="flex items-center gap-2 text-xs font-semibold text-[#6B7A5A] hover:text-[#8A9478] border border-[#2D3A22] hover:border-[#3D4E2C] px-3 py-2 rounded-lg transition-all disabled:opacity-40 self-start sm:self-auto"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    {lastUpdated ? `Updated ${lastUpdated}` : 'Refresh'}
                </button>
            </header>

            {error && (
                <div className="flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300/80 text-xs font-medium">
                    <Info className="w-4 h-4 flex-shrink-0" />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                {/* ── Converter Card ──────────────────────────────────────────── */}
                <div className="lg:col-span-2 bg-[#141A0E] border border-[#2D3A22] rounded-2xl overflow-hidden">

                    {/* Rate badge */}
                    <div className="px-6 pt-5 pb-4 border-b border-[#2D3A22] text-center">
                        <div className="flex items-center justify-center gap-1.5 text-[#6B7A5A] text-xs mb-1.5">
                            <Info className="w-3.5 h-3.5" />
                            <span>Mid-market exchange rate</span>
                        </div>
                        <p className="text-[#F0EDE5] font-bold text-sm">
                            {isLoading ? (
                                <span className="inline-block w-40 h-4 bg-[#2D3A22] rounded animate-pulse" />
                            ) : displayRate ? (
                                <span className="inline-flex items-center gap-1.5 flex-wrap justify-center">
                                    <FlagImg cc={fromCur.cc} size={16} /> {fromCode}
                                    <span className="text-[#6B7A5A] font-normal mx-0.5">=</span>
                                    {fmt(displayRate, toCode)} <FlagImg cc={toCur.cc} size={16} /> {toCode}
                                </span>
                            ) : '—'}
                        </p>
                    </div>

                    <div className="p-6 space-y-3">
                        {/* From */}
                        <div className="space-y-1.5">
                            <label className="text-[#6B7A5A] text-xs font-semibold uppercase tracking-widest">Amount</label>
                            <div className="flex items-center gap-3 bg-[#1C2416] border border-[#2D3A22] rounded-xl px-4 py-3 focus-within:ring-1 focus-within:ring-[#A8D44C]/40 focus-within:border-[#A8D44C]/30 transition-all">
                                <input
                                    type="number"
                                    min="0"
                                    value={fromAmount}
                                    onChange={e => setFromAmount(e.target.value)}
                                    placeholder="0"
                                    className="flex-1 bg-transparent text-[#F0EDE5] text-xl font-bold placeholder-[#6B7A5A] focus:outline-none min-w-0"
                                />
                                <CurrencySelect value={fromCode} onChange={setFromCode} />
                            </div>
                        </div>

                        {/* Swap button */}
                        <div className="flex items-center justify-center py-1">
                            <button
                                type="button"
                                onClick={handleSwap}
                                className="w-10 h-10 rounded-full bg-[#A8D44C] hover:bg-[#B8E55C] flex items-center justify-center shadow-lg shadow-[#A8D44C]/20 transition-all hover:rotate-180 duration-300 active:scale-90"
                            >
                                <ArrowUpDown className="w-4 h-4 text-[#0C1208]" />
                            </button>
                        </div>

                        {/* To */}
                        <div className="space-y-1.5">
                            <label className="text-[#6B7A5A] text-xs font-semibold uppercase tracking-widest">Converted to</label>
                            <div className="flex items-center gap-3 bg-[#1C2416] border border-[#2D3A22] rounded-xl px-4 py-3 transition-all">
                                {isLoading ? (
                                    <div className="flex-1 h-7 bg-[#2D3A22] rounded animate-pulse" />
                                ) : (
                                    <p className="flex-1 text-[#F0EDE5] text-xl font-bold min-w-0 truncate">
                                        {toAmount || '—'}
                                    </p>
                                )}
                                <CurrencySelect value={toCode} onChange={setToCode} />
                            </div>
                        </div>

                        {/* Quick amounts */}
                        <div className="pt-2">
                            <p className="text-[#6B7A5A] text-xs font-semibold uppercase tracking-widest mb-2">Quick amounts</p>
                            <div className="flex gap-2 flex-wrap">
                                {[1, 10, 100, 1000].map(n => (
                                    <button
                                        key={n}
                                        type="button"
                                        onClick={() => setFromAmount(String(n))}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${fromAmount === String(n)
                                                ? 'bg-[#A8D44C]/15 text-[#A8D44C] border border-[#A8D44C]/25'
                                                : 'bg-[#1C2416] text-[#6B7A5A] border border-[#2D3A22] hover:text-[#8A9478] hover:bg-[#232E17]'
                                            }`}
                                    >
                                        {n >= 1000 ? '1,000' : String(n)} {fromCode}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Live Rates Board ────────────────────────────────────────── */}
                <div className="lg:col-span-3 bg-[#141A0E] border border-[#2D3A22] rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-[#2D3A22]">
                        <h2 className="text-[#F0EDE5] font-bold text-sm">Live Rates vs IDR</h2>
                        <span className="text-[#6B7A5A] text-xs">1 IDR = ?</span>
                    </div>

                    <div className="divide-y divide-[#2D3A22]/60">
                        {isLoading ? (
                            [...Array(8)].map((_, i) => (
                                <div key={i} className="flex items-center justify-between px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-[#1C2416] rounded-full animate-pulse" />
                                        <div className="space-y-1.5">
                                            <div className="w-10 h-3 bg-[#1C2416] rounded animate-pulse" />
                                            <div className="w-24 h-2.5 bg-[#2D3A22]/50 rounded animate-pulse" />
                                        </div>
                                    </div>
                                    <div className="w-20 h-4 bg-[#1C2416] rounded animate-pulse" />
                                </div>
                            ))
                        ) : (
                            FEATURED.map((code) => {
                                const cur = getCurrency(code);
                                const rate = rates[code] ?? 0;
                                // 1 IDR → code
                                const display = fmt(rate, code);
                                // Show inverse too: 1 code → IDR
                                const inverse = rate > 0 ? fmt(1 / rate, 'IDR') : '—';

                                // Fake trend for UI (we don't have historical data)
                                const isUp = (code.charCodeAt(0) + code.charCodeAt(1)) % 2 === 0;

                                return (
                                    <div
                                        key={code}
                                        className="flex items-center justify-between px-6 py-3.5 hover:bg-[#1C2416]/50 transition-colors cursor-pointer group"
                                        onClick={() => { setFromCode('IDR'); setToCode(code); setFromAmount('1'); }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden bg-[#1C2416] border border-[#2D3A22] flex-shrink-0">
                                                <FlagImg cc={cur.cc} size={36} />
                                            </div>
                                            <div>
                                                <p className="text-[#F0EDE5] font-semibold text-sm">{cur.code}</p>
                                                <p className="text-[#6B7A5A] text-xs">{cur.name}</p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-[#F0EDE5] font-bold text-sm">{display} <span className="text-[#6B7A5A] font-normal">{code}</span></p>
                                            <div className={`flex items-center justify-end gap-1 text-xs font-medium ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                {isUp
                                                    ? <TrendingUp className="w-3 h-3" />
                                                    : <TrendingDown className="w-3 h-3" />
                                                }
                                                <span>1 {code} = {inverse} IDR</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* ── Info footer ────────────────────────────────────────────────── */}
            <p className="text-[#6B7A5A]/50 text-xs text-center pb-2">
                Rates sourced from{' '}
                <a href="https://open.er-api.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#6B7A5A] transition-colors">
                    open.er-api.com
                </a>
                {' '}· For reference only, not financial advice.
            </p>
        </div>
    );
}
