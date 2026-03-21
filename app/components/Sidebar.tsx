'use client';

import Link from "next/link";
import { LayoutDashboard, Receipt, PieChart, PlusCircle, LogOut, Globe, ChevronRight, Menu, X, ArrowLeftRight } from "lucide-react";
import { useState } from "react";
import { signOut } from "next-auth/react";
import AddTransactionModal from "./modals/AddTransactionModal";
import { useCurrency } from "../context/CurrencyContext";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/transactions', icon: Receipt, label: 'Transactions' },
    { href: '/dashboard/categories', icon: PieChart, label: 'Categories' },
    { href: '/dashboard/currency', icon: ArrowLeftRight, label: 'Currency' },
];

export default function Sidebar({ categories = [] }: { categories?: any[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const { currency, toggleCurrency } = useCurrency();
    const pathname = usePathname();

    const closeMobile = () => setIsMobileOpen(false);

    // ─── Sidebar inner content (shared between desktop & mobile drawer) ───────
    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="px-5 py-5 border-b border-[#2D3A22] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#A8D44C] flex items-center justify-center shadow-lg shadow-[#A8D44C]/20">
                        <PieChart className="w-4 h-4 text-[#0C1208]" />
                    </div>
                    <span className="font-serif text-[#F0EDE5] font-bold text-lg tracking-tight">FinTrack</span>
                </div>
                {/* Close button — mobile only */}
                <button
                    onClick={closeMobile}
                    className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-[#6B7A5A] hover:text-[#F0EDE5] hover:bg-[#1C2416] transition-all"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                <p className="text-[#6B7A5A] text-[10px] font-bold uppercase tracking-widest px-3 mb-3">
                    Menu
                </p>
                {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            onClick={closeMobile}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group ${isActive
                                ? 'bg-[#A8D44C]/10 text-[#A8D44C] border border-[#A8D44C]/20 shadow-sm'
                                : 'text-[#6B7A5A] hover:text-[#F0EDE5] hover:bg-[#1C2416]'
                                }`}
                        >
                            <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#A8D44C]' : 'text-[#6B7A5A] group-hover:text-[#8A9478]'}`} />
                            {label}
                            {isActive && (
                                <ChevronRight className="w-3.5 h-3.5 ml-auto text-[#A8D44C]/60" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom actions */}
            <div className="px-3 pb-5 space-y-2 border-t border-[#2D3A22] pt-4">
                {/* Add Transaction */}
                <button
                    onClick={() => { closeMobile(); setIsModalOpen(true); }}
                    className="w-full flex items-center justify-center gap-2 bg-[#A8D44C] hover:bg-[#B8E55C] text-[#0C1208] px-4 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-[#A8D44C]/10 transition-all active:scale-[0.98]"
                >
                    <PlusCircle className="w-4 h-4" />
                    Add Transaction
                </button>

                {/* Currency toggle */}
                <button
                    onClick={toggleCurrency}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium border border-[#2D3A22] bg-[#1C2416] hover:bg-[#232E17] text-[#6B7A5A] hover:text-[#8A9478] transition-all"
                >
                    <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[#6B7A5A]" />
                        <span>Currency</span>
                    </div>
                    <span className="bg-[#A8D44C]/10 text-[#A8D44C] border border-[#A8D44C]/20 px-2 py-0.5 rounded-md text-xs font-bold">
                        {currency}
                    </span>
                </button>

                {/* Sign out */}
                <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="w-full flex items-center justify-center gap-2 border border-[#2D3A22] hover:bg-[#E07A5F]/[0.08] text-[#6B7A5A] hover:text-[#E07A5F] hover:border-[#E07A5F]/20 px-4 py-2.5 rounded-xl font-medium text-sm transition-all"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* ── Desktop sidebar ─────────────────────────────────────────────── */}
            <aside className="w-64 bg-[#0C1208] border-r border-[#2D3A22] hidden md:flex flex-col flex-shrink-0">
                <SidebarContent />
            </aside>

            {/* ── Mobile top bar ──────────────────────────────────────────────── */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-[#0C1208]/95 backdrop-blur-md border-b border-[#2D3A22] flex items-center justify-between px-4">
                {/* Hamburger */}
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl text-[#6B7A5A] hover:text-[#F0EDE5] hover:bg-[#1C2416] transition-all"
                    aria-label="Open menu"
                >
                    <Menu className="w-5 h-5" />
                </button>

                {/* Logo (centered on mobile) */}
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#A8D44C] flex items-center justify-center">
                        <PieChart className="w-3.5 h-3.5 text-[#0C1208]" />
                    </div>
                    <span className="font-serif text-[#F0EDE5] font-bold tracking-tight">FinTrack</span>
                </div>

                {/* Quick add (top right on mobile) */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#A8D44C] text-[#0C1208] shadow-md shadow-[#A8D44C]/20 hover:bg-[#B8E55C] transition-all active:scale-95"
                    aria-label="Add transaction"
                >
                    <PlusCircle className="w-4.5 h-4.5" />
                </button>
            </div>

            {/* ── Mobile drawer overlay ───────────────────────────────────────── */}
            {isMobileOpen && (
                <div
                    className="md:hidden fixed inset-0 z-50 flex"
                    role="dialog"
                    aria-modal="true"
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={closeMobile}
                    />

                    {/* Drawer panel */}
                    <div className="relative w-72 max-w-[85vw] bg-[#0C1208] border-r border-[#2D3A22] flex flex-col shadow-2xl shadow-black/50 animate-in slide-in-from-left duration-300">
                        <SidebarContent />
                    </div>
                </div>
            )}

            {/* ── Mobile bottom navigation bar ───────────────────────────────── */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0C1208]/95 backdrop-blur-md border-t border-[#2D3A22] flex items-center justify-around px-2 pb-safe">
                {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex flex-col items-center gap-1 px-4 py-3 rounded-xl transition-all ${isActive
                                ? 'text-[#A8D44C]'
                                : 'text-[#6B7A5A] hover:text-[#8A9478]'
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-[#A8D44C]' : ''}`} />
                            <span className="text-[10px] font-semibold">{label}</span>
                            {isActive && (
                                <span className="absolute -bottom-0 w-4 h-0.5 bg-[#A8D44C] rounded-full" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Modal */}
            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                categories={categories}
            />
        </>
    );
}
