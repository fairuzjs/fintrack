'use client';

import Link from 'next/link';
import { PieChart, Menu, X, ChevronRight, LayoutDashboard, LogOut } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';

const NAV_LINKS = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Testimonials', href: '#testimonials' },
];

// ─── User avatar (initials) ───────────────────────────────────────────────────
function UserAvatar({ name }: { name: string }) {
    const initials = name
        .split(' ')
        .map(w => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
    return (
        <div className="w-8 h-8 rounded-full bg-[#A8D44C]/15 border border-[#A8D44C]/25 flex items-center justify-center text-[#A8D44C] text-xs font-medium flex-shrink-0">
            {initials}
        </div>
    );
}

export default function LandingNav() {
    const { data: session, status } = useSession();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const isLoggedIn = status === 'authenticated';
    const isLoading = status === 'loading';
    const userName = session?.user?.name ?? session?.user?.email ?? 'Account';
    const shortName = userName.split(' ')[0];

    // Scroll-triggered navbar background
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Close mobile menu on resize → desktop
    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth >= 768) {
                setMobileOpen(false);
                setUserMenuOpen(false);
            }
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    // ── Silent idle timeout (landing page only) ──────────────────────────────
    // After 2 minutes of no activity, silently sign out.
    const IDLE_MS = 2 * 60 * 1000;
    const LANDING_EVENTS = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'] as const;
    const idleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const resetIdle = useCallback(() => {
        if (idleRef.current) clearTimeout(idleRef.current);
        idleRef.current = setTimeout(() => {
            signOut({ redirect: false });
        }, IDLE_MS);
    }, [IDLE_MS]);

    useEffect(() => {
        if (!isLoggedIn) {
            if (idleRef.current) clearTimeout(idleRef.current);
            return;
        }
        LANDING_EVENTS.forEach(e => window.addEventListener(e, resetIdle, { passive: true }));
        resetIdle();

        return () => {
            if (idleRef.current) clearTimeout(idleRef.current);
            LANDING_EVENTS.forEach(e => window.removeEventListener(e, resetIdle));
        };
    }, [isLoggedIn, resetIdle]);

    // Smooth scroll handler for anchor links
    const handleAnchor = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (!href.startsWith('#')) return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setMobileOpen(false);
    };

    return (
        <>
            {/* ── Desktop / base navbar ──────────────────────────────────────── */}
            <nav
                className={`fixed top-0 w-full z-50 transition-all duration-300 ${
                    scrolled
                        ? 'bg-[#0C1208]/90 backdrop-blur-xl border-b border-[#2D3A22] shadow-xl shadow-black/30'
                        : 'bg-transparent'
                }`}
            >
                <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 sm:h-[72px] flex items-center justify-between">

                    {/* Logo — scrolls to top on click */}
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="flex items-center gap-2.5 flex-shrink-0 group"
                        aria-label="Return to top"
                    >
                        <div className="w-7 h-7 rounded-lg bg-[#A8D44C] flex items-center justify-center transition-opacity group-hover:opacity-85">
                            <PieChart className="w-3.5 h-3.5 text-[#0C1208]" strokeWidth={2} />
                        </div>
                        <span className="font-serif text-lg font-semibold text-[#F0EDE5] tracking-tight">
                            FinTrack
                        </span>
                    </button>

                    {/* Desktop nav links */}
                    <div className="hidden md:flex items-center gap-1">
                        {NAV_LINKS.map(({ label, href }) => (
                            <a
                                key={href}
                                href={href}
                                onClick={(e) => handleAnchor(e, href)}
                                className="px-4 py-2 text-sm text-[#8A9478] hover:text-[#F0EDE5] font-medium rounded-lg hover:bg-[#1C2416] transition-all duration-200"
                            >
                                {label}
                            </a>
                        ))}
                    </div>

                    {/* ── Desktop: right side (auth-aware) ───────────────────── */}
                    <div className="hidden md:flex items-center gap-3">
                        {isLoading ? (
                            // Skeleton while session loads
                            <div className="w-24 h-8 bg-[#1C2416] rounded-full animate-pulse" />
                        ) : isLoggedIn ? (
                            // ── Logged-in state ──────────────────────────────
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(v => !v)}
                                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-[#2D3A22] bg-[#141A0E] hover:bg-[#1C2416] hover:border-[#6B7A5A] transition-all"
                                >
                                    <UserAvatar name={userName} />
                                    <span className="text-[#F0EDE5]/80 text-sm font-medium max-w-[120px] truncate">
                                        {shortName}
                                    </span>
                                    <ChevronRight
                                        className={`w-3.5 h-3.5 text-[#6B7A5A] transition-transform duration-200 ${userMenuOpen ? 'rotate-90' : ''}`}
                                    />
                                </button>

                                {/* Dropdown */}
                                {userMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                                        <div className="absolute right-0 top-full mt-2 z-20 w-52 bg-[#141A0E] border border-[#2D3A22] rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">
                                            {/* User info header */}
                                            <div className="px-4 py-3 border-b border-[#2D3A22]">
                                                <p className="text-[#F0EDE5] font-medium text-sm truncate">{userName}</p>
                                                <p className="text-[#6B7A5A] text-xs mt-0.5 truncate">{session?.user?.email}</p>
                                            </div>

                                            {/* Actions */}
                                            <div className="p-1.5 space-y-0.5">
                                                <Link
                                                    href="/dashboard"
                                                    onClick={() => setUserMenuOpen(false)}
                                                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-[#8A9478] hover:text-[#F0EDE5] hover:bg-[#1C2416] rounded-xl transition-all"
                                                >
                                                    <LayoutDashboard className="w-4 h-4 text-[#A8D44C]" />
                                                    Go to Dashboard
                                                </Link>
                                                <button
                                                    onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: '/login' }); }}
                                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#6B7A5A] hover:text-rose-400 hover:bg-rose-500/[0.08] rounded-xl transition-all"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            // ── Logged-out state ─────────────────────────────
                            <>
                                <Link
                                    href="/login"
                                    className="text-sm text-[#8A9478] hover:text-[#F0EDE5] font-medium px-4 py-2 rounded-lg hover:bg-[#1C2416] transition-all"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/register"
                                    className="flex items-center gap-1.5 text-sm font-medium bg-[#A8D44C] hover:bg-[#B8E55C] text-[#0C1208] px-5 py-2.5 rounded-full transition-all duration-200 hover:-translate-y-0.5"
                                >
                                    Get Started
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMobileOpen(v => !v)}
                        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                        className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-[#8A9478] hover:text-[#F0EDE5] border border-[#2D3A22] hover:border-[#6B7A5A] hover:bg-[#1C2416] transition-all"
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </nav>

            {/* ── Mobile full-screen menu ────────────────────────────────────── */}
            {mobileOpen && (
                <div className="fixed inset-0 z-40 md:hidden flex flex-col">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-[#0C1208]/97 backdrop-blur-xl"
                        onClick={() => setMobileOpen(false)}
                    />

                    <div className="relative flex flex-col h-full pt-24 px-6 pb-10">

                        {/* Logged-in user info (mobile) */}
                        {isLoggedIn && (
                            <div className="flex items-center gap-3 mb-6 p-4 bg-[#141A0E] border border-[#2D3A22] rounded-2xl">
                                <UserAvatar name={userName} />
                                <div className="min-w-0">
                                    <p className="text-[#F0EDE5] font-medium text-sm truncate">{userName}</p>
                                    <p className="text-[#6B7A5A] text-xs truncate">{session?.user?.email}</p>
                                </div>
                            </div>
                        )}

                        {/* Nav links */}
                        <div className="flex flex-col gap-1 mb-8">
                            {NAV_LINKS.map(({ label, href }) => (
                                <a
                                    key={href}
                                    href={href}
                                    onClick={(e) => handleAnchor(e, href)}
                                    className="flex items-center justify-between px-4 py-4 text-lg font-medium text-[#8A9478] hover:text-[#F0EDE5] hover:bg-[#141A0E] rounded-2xl transition-all border border-transparent hover:border-[#2D3A22]"
                                >
                                    {label}
                                    <ChevronRight className="w-4 h-4 text-[#6B7A5A]" />
                                </a>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="w-full h-px bg-[#2D3A22] mb-8" />

                        {/* CTA buttons */}
                        <div className="flex flex-col gap-3">
                            {isLoggedIn ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        onClick={() => setMobileOpen(false)}
                                        className="w-full flex items-center justify-center gap-2 bg-[#A8D44C] hover:bg-[#B8E55C] text-[#0C1208] font-medium py-4 rounded-2xl text-base transition-all active:scale-[0.98]"
                                    >
                                        <LayoutDashboard className="w-5 h-5" />
                                        Go to Dashboard
                                    </Link>
                                    <button
                                        onClick={() => { setMobileOpen(false); signOut({ callbackUrl: '/login' }); }}
                                        className="w-full flex items-center justify-center gap-2 text-[#6B7A5A] hover:text-rose-400 font-medium py-4 rounded-2xl text-base border border-[#2D3A22] hover:border-rose-500/20 hover:bg-rose-500/[0.06] transition-all"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/register"
                                        onClick={() => setMobileOpen(false)}
                                        className="w-full flex items-center justify-center gap-2 bg-[#A8D44C] hover:bg-[#B8E55C] text-[#0C1208] font-medium py-4 rounded-2xl text-base transition-all active:scale-[0.98]"
                                    >
                                        Create free account
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                    <Link
                                        href="/login"
                                        onClick={() => setMobileOpen(false)}
                                        className="w-full flex items-center justify-center text-[#8A9478] hover:text-[#F0EDE5] font-medium py-4 rounded-2xl text-base border border-[#2D3A22] hover:bg-[#141A0E] transition-all"
                                    >
                                        Log in to my account
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Bottom tagline */}
                        {!isLoggedIn && (
                            <p className="mt-auto text-center text-[#6B7A5A] text-xs pt-6">
                                Free forever · No credit card required
                            </p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}