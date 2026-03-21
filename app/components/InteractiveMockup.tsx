'use client';

import { useState } from 'react';
import {
    LayoutDashboard, Receipt, PieChart, Plus, Trash2,
    ArrowUpRight, ArrowDownRight, X, Check
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type TxType = 'INCOME' | 'EXPENSE';
type Page = 'dashboard' | 'transactions' | 'categories';

interface Tx {
    id: number;
    desc: string;
    amount: number;
    type: TxType;
    category: string;
    date: string;
}

// ─── Initial Data ─────────────────────────────────────────────────────────────
const INITIAL_TX: Tx[] = [
    { id: 1, desc: 'Freelance payment', amount: 5_000_000, type: 'INCOME', category: 'Freelance', date: '25 Feb' },
    { id: 2, desc: 'Makan siang', amount: 45_000, type: 'EXPENSE', category: 'Food', date: '25 Feb' },
    { id: 3, desc: 'Spotify', amount: 79_000, type: 'EXPENSE', category: 'Entertainment', date: '24 Feb' },
    { id: 4, desc: 'Gaji bulanan', amount: 8_000_000, type: 'INCOME', category: 'Salary', date: '20 Feb' },
    { id: 5, desc: 'Belanja bulanan', amount: 650_000, type: 'EXPENSE', category: 'Shopping', date: '19 Feb' },
];

const EXPENSE_CATS = ['Food', 'Entertainment', 'Shopping', 'Transport', 'Bills'];
const INCOME_CATS = ['Salary', 'Freelance', 'Investment', 'Other'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtRp(n: number) {
    if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)}K`;
    return `Rp ${n.toLocaleString()}`;
}

// ─── Nav items ────────────────────────────────────────────────────────────────
const NAV = [
    { id: 'dashboard' as Page, icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'transactions' as Page, icon: Receipt, label: 'Transactions' },
    { id: 'categories' as Page, icon: PieChart, label: 'Categories' },
];

// ─── Add form ─────────────────────────────────────────────────────────────────
function AddForm({ onAdd, onClose }: { onAdd: (tx: Omit<Tx, 'id'>) => void; onClose: () => void }) {
    const [type, setType] = useState<TxType>('EXPENSE');
    const [desc, setDesc] = useState('');
    const [amt, setAmt] = useState('');
    const [cat, setCat] = useState('');

    const cats = type === 'INCOME' ? INCOME_CATS : EXPENSE_CATS;

    const submit = () => {
        const amount = parseInt(amt.replace(/\D/g, ''), 10);
        if (!desc.trim() || !amount || !cat) return;
        onAdd({ desc, amount, type, category: cat, date: 'Today' });
        onClose();
    };

    return (
        <div className="absolute inset-0 z-20 bg-[#0C1208]/97 backdrop-blur-sm flex flex-col p-4 gap-3">
            <div className="flex items-center justify-between mb-1">
                <p className="text-[#F0EDE5] font-medium text-sm">Add Transaction</p>
                <button onClick={onClose} className="text-[#6B7A5A] hover:text-[#8A9478] transition-colors">
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Type toggle */}
            <div className="flex gap-1.5 bg-[#1C2416] p-1 rounded-lg border border-[#2D3A22]">
                {(['EXPENSE', 'INCOME'] as TxType[]).map(t => (
                    <button
                        key={t}
                        onClick={() => { setType(t); setCat(''); }}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                            type === t
                                ? t === 'INCOME'
                                    ? 'bg-[#A8D44C]/15 text-[#A8D44C] border border-[#A8D44C]/25'
                                    : 'bg-[#E07A5F]/15 text-[#E07A5F] border border-[#E07A5F]/25'
                                : 'text-[#6B7A5A] hover:text-[#8A9478]'
                        }`}
                    >
                        {t === 'INCOME' ? '↑ Income' : '↓ Expense'}
                    </button>
                ))}
            </div>

            {/* Inputs */}
            <input
                value={desc}
                onChange={e => setDesc(e.target.value)}
                placeholder="Description"
                className="w-full px-3 py-2 bg-[#1C2416] border border-[#2D3A22] rounded-lg text-[#F0EDE5] text-xs placeholder-[#6B7A5A] focus:outline-none focus:ring-1 focus:ring-[#A8D44C]/40 focus:border-[#A8D44C]/30 transition-all"
            />
            <input
                value={amt}
                onChange={e => setAmt(e.target.value)}
                placeholder="Amount (e.g. 50000)"
                type="number"
                min="0"
                className="w-full px-3 py-2 bg-[#1C2416] border border-[#2D3A22] rounded-lg text-[#F0EDE5] text-xs placeholder-[#6B7A5A] focus:outline-none focus:ring-1 focus:ring-[#A8D44C]/40 focus:border-[#A8D44C]/30 transition-all"
            />
            <select
                value={cat}
                onChange={e => setCat(e.target.value)}
                className="w-full px-3 py-2 bg-[#1C2416] border border-[#2D3A22] rounded-lg text-[#F0EDE5] text-xs focus:outline-none focus:ring-1 focus:ring-[#A8D44C]/40 focus:border-[#A8D44C]/30 transition-all"
                style={{ colorScheme: 'dark' }}
            >
                <option value="" disabled>Select category</option>
                {cats.map(c => <option key={c} value={c} className="bg-[#141A0E]">{c}</option>)}
            </select>

            <button
                onClick={submit}
                disabled={!desc.trim() || !amt || !cat}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${
                    !desc.trim() || !amt || !cat
                        ? 'bg-[#1C2416] text-[#6B7A5A] border border-[#2D3A22] cursor-not-allowed'
                        : type === 'INCOME'
                            ? 'bg-[#A8D44C] hover:bg-[#B8E55C] text-[#0C1208] active:scale-[0.98]'
                            : 'bg-[#E07A5F] hover:bg-[#E8896F] text-white active:scale-[0.98]'
                }`}
            >
                <Check className="w-3.5 h-3.5" />
                Save
            </button>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function InteractiveMockup() {
    const [txs, setTxs] = useState<Tx[]>(INITIAL_TX);
    const [page, setPage] = useState<Page>('dashboard');
    const [filter, setFilter] = useState<'ALL' | TxType>('ALL');
    const [adding, setAdding] = useState(false);
    const [deleted, setDeleted] = useState<number | null>(null);

    const income = txs.filter(t => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0);
    const expense = txs.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0);
    const balance = income - expense;

    const addTx = (tx: Omit<Tx, 'id'>) => {
        setTxs(prev => [{ ...tx, id: Date.now() }, ...prev]);
    };

    const deleteTx = (id: number) => {
        setDeleted(id);
        setTimeout(() => {
            setTxs(prev => prev.filter(t => t.id !== id));
            setDeleted(null);
        }, 250);
    };

    const filteredTxs = txs.filter(t => filter === 'ALL' || t.type === filter);

    // Category stats
    const catMap: Record<string, { count: number; type: TxType; total: number }> = {};
    txs.forEach(t => {
        if (!catMap[t.category]) catMap[t.category] = { count: 0, type: t.type, total: 0 };
        catMap[t.category].count++;
        catMap[t.category].total += t.amount;
    });
    const catList = Object.entries(catMap).sort((a, b) => b[1].total - a[1].total);

    return (
        <div className="relative w-full max-w-2xl mx-auto">
            {/* Subtle glow — brand green instead of blue/purple */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,212,76,0.12)_0%,transparent_70%)] rounded-3xl scale-105 pointer-events-none" />

            {/* Browser window */}
            <div className="relative bg-[#141A0E] border border-[#2D3A22] rounded-3xl overflow-hidden shadow-2xl shadow-black/50">

                {/* Window chrome */}
                <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#2D3A22] bg-[#0C1208]">
                    {/* Traffic lights */}
                    <span className="w-3 h-3 rounded-full bg-[#E07A5F]/70" />
                    <span className="w-3 h-3 rounded-full bg-[#D4A853]/70" />
                    <span className="w-3 h-3 rounded-full bg-[#A8D44C]/70" />

                    {/* URL bar */}
                    <div className="ml-3 flex-1 bg-[#1C2416] border border-[#2D3A22] rounded-full h-5 px-3 flex items-center">
                        <span className="text-[#6B7A5A] text-[10px]">fintrack.app/{page}</span>
                    </div>

                    {/* Add button */}
                    <button
                        onClick={() => setAdding(true)}
                        className="flex items-center gap-1 text-[10px] font-medium bg-[#A8D44C] hover:bg-[#B8E55C] text-[#0C1208] px-2.5 py-1 rounded-full transition-all active:scale-95"
                    >
                        <Plus className="w-3 h-3" />
                        Add
                    </button>
                </div>

                {/* App body */}
                <div className="flex h-72 relative">

                    {/* Add form overlay */}
                    {adding && <AddForm onAdd={addTx} onClose={() => setAdding(false)} />}

                    {/* Sidebar */}
                    <div className="hidden sm:flex w-36 border-r border-[#2D3A22] flex-col p-3 gap-1 flex-shrink-0 bg-[#0C1208]">
                        {/* Logo inside mockup */}
                        <div className="font-serif font-semibold text-sm mb-3 px-2 text-[#A8D44C]">
                            FinTrack
                        </div>

                        {/* Nav */}
                        {NAV.map(({ id, icon: Icon, label }) => (
                            <button
                                key={id}
                                onClick={() => setPage(id)}
                                className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-[11px] font-medium text-left transition-all ${
                                    page === id
                                        ? 'bg-[#A8D44C]/12 text-[#A8D44C] border border-[#A8D44C]/20'
                                        : 'text-[#6B7A5A] hover:text-[#8A9478] hover:bg-[#1C2416]'
                                }`}
                            >
                                <Icon className={`w-3 h-3 flex-shrink-0 ${page === id ? 'text-[#A8D44C]' : 'text-[#6B7A5A]'}`} />
                                {label}
                            </button>
                        ))}

                        {/* Mini stats */}
                        <div className="mt-auto pt-3 border-t border-[#2D3A22] space-y-1.5 px-1">
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] text-[#6B7A5A] font-medium">Balance</span>
                                <span className={`text-[9px] font-medium ${balance >= 0 ? 'text-[#A8D44C]' : 'text-[#E07A5F]'}`}>
                                    {fmtRp(Math.abs(balance))}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] text-[#6B7A5A] font-medium">Txs</span>
                                <span className="text-[9px] font-medium text-[#8A9478]">{txs.length}</span>
                            </div>
                        </div>
                    </div>

                    {/* Main content */}
                    <div className="flex-1 overflow-y-auto">

                        {/* ── Dashboard page ───────────────────────────── */}
                        {page === 'dashboard' && (
                            <div className="p-4 space-y-3">
                                <p className="text-[#6B7A5A] text-[9px] font-medium uppercase tracking-widest">Overview</p>

                                {/* Cards */}
                                <div className="grid grid-cols-3 gap-2">
                                    {/* Balance card — accent */}
                                    <div className="bg-[#A8D44C]/10 border border-[#A8D44C]/20 rounded-xl p-2.5 col-span-1">
                                        <p className="text-[#A8D44C]/70 text-[9px] font-medium">Balance</p>
                                        <p className={`font-semibold text-sm mt-1 ${balance < 0 ? 'text-[#E07A5F]' : 'text-[#A8D44C]'}`}>
                                            {fmtRp(Math.abs(balance))}
                                        </p>
                                    </div>
                                    {/* Income card */}
                                    <div className="bg-[#1C2416] border border-[#2D3A22] rounded-xl p-2.5">
                                        <p className="text-[#A8D44C]/70 text-[9px] font-medium">Income</p>
                                        <p className="text-[#F0EDE5] font-semibold text-sm mt-1">{fmtRp(income)}</p>
                                    </div>
                                    {/* Expense card */}
                                    <div className="bg-[#1C2416] border border-[#2D3A22] rounded-xl p-2.5">
                                        <p className="text-[#E07A5F]/70 text-[9px] font-medium">Expenses</p>
                                        <p className="text-[#F0EDE5] font-semibold text-sm mt-1">{fmtRp(expense)}</p>
                                    </div>
                                </div>

                                {/* Recent transactions */}
                                <div className="bg-[#1C2416] border border-[#2D3A22] rounded-xl overflow-hidden">
                                    <p className="text-[#6B7A5A] text-[9px] font-medium uppercase tracking-widest px-3 pt-2.5 pb-1">Recent</p>
                                    <div className="divide-y divide-[#2D3A22]">
                                        {txs.slice(0, 4).map(t => (
                                            <div
                                                key={t.id}
                                                className={`flex items-center justify-between px-3 py-2 transition-all ${deleted === t.id ? 'opacity-0 scale-y-0' : 'opacity-100'}`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                                        t.type === 'INCOME'
                                                            ? 'bg-[#A8D44C]/12 border border-[#A8D44C]/20'
                                                            : 'bg-[#E07A5F]/12 border border-[#E07A5F]/20'
                                                    }`}>
                                                        {t.type === 'INCOME'
                                                            ? <ArrowUpRight className="w-2.5 h-2.5 text-[#A8D44C]" />
                                                            : <ArrowDownRight className="w-2.5 h-2.5 text-[#E07A5F]" />
                                                        }
                                                    </div>
                                                    <span className="text-[#8A9478] text-[11px] truncate max-w-[120px]">{t.desc}</span>
                                                </div>
                                                <span className={`text-[11px] font-medium ${t.type === 'INCOME' ? 'text-[#A8D44C]' : 'text-[#E07A5F]'}`}>
                                                    {t.type === 'INCOME' ? '+' : '-'}{fmtRp(t.amount)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Transactions page ─────────────────────── */}
                        {page === 'transactions' && (
                            <div className="p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-[#6B7A5A] text-[9px] font-medium uppercase tracking-widest">All Transactions</p>
                                    <div className="flex gap-1">
                                        {(['ALL', 'INCOME', 'EXPENSE'] as const).map(f => (
                                            <button
                                                key={f}
                                                onClick={() => setFilter(f)}
                                                className={`text-[9px] font-medium px-2 py-0.5 rounded-md transition-all ${
                                                    filter === f
                                                        ? f === 'INCOME'
                                                            ? 'bg-[#A8D44C]/15 text-[#A8D44C]'
                                                            : f === 'EXPENSE'
                                                                ? 'bg-[#E07A5F]/15 text-[#E07A5F]'
                                                                : 'bg-[#2D3A22] text-[#8A9478]'
                                                        : 'text-[#6B7A5A] hover:text-[#8A9478]'
                                                }`}
                                            >
                                                {f === 'ALL' ? 'All' : f === 'INCOME' ? 'In' : 'Out'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-[#1C2416] border border-[#2D3A22] rounded-xl overflow-hidden">
                                    {filteredTxs.length > 0 ? (
                                        <div className="divide-y divide-[#2D3A22]">
                                            {filteredTxs.map(t => (
                                                <div
                                                    key={t.id}
                                                    className={`flex items-center justify-between px-3 py-2.5 hover:bg-[#2D3A22]/40 group transition-all ${deleted === t.id ? 'opacity-0' : 'opacity-100'}`}
                                                >
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                                            t.type === 'INCOME'
                                                                ? 'bg-[#A8D44C]/12 border border-[#A8D44C]/20'
                                                                : 'bg-[#E07A5F]/12 border border-[#E07A5F]/20'
                                                        }`}>
                                                            {t.type === 'INCOME'
                                                                ? <ArrowUpRight className="w-3 h-3 text-[#A8D44C]" />
                                                                : <ArrowDownRight className="w-3 h-3 text-[#E07A5F]" />
                                                            }
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-[#F0EDE5] text-[11px] font-medium truncate">{t.desc}</p>
                                                            <p className="text-[#6B7A5A] text-[9px]">{t.category} · {t.date}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                                        <span className={`text-[11px] font-medium ${t.type === 'INCOME' ? 'text-[#A8D44C]' : 'text-[#E07A5F]'}`}>
                                                            {t.type === 'INCOME' ? '+' : '-'}{fmtRp(t.amount)}
                                                        </span>
                                                        <button
                                                            onClick={() => deleteTx(t.id)}
                                                            className="opacity-0 group-hover:opacity-100 text-[#6B7A5A] hover:text-[#E07A5F] transition-all"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-8 text-center text-[#6B7A5A] text-xs">
                                            No transactions found.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ── Categories page ───────────────────────── */}
                        {page === 'categories' && (
                            <div className="p-4 space-y-3">
                                <p className="text-[#6B7A5A] text-[9px] font-medium uppercase tracking-widest">Categories</p>
                                <div className="space-y-1.5">
                                    {catList.map(([name, { count, type, total }]) => (
                                        <div key={name} className="flex items-center justify-between bg-[#1C2416] border border-[#2D3A22] rounded-xl px-3 py-2.5 hover:border-[#A8D44C]/20 transition-colors">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                                                    type === 'INCOME'
                                                        ? 'bg-[#A8D44C]/12 border border-[#A8D44C]/20'
                                                        : 'bg-[#E07A5F]/12 border border-[#E07A5F]/20'
                                                }`}>
                                                    <PieChart className={`w-3 h-3 ${type === 'INCOME' ? 'text-[#A8D44C]' : 'text-[#E07A5F]'}`} />
                                                </div>
                                                <div>
                                                    <p className="text-[#F0EDE5] text-[11px] font-medium">{name}</p>
                                                    <p className="text-[#6B7A5A] text-[9px]">{count} transaction{count > 1 ? 's' : ''}</p>
                                                </div>
                                            </div>
                                            <span className={`text-[11px] font-medium ${type === 'INCOME' ? 'text-[#A8D44C]' : 'text-[#E07A5F]'}`}>
                                                {fmtRp(total)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer hint */}
                <div className="border-t border-[#2D3A22] bg-[#0C1208] px-4 py-2 flex items-center justify-between">
                    {/* Mobile bottom nav */}
                    <div className="flex gap-3">
                        {NAV.map(({ id, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setPage(id)}
                                className={`sm:hidden w-7 h-7 flex items-center justify-center rounded-lg transition-all ${
                                    page === id
                                        ? 'bg-[#A8D44C]/12 text-[#A8D44C] border border-[#A8D44C]/20'
                                        : 'text-[#6B7A5A] hover:text-[#8A9478]'
                                }`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                            </button>
                        ))}
                    </div>
                    <p className="text-[#6B7A5A] text-[9px] font-medium">
                        ✦ Interactive demo — try adding a transaction!
                    </p>
                </div>
            </div>
        </div>
    );
}