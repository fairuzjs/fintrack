import prisma from "@/lib/prisma";
import { PieChart, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import AddCategoryForm from "../../components/AddCategoryForm";
import DeleteCategoryButton from "../../components/DeleteCategoryButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function CategoriesPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect('/login');

    const userId = (session.user as any).id;

    const categories = await prisma.category.findMany({
        where: { userId },
        orderBy: { name: 'asc' },
        include: { _count: { select: { transactions: true } } }
    });

    const incomeCategories = categories.filter((c: any) => c.type === 'INCOME');
    const expenseCategories = categories.filter((c: any) => c.type === 'EXPENSE');

    return (
        <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">

            {/* Header */}
            <header>
                <h1 className="text-3xl font-serif font-semibold tracking-tight text-[#F0EDE5]">Categories</h1>
                <p className="text-[#6B7A5A] mt-1 text-sm">Create custom labels to organize your income and expenses.</p>
            </header>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Total', value: categories.length, color: 'text-[#F0EDE5]' },
                    { label: 'Expense', value: expenseCategories.length, color: 'text-rose-400' },
                    { label: 'Income', value: incomeCategories.length, color: 'text-emerald-400' },
                ].map(({ label, value, color }) => (
                    <div key={label} className="bg-[#141A0E] border border-[#2D3A22] rounded-xl px-4 py-3">
                        <p className="text-[#6B7A5A] text-xs font-medium mb-1">{label}</p>
                        <p className={`text-xl font-bold ${color}`}>{value} <span className="text-[#6B7A5A] text-xs font-medium">categories</span></p>
                    </div>
                ))}
            </div>

            {/* Add Category Form */}
            <AddCategoryForm />

            {/* Category Lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Expense Categories */}
                <div className="bg-[#141A0E] border border-[#2D3A22] rounded-2xl overflow-hidden">
                    <div className="flex items-center gap-3 px-6 py-4 border-b border-[#2D3A22]">
                        <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                            <ArrowDownCircle className="w-4 h-4 text-rose-400" />
                        </div>
                        <h2 className="text-[#F0EDE5] font-bold text-sm">Expense Categories</h2>
                        <span className="ml-auto bg-[#1C2416] text-[#6B7A5A] px-2 py-0.5 rounded-md text-xs font-bold border border-[#2D3A22]">
                            {expenseCategories.length}
                        </span>
                    </div>

                    <div className="divide-y divide-[#2D3A22]/60">
                        {expenseCategories.length > 0 ? expenseCategories.map((cat: any) => (
                            <div key={cat.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-[#1C2416]/50 transition-colors group">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0">
                                        <PieChart className="w-3.5 h-3.5 text-rose-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-[#F0EDE5] text-sm truncate">{cat.name}</p>
                                        <p className="text-[#6B7A5A] text-xs mt-0.5">
                                            {cat._count.transactions} transaction{cat._count.transactions !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-4">
                                    <DeleteCategoryButton id={cat.id} />
                                </div>
                            </div>
                        )) : (
                            <div className="py-12 text-center">
                                <p className="text-[#6B7A5A] text-sm">No expense categories yet.</p>
                                <p className="text-[#6B7A5A]/60 text-xs mt-1">Add one using the form above.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Income Categories */}
                <div className="bg-[#141A0E] border border-[#2D3A22] rounded-2xl overflow-hidden">
                    <div className="flex items-center gap-3 px-6 py-4 border-b border-[#2D3A22]">
                        <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                            <ArrowUpCircle className="w-4 h-4 text-emerald-400" />
                        </div>
                        <h2 className="text-[#F0EDE5] font-bold text-sm">Income Categories</h2>
                        <span className="ml-auto bg-[#1C2416] text-[#6B7A5A] px-2 py-0.5 rounded-md text-xs font-bold border border-[#2D3A22]">
                            {incomeCategories.length}
                        </span>
                    </div>

                    <div className="divide-y divide-[#2D3A22]/60">
                        {incomeCategories.length > 0 ? incomeCategories.map((cat: any) => (
                            <div key={cat.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-[#1C2416]/50 transition-colors group">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                        <PieChart className="w-3.5 h-3.5 text-emerald-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-[#F0EDE5] text-sm truncate">{cat.name}</p>
                                        <p className="text-[#6B7A5A] text-xs mt-0.5">
                                            {cat._count.transactions} transaction{cat._count.transactions !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-4">
                                    <DeleteCategoryButton id={cat.id} />
                                </div>
                            </div>
                        )) : (
                            <div className="py-12 text-center">
                                <p className="text-[#6B7A5A] text-sm">No income categories yet.</p>
                                <p className="text-[#6B7A5A]/60 text-xs mt-1">Add one using the form above.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
