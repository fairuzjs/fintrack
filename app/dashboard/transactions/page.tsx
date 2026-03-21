import prisma from "@/lib/prisma";
import { CreditCard, Wallet, Search, CalendarDays } from "lucide-react";
import DeleteTransactionButton from "../../components/DeleteTransactionButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import CurrencyDisplay from "../../components/CurrencyDisplay";
import DownloadPdfButton from "../../components/DownloadPdfButton";

// ─── Date preset helpers ───────────────────────────────────────────────────────
function getDateRange(preset: string): { from: Date; to: Date } | null {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);

    switch (preset) {
        case 'today':
            return { from: today, to: tomorrow };
        case 'week': {
            const from = new Date(today);
            from.setDate(today.getDate() - today.getDay());
            return { from, to: tomorrow };
        }
        case 'month': {
            const from = new Date(today.getFullYear(), today.getMonth(), 1);
            return { from, to: tomorrow };
        }
        case 'last_month': {
            const from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const to = new Date(today.getFullYear(), today.getMonth(), 1);
            return { from, to };
        }
        default:
            return null;
    }
}

const DATE_PRESETS = [
    { value: '', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'last_month', label: 'Last Month' },
];

export default async function TransactionsPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; type?: string; preset?: string; from?: string; to?: string }>;
}) {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect('/login');

    const userId = (session.user as any).id;
    const params = await searchParams;
    const q = params.q || '';
    const typeStr = params.type || 'ALL';
    const preset = params.preset || '';
    const fromStr = params.from || '';
    const toStr = params.to || '';

    const whereClause: any = { userId };
    if (q) whereClause.description = { contains: q, mode: 'insensitive' };
    if (typeStr !== 'ALL') whereClause.type = typeStr;

    if (preset) {
        const range = getDateRange(preset);
        if (range) whereClause.date = { gte: range.from, lt: range.to };
    } else if (fromStr || toStr) {
        const dateFilter: any = {};
        if (fromStr) dateFilter.gte = new Date(fromStr);
        if (toStr) dateFilter.lt = new Date(new Date(toStr).setDate(new Date(toStr).getDate() + 1));
        whereClause.date = dateFilter;
    }

    const transactions = await prisma.transaction.findMany({
        where: whereClause,
        orderBy: { date: 'desc' },
        include: { category: true }
    });

    const totalIncome = transactions.filter((t: any) => t.type === 'INCOME').reduce((s: number, t: any) => s + t.amount, 0);
    const totalExpense = transactions.filter((t: any) => t.type === 'EXPENSE').reduce((s: number, t: any) => s + t.amount, 0);

    const hasFilter = q || typeStr !== 'ALL' || preset || fromStr || toStr;
    const activePreset = DATE_PRESETS.find(p => p.value === preset);

    return (
        <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">

            {/* Header */}
            <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
                <div>
                    <h1 className="text-3xl font-serif font-semibold tracking-tight text-[#F0EDE5]">Transactions</h1>
                    <p className="text-[#6B7A5A] mt-1 text-sm">Search, filter, and manage your complete history.</p>
                </div>
                <div className="flex-shrink-0">
                    <DownloadPdfButton 
                        transactions={transactions}
                        totalIncome={totalIncome}
                        totalExpense={totalExpense}
                        filterContext={activePreset?.label || (fromStr || toStr ? `${fromStr || '...'} → ${toStr || '...'}` : 'All Time')}
                    />
                </div>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Showing', value: `${transactions.length}`, sub: 'transactions' },
                    { label: 'Income', value: null, amount: totalIncome, color: 'text-emerald-400' },
                    { label: 'Expenses', value: null, amount: totalExpense, color: 'text-rose-400' },
                ].map(({ label, value, amount, color, sub }: any) => (
                    <div key={label} className="bg-[#141A0E] border border-[#2D3A22] rounded-xl px-4 py-3">
                        <p className="text-[#6B7A5A] text-xs font-medium mb-1">{label}</p>
                        {value !== null
                            ? <p className="text-xl font-bold text-[#F0EDE5]">{value} <span className="text-[#6B7A5A] text-xs font-medium">{sub}</span></p>
                            : <CurrencyDisplay amount={amount} className={`text-xl font-bold ${color}`} />
                        }
                    </div>
                ))}
            </div>

            {/* ── Date Preset Pills ──────────────────────────────────────────────── */}
            <div className="space-y-3">
                {/* Row 1: label + preset pills */}
                <div className="flex flex-wrap gap-2 items-center">
                    <span className="flex items-center gap-1.5 text-[#6B7A5A] text-xs font-semibold flex-shrink-0">
                        <CalendarDays className="w-3.5 h-3.5" />
                        Period:
                    </span>
                    {DATE_PRESETS.map(p => {
                        const isActive = p.value === '' ? !preset && !fromStr && !toStr : p.value === preset;

                        const qs = new URLSearchParams();
                        if (q) qs.set('q', q);
                        if (typeStr !== 'ALL') qs.set('type', typeStr);
                        if (p.value) qs.set('preset', p.value);

                        return (
                            <a
                                key={p.value}
                                href={`/dashboard/transactions${qs.toString() ? '?' + qs.toString() : ''}`}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${isActive
                                        ? 'bg-[#A8D44C]/15 text-[#A8D44C] border border-[#A8D44C]/25'
                                        : 'bg-[#141A0E] text-[#6B7A5A] border border-[#2D3A22] hover:text-[#8A9478] hover:bg-[#1C2416]'
                                    }`}
                            >
                                {p.label}
                            </a>
                        );
                    })}
                </div>

                {/* Row 2: Custom date range — full width, nicely structured */}
                <form method="GET" action="/dashboard/transactions" className="bg-[#141A0E] border border-[#2D3A22] rounded-xl px-4 py-3">
                    {q && <input type="hidden" name="q" value={q} />}
                    {typeStr !== 'ALL' && <input type="hidden" name="type" value={typeStr} />}
                    <p className="text-[#6B7A5A] text-[10px] font-bold uppercase tracking-widest mb-2">Custom range</p>
                    <div className="flex flex-wrap gap-2 items-center">
                        <input
                            name="from"
                            type="date"
                            defaultValue={fromStr}
                            className="flex-1 min-w-[130px] text-xs bg-[#1C2416] border border-[#2D3A22] rounded-lg px-3 py-2 text-[#8A9478] focus:outline-none focus:ring-1 focus:ring-[#A8D44C]/40 [color-scheme:dark]"
                        />
                        <span className="text-[#6B7A5A] text-xs flex-shrink-0">→</span>
                        <input
                            name="to"
                            type="date"
                            defaultValue={toStr}
                            className="flex-1 min-w-[130px] text-xs bg-[#1C2416] border border-[#2D3A22] rounded-lg px-3 py-2 text-[#8A9478] focus:outline-none focus:ring-1 focus:ring-[#A8D44C]/40 [color-scheme:dark]"
                        />
                        <button type="submit" className="flex-shrink-0 text-xs font-semibold bg-[#A8D44C] hover:bg-[#B8E55C] text-[#0C1208] px-4 py-2 rounded-lg transition-all">
                            Apply
                        </button>
                    </div>
                </form>
            </div>

            {/* ── Search & Type Filter ───────────────────────────────────────────── */}
            <form method="GET" action="/dashboard/transactions" className="flex flex-col sm:flex-row gap-3">
                {preset && <input type="hidden" name="preset" value={preset} />}
                {fromStr && <input type="hidden" name="from" value={fromStr} />}
                {toStr && <input type="hidden" name="to" value={toStr} />}

                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7A5A] w-4 h-4 pointer-events-none" />
                    <input
                        name="q"
                        defaultValue={q}
                        type="text"
                        placeholder="Search by description..."
                        className="w-full pl-10 pr-4 py-2.5 bg-[#141A0E] border border-[#2D3A22] rounded-xl text-[#F0EDE5] placeholder-[#6B7A5A] text-sm focus:outline-none focus:ring-1 focus:ring-[#A8D44C]/40 focus:border-[#A8D44C]/30 transition-all"
                    />
                </div>

                <div className="flex gap-2">
                    <select
                        name="type"
                        defaultValue={typeStr}
                        className="px-3 py-2.5 bg-[#141A0E] border border-[#2D3A22] rounded-xl text-[#8A9478] text-sm focus:outline-none focus:ring-1 focus:ring-[#A8D44C]/40 cursor-pointer transition-all"
                    >
                        <option value="ALL" className="bg-[#141A0E]">All Types</option>
                        <option value="INCOME" className="bg-[#141A0E]">Income</option>
                        <option value="EXPENSE" className="bg-[#141A0E]">Expense</option>
                    </select>

                    <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#A8D44C] hover:bg-[#B8E55C] text-[#0C1208] rounded-xl font-semibold text-sm shadow-md shadow-[#A8D44C]/10 transition-all"
                    >
                        Search
                    </button>

                    {hasFilter && (
                        <a
                            href="/dashboard/transactions"
                            className="px-4 py-2.5 border border-[#2D3A22] text-[#6B7A5A] hover:text-[#8A9478] hover:bg-[#1C2416] rounded-xl text-sm font-medium transition-all flex items-center"
                        >
                            Clear
                        </a>
                    )}
                </div>
            </form>

            {/* ── Active filter info ─────────────────────────────────────────────── */}
            {(activePreset?.value || fromStr || toStr) && (
                <div className="flex items-center gap-2 text-xs text-[#A8D44C]/70 bg-[#A8D44C]/[0.07] border border-[#A8D44C]/20 px-3 py-2 rounded-lg w-fit">
                    <CalendarDays className="w-3.5 h-3.5" />
                    {activePreset?.value
                        ? `Filtered by: ${activePreset.label}`
                        : `Custom range: ${fromStr || '...'} → ${toStr || '...'}`
                    }
                </div>
            )}

            {/* ── Transactions List ──────────────────────────────────────────────── */}
            <div className="bg-[#141A0E] border border-[#2D3A22] rounded-2xl overflow-hidden">
                {transactions.length > 0 ? (
                    <div className="divide-y divide-[#2D3A22]/60">
                        {/* Table header */}
                        <div className="hidden sm:grid grid-cols-[auto_1fr_auto_auto] gap-4 px-6 py-3 border-b border-[#2D3A22]">
                            <div className="w-10" />
                            <p className="text-[#6B7A5A] text-xs font-bold uppercase tracking-widest">Description</p>
                            <p className="text-[#6B7A5A] text-xs font-bold uppercase tracking-widest text-right pr-16">Amount</p>
                            <div className="w-8" />
                        </div>

                        {transactions.map((t: any) => (
                            <div key={t.id} className="flex items-center justify-between px-6 py-4 hover:bg-[#1C2416]/50 transition-colors group">
                                <div className="flex items-center gap-4 min-w-0 flex-1">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${t.type === 'INCOME'
                                            ? 'bg-emerald-500/10 border border-emerald-500/20'
                                            : 'bg-rose-500/10 border border-rose-500/20'
                                        }`}>
                                        {t.type === 'INCOME'
                                            ? <Wallet className="w-4 h-4 text-emerald-400" />
                                            : <CreditCard className="w-4 h-4 text-rose-400" />
                                        }
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-[#F0EDE5] text-sm truncate">{t.description}</p>
                                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${t.type === 'INCOME'
                                                    ? 'bg-emerald-500/10 text-emerald-400'
                                                    : 'bg-[#1C2416] text-[#6B7A5A]'
                                                }`}>
                                                {t.category?.name || 'Uncategorized'}
                                            </span>
                                            <span className="text-[#6B7A5A] text-xs">
                                                {new Date(t.date).toLocaleDateString('en-US', {
                                                    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                                    <CurrencyDisplay
                                        amount={t.amount}
                                        className={`font-bold text-sm ${t.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'}`}
                                        showSign
                                        incomeType={t.type}
                                    />
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <DeleteTransactionButton id={t.id} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 bg-[#1C2416] border border-[#2D3A22] rounded-2xl flex items-center justify-center mb-4">
                            <Search className="w-7 h-7 text-[#6B7A5A]" />
                        </div>
                        <p className="text-[#8A9478] font-semibold mb-1">No transactions found</p>
                        <p className="text-[#6B7A5A] text-sm max-w-xs">
                            {hasFilter
                                ? "Try adjusting your filters or search term."
                                : "Add your first transaction using the sidebar button."}
                        </p>
                        {hasFilter && (
                            <a href="/dashboard/transactions" className="mt-4 text-[#A8D44C] hover:text-[#B8E55C] text-sm font-medium transition-colors">
                                Clear all filters
                            </a>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
