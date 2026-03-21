'use client';

import { useState } from 'react';
import { addTransaction } from '@/app/actions/transaction';
import { X, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

export default function AddTransactionModal({
    categories,
    onClose,
    isOpen
}: {
    categories: { id: number, name: string, type: string }[],
    onClose: () => void,
    isOpen: boolean
}) {
    const [type, setType] = useState('EXPENSE');

    if (!isOpen) return null;

    const filteredCategories = categories.filter(c => c.type === type);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Modal */}
            <div className="relative bg-[#141A0E] border border-[#2D3A22] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-[#2D3A22]">
                    <h2 className="text-[#F0EDE5] font-serif font-bold text-lg">Add Transaction</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-[#6B7A5A] hover:text-[#F0EDE5] hover:bg-[#1C2416] transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form
                    action={async (formData) => {
                        formData.append('type', type);
                        await addTransaction(formData);
                        onClose();
                    }}
                    className="p-6 space-y-5"
                >
                    {/* Type Toggle */}
                    <div className="flex bg-[#1C2416] border border-[#2D3A22] p-1 rounded-xl gap-1">
                        <button
                            type="button"
                            onClick={() => setType('INCOME')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all ${type === 'INCOME'
                                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 shadow-sm'
                                    : 'text-[#6B7A5A] hover:text-[#8A9478]'
                                }`}
                        >
                            <ArrowUpCircle className="w-4 h-4" />
                            Income
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('EXPENSE')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all ${type === 'EXPENSE'
                                    ? 'bg-rose-500/15 text-rose-400 border border-rose-500/25 shadow-sm'
                                    : 'text-[#6B7A5A] hover:text-[#8A9478]'
                                }`}
                        >
                            <ArrowDownCircle className="w-4 h-4" />
                            Expense
                        </button>
                    </div>

                    {/* Amount */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-[#6B7A5A] uppercase tracking-widest">
                            Amount (IDR)
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7A5A] font-bold pointer-events-none">Rp</span>
                            <input
                                name="amount"
                                type="number"
                                step="1"
                                min="1"
                                required
                                placeholder="0"
                                className="w-full pl-11 pr-4 py-3 bg-[#1C2416] border border-[#2D3A22] rounded-xl text-[#F0EDE5] font-bold placeholder-[#6B7A5A]/50 text-base focus:outline-none focus:ring-1 focus:ring-[#A8D44C]/40 focus:border-[#A8D44C]/30 transition-all"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-[#6B7A5A] uppercase tracking-widest">
                            Description
                        </label>
                        <input
                            name="description"
                            type="text"
                            required
                            placeholder="e.g. Grocery run"
                            className="w-full px-4 py-3 bg-[#1C2416] border border-[#2D3A22] rounded-xl text-[#F0EDE5] placeholder-[#6B7A5A]/50 text-sm focus:outline-none focus:ring-1 focus:ring-[#A8D44C]/40 focus:border-[#A8D44C]/30 transition-all"
                        />
                    </div>

                    {/* Date */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-[#6B7A5A] uppercase tracking-widest">
                            Date
                        </label>
                        <input
                            name="date"
                            type="date"
                            required
                            defaultValue={new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-3 bg-[#1C2416] border border-[#2D3A22] rounded-xl text-[#8A9478] focus:text-[#F0EDE5] text-sm focus:outline-none focus:ring-1 focus:ring-[#A8D44C]/40 focus:border-[#A8D44C]/30 transition-all [color-scheme:dark]"
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-[#6B7A5A] uppercase tracking-widest">
                            Category
                        </label>
                        <select
                            name="categoryId"
                            defaultValue=""
                            className="w-full px-4 py-3 bg-[#1C2416] border border-[#2D3A22] rounded-xl text-[#8A9478] focus:text-[#F0EDE5] text-sm focus:outline-none focus:ring-1 focus:ring-[#A8D44C]/40 focus:border-[#A8D44C]/30 transition-all cursor-pointer"
                            style={{ colorScheme: 'dark' }}
                        >
                            <option value="" disabled className="bg-[#141A0E]">Select a category…</option>
                            {filteredCategories.length > 0 ? (
                                filteredCategories.map(cat => (
                                    <option key={cat.id} value={cat.id} className="bg-[#141A0E] text-[#F0EDE5]">{cat.name}</option>
                                ))
                            ) : (
                                <option disabled className="bg-[#141A0E] text-[#6B7A5A]">No {type.toLowerCase()} categories yet</option>
                            )}
                        </select>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 py-3.5 mt-2 rounded-xl font-bold bg-[#A8D44C] hover:bg-[#B8E55C] text-[#0C1208] text-sm transition-all shadow-md shadow-[#A8D44C]/10 active:scale-[0.98]"
                    >
                        Save {type === 'INCOME' ? 'Income' : 'Expense'}
                    </button>
                </form>
            </div>
        </div>
    );
}
