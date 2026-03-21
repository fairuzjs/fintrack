import { ArrowDownIcon, ArrowUpIcon, CreditCard, Wallet, BarChart3 } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import CurrencyDisplay from "../components/CurrencyDisplay";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import SpendingDonutChart from "../components/charts/SpendingDonutChart";
import MonthlyBarChart from "../components/charts/MonthlyBarChart";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  const userId = (session.user as any).id;

  const transactions = await prisma.transaction.findMany({
    where: { userId },
    take: 6,
    orderBy: { date: 'desc' },
    include: { category: true }
  });

  const allTransactions = await prisma.transaction.findMany({
    where: { userId },
    include: { category: true },
    orderBy: { date: 'asc' },
  });

  let totalIncome = 0;
  let totalExpense = 0;
  const expensesByCategory: Record<string, number> = {};
  const monthlyMap: Record<string, { income: number; expense: number }> = {};

  const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  allTransactions.forEach((t: any) => {
    if (t.type === 'INCOME') totalIncome += t.amount;
    if (t.type === 'EXPENSE') {
      totalExpense += t.amount;
      const catName = t.category?.name || 'Uncategorized';
      expensesByCategory[catName] = (expensesByCategory[catName] || 0) + t.amount;
    }
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!monthlyMap[key]) monthlyMap[key] = { income: 0, expense: 0 };
    if (t.type === 'INCOME') monthlyMap[key].income += t.amount;
    if (t.type === 'EXPENSE') monthlyMap[key].expense += t.amount;
  });

  const totalBalance = totalIncome - totalExpense;

  const now = new Date();
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    return {
      month: MONTH_LABELS[d.getMonth()],
      income: monthlyMap[key]?.income ?? 0,
      expense: monthlyMap[key]?.expense ?? 0,
    };
  });

  const categorySpending = Object.entries(expensesByCategory)
    .map(([name, amount]) => ({
      name,
      value: amount,
      amount,
      percentage: totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 6);

  const userName = session.user?.name?.split(' ')[0] || 'there';

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">

      {/* ── Dot grid background decoration */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.018] -z-10"
        style={{
          backgroundImage: 'radial-gradient(circle, #A8D44C 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="flex justify-between items-start">
        <div>
          <p className="text-[#6B7A5A] text-sm font-medium mb-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h1 className="text-3xl font-serif font-semibold tracking-tight text-[#F0EDE5]">
            Hello, {userName}
          </h1>
          <p className="text-[#6B7A5A] mt-1 text-sm">Here&apos;s your financial overview.</p>
        </div>
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-semibold text-[#6B7A5A] hover:text-[#8A9478] border border-[#2D3A22] hover:border-[#3D4E2C] px-3 py-2 rounded-lg transition-all flex-shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
          <span className="hidden sm:inline">Back to Home</span>
        </Link>
      </header>

      {/* ── Summary Cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Balance */}
        <div className="relative p-6 bg-[#141A0E] border border-[#A8D44C]/20 rounded-2xl overflow-hidden shadow-xl shadow-black/30 group">
          {/* Glow blob */}
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-[#A8D44C]/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-[#A8D44C]/5 rounded-full blur-xl" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <p className="text-[#8A9478] text-sm font-medium">Total Balance</p>
              <div className="p-2 bg-[#A8D44C]/15 border border-[#A8D44C]/20 rounded-lg">
                <Wallet className="w-4 h-4 text-[#A8D44C]" />
              </div>
            </div>
            <CurrencyDisplay
              amount={totalBalance}
              className="text-4xl font-extrabold tracking-tight text-[#F0EDE5] drop-shadow"
            />
            <p className="text-[#6B7A5A] text-xs mt-2 font-medium">
              {allTransactions.length} total transactions
            </p>
          </div>
        </div>

        {/* Income */}
        <div className="p-6 bg-[#141A0E] border border-[#2D3A22] rounded-2xl hover:border-[#3D4E2C] transition-all group">
          <div className="flex items-center justify-between mb-6">
            <p className="text-[#8A9478] text-sm font-medium">Total Income</p>
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
              <ArrowUpIcon className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <CurrencyDisplay amount={totalIncome} className="text-3xl font-bold tracking-tight text-[#F0EDE5]" />
          <div className="flex items-center gap-1.5 mt-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <p className="text-emerald-400/70 text-xs font-medium">
              {allTransactions.filter((t: any) => t.type === 'INCOME').length} income entries
            </p>
          </div>
        </div>

        {/* Expenses */}
        <div className="p-6 bg-[#141A0E] border border-[#2D3A22] rounded-2xl hover:border-[#3D4E2C] transition-all group">
          <div className="flex items-center justify-between mb-6">
            <p className="text-[#8A9478] text-sm font-medium">Total Expenses</p>
            <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg group-hover:bg-rose-500/20 transition-colors">
              <ArrowDownIcon className="w-4 h-4 text-rose-400" />
            </div>
          </div>
          <CurrencyDisplay amount={totalExpense} className="text-3xl font-bold tracking-tight text-[#F0EDE5]" />
          <div className="flex items-center gap-1.5 mt-2">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <p className="text-rose-400/70 text-xs font-medium">
              {allTransactions.filter((t: any) => t.type === 'EXPENSE').length} expense entries
            </p>
          </div>
        </div>
      </div>

      {/* ── Charts Row ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Donut chart */}
        <div className="bg-[#141A0E] border border-[#2D3A22] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="p-1.5 bg-rose-500/10 border border-rose-500/20 rounded-lg">
              <BarChart3 className="w-4 h-4 text-rose-400" />
            </div>
            <h2 className="text-[#F0EDE5] font-bold text-sm">Spending by Category</h2>
          </div>
          <SpendingDonutChart data={categorySpending} />
        </div>

        {/* Monthly bar chart */}
        <div className="bg-[#141A0E] border border-[#2D3A22] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="p-1.5 bg-[#A8D44C]/10 border border-[#A8D44C]/20 rounded-lg">
              <BarChart3 className="w-4 h-4 text-[#A8D44C]" />
            </div>
            <h2 className="text-[#F0EDE5] font-bold text-sm">Monthly Overview (6 months)</h2>
          </div>
          <MonthlyBarChart data={monthlyData} />
        </div>
      </div>

      {/* ── Transaction List ────────────────────────────────────────────────── */}
      <div className="bg-[#141A0E] border border-[#2D3A22] rounded-2xl overflow-hidden">
        <div className="flex justify-between items-center px-6 py-5 border-b border-[#2D3A22]">
          <h2 className="text-[#F0EDE5] font-bold text-base">Recent Transactions</h2>
          <Link
            href="/dashboard/transactions"
            className="text-xs font-semibold text-[#A8D44C] hover:text-[#B8E55C] bg-[#A8D44C]/10 hover:bg-[#A8D44C]/20 border border-[#A8D44C]/20 px-3 py-1.5 rounded-lg transition-all"
          >
            View All →
          </Link>
        </div>

        <div className="divide-y divide-[#2D3A22]/60">
          {transactions.map((t: any) => (
            <div key={t.id} className="flex items-center justify-between px-6 py-4 hover:bg-[#1C2416]/50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${t.type === 'INCOME'
                  ? 'bg-emerald-500/10 border border-emerald-500/20'
                  : 'bg-rose-500/10 border border-rose-500/20'
                  }`}>
                  {t.type === 'INCOME'
                    ? <Wallet className="w-4 h-4 text-emerald-400" />
                    : <CreditCard className="w-4 h-4 text-rose-400" />
                  }
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-[#F0EDE5] text-sm truncate max-w-[180px]">{t.description}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${t.type === 'INCOME'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-[#1C2416] text-[#6B7A5A]'
                      }`}>
                      {t.category?.name || 'Uncategorized'}
                    </span>
                    <span className="text-[#6B7A5A] text-xs">
                      {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
              <CurrencyDisplay
                amount={t.amount}
                className={`font-bold text-sm ${t.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'}`}
                showSign
                incomeType={t.type}
              />
            </div>
          ))}

          {transactions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <div className="w-14 h-14 bg-[#1C2416] border border-[#2D3A22] rounded-2xl flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6 text-[#6B7A5A]" />
              </div>
              <p className="text-[#8A9478] font-semibold text-sm mb-1">No transactions yet</p>
              <p className="text-[#6B7A5A] text-xs">Click &quot;Add Transaction&quot; to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
