'use client';

import { useState, useTransition } from 'react';
import { Trash2, AlertTriangle, X, Check } from 'lucide-react';
import { deleteTransaction } from '@/app/actions/transaction';
import { useToast } from '../context/ToastContext';

export default function DeleteTransactionButton({ id }: { id: string }) {
    const [confirming, setConfirming] = useState(false);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleDelete = () => {
        startTransition(async () => {
            try {
                await deleteTransaction(id);
                toast('Transaction deleted successfully', 'success');
            } catch {
                toast('Failed to delete transaction', 'error');
            }
        });
    };

    if (confirming) {
        return (
            <div className="flex items-center gap-1.5 bg-[#0d1117] border border-rose-500/30 rounded-lg px-2 py-1 shadow-lg">
                <AlertTriangle className="w-3 h-3 text-amber-400 flex-shrink-0" />
                <span className="text-white/50 text-[10px] font-medium whitespace-nowrap">Delete?</span>
                <button
                    onClick={handleDelete}
                    disabled={isPending}
                    className="flex items-center justify-center w-5 h-5 bg-rose-500 hover:bg-rose-400 rounded text-white transition-colors disabled:opacity-50"
                    title="Confirm delete"
                >
                    <Check className="w-3 h-3" />
                </button>
                <button
                    onClick={() => setConfirming(false)}
                    className="flex items-center justify-center w-5 h-5 bg-white/10 hover:bg-white/20 rounded text-white/60 transition-colors"
                    title="Cancel"
                >
                    <X className="w-3 h-3" />
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => setConfirming(true)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-white/20 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
            title="Delete transaction"
        >
            <Trash2 className="w-3.5 h-3.5" />
        </button>
    );
}
