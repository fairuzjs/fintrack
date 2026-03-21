'use client';

import { useState } from 'react';
import { addCategory } from '@/app/actions/category';
import { Plus } from 'lucide-react';

export default function AddCategoryForm() {
    const [type, setType] = useState('EXPENSE');
    const [name, setName] = useState('');
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    return (
        <form
            action={async () => {
                if (!name.trim()) return;
                setIsPending(true);
                setError(null);

                const formData = new FormData();
                formData.append('name', name);
                formData.append('type', type);

                const result = await addCategory(formData);
                setIsPending(false);

                if (result?.error) {
                    setError(result.error);
                } else {
                    setName('');
                }
            }}
            className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-end relative"
        >
            <div className="flex-1 w-full flex flex-col sm:flex-row gap-3 items-end">
                {/* Name input */}
                <div className="flex-1 w-full space-y-1.5">
                    <label className="block text-xs font-semibold text-white/30 uppercase tracking-widest">
                        Category Name
                    </label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Netflix Subscription"
                        disabled={isPending}
                        className="w-full px-4 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/40 transition-all disabled:opacity-50"
                    />
                </div>

                {/* Type toggle */}
                <div className="w-full sm:w-44 space-y-1.5">
                    <label className="block text-xs font-semibold text-white/30 uppercase tracking-widest">
                        Type
                    </label>
                    <div className="flex bg-white/[0.05] border border-white/[0.08] p-1 rounded-xl gap-1">
                        {['EXPENSE', 'INCOME'].map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setType(t)}
                                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${type === t
                                        ? t === 'EXPENSE'
                                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                        : 'text-white/30 hover:text-white/50'
                                    }`}
                            >
                                {t === 'EXPENSE' ? 'Expense' : 'Income'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={isPending || !name.trim()}
                className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all sm:flex-shrink-0 w-full sm:w-auto ${isPending || !name.trim()
                        ? 'bg-white/[0.05] text-white/20 cursor-not-allowed border border-white/[0.06]'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 active:scale-[0.98]'
                    }`}
            >
                {isPending ? (
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                    <>
                        <Plus className="w-4 h-4" />
                        Add Category
                    </>
                )}
            </button>

            {/* Error toast */}
            {error && (
                <div className="absolute -bottom-10 left-0 right-0 sm:left-auto sm:right-0 sm:w-auto text-xs font-semibold text-rose-300 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-xl">
                    ⚠ {error}
                </div>
            )}
        </form>
    );
}
