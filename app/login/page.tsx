'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { PieChart, ArrowRight, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const justRegistered = searchParams.get('registered') === 'true';
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
                callbackUrl,
            });

            if (result?.error) {
                setError('Invalid email or password. Please try again.');
            } else if (result?.url) {
                router.push(result.url);
            }
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0C1208] flex flex-col overflow-x-hidden">

            {/* ── Subtle background texture ────────────────────────────────────── */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[radial-gradient(ellipse_at_top,rgba(168,212,76,0.07)_0%,transparent_65%)]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(168,212,76,0.04)_0%,transparent_70%)] -translate-x-1/4" />
                {/* Dot grid */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #A8D44C 1px, transparent 1px)',
                        backgroundSize: '32px 32px',
                    }}
                />
            </div>

            {/* ── Top bar ──────────────────────────────────────────────────────── */}
            <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="w-7 h-7 rounded-lg bg-[#A8D44C] flex items-center justify-center transition-opacity group-hover:opacity-85">
                        <PieChart className="w-3.5 h-3.5 text-[#0C1208]" strokeWidth={2} />
                    </div>
                    <span className="font-serif text-lg font-semibold text-[#F0EDE5] tracking-tight">FinTrack</span>
                </Link>
                <p className="text-sm text-[#6B7A5A]">
                    New here?{' '}
                    <Link href="/register" className="text-[#A8D44C] hover:text-[#B8E55C] font-medium transition-colors">
                        Create account
                    </Link>
                </p>
            </header>

            {/* ── Main content ─────────────────────────────────────────────────── */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-10">
                <div className="w-full max-w-[400px]">

                    {/* Heading */}
                    <div className="text-center mb-8">
                        <h1 className="font-serif text-4xl font-semibold tracking-tight text-[#F0EDE5] mb-2 sm:text-5xl">
                            Welcome back
                        </h1>
                        <p className="text-[#8A9478] text-sm">
                            Sign in to your FinTrack account.
                        </p>
                    </div>

                    {/* Registered success banner */}
                    {justRegistered && (
                        <div className="mb-5 flex items-start gap-3 p-4 bg-[#A8D44C]/10 border border-[#A8D44C]/25 text-[#A8D44C] rounded-xl text-sm">
                            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            Account created! Sign in to get started.
                        </div>
                    )}

                    {/* Error banner */}
                    {error && (
                        <div className="mb-5 flex items-start gap-3 p-4 bg-[#E07A5F]/10 border border-[#E07A5F]/25 text-[#E07A5F] rounded-xl text-sm">
                            <span className="flex-shrink-0 mt-0.5">⚠</span>
                            {error}
                        </div>
                    )}

                    {/* Form card */}
                    <div className="bg-[#141A0E] border border-[#2D3A22] rounded-2xl p-7 shadow-2xl shadow-black/30">
                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Email */}
                            <div className="space-y-1.5">
                                <label htmlFor="login-email" className="block text-xs font-medium text-[#8A9478] uppercase tracking-widest">
                                    Email address
                                </label>
                                <input
                                    id="login-email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    disabled={isLoading}
                                    placeholder="hello@example.com"
                                    autoComplete="email"
                                    className="w-full px-4 py-3 bg-[#1C2416] border border-[#2D3A22] rounded-xl text-[#F0EDE5] placeholder-[#6B7A5A] text-sm focus:outline-none focus:ring-1 focus:ring-[#A8D44C]/40 focus:border-[#A8D44C]/30 transition-all disabled:opacity-50"
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label htmlFor="login-password" className="block text-xs font-medium text-[#8A9478] uppercase tracking-widest">
                                        Password
                                    </label>
                                    {/* Forgot password placeholder — wire up when ready */}
                                    <span className="text-xs text-[#6B7A5A] hover:text-[#8A9478] cursor-pointer transition-colors">
                                        Forgot password?
                                    </span>
                                </div>
                                <div className="relative">
                                    <input
                                        id="login-password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        disabled={isLoading}
                                        placeholder="Your password"
                                        autoComplete="current-password"
                                        className="w-full px-4 py-3 pr-11 bg-[#1C2416] border border-[#2D3A22] rounded-xl text-[#F0EDE5] placeholder-[#6B7A5A] text-sm focus:outline-none focus:ring-1 focus:ring-[#A8D44C]/40 focus:border-[#A8D44C]/30 transition-all disabled:opacity-50"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(v => !v)}
                                        tabIndex={-1}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7A5A] hover:text-[#8A9478] transition-colors"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                id="login-submit"
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-2 bg-[#A8D44C] hover:bg-[#B8E55C] disabled:bg-[#2D3A22] disabled:text-[#6B7A5A] disabled:cursor-not-allowed text-[#0C1208] font-medium py-3.5 rounded-xl transition-all duration-200 active:scale-[0.98] group mt-1"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 rounded-full border-2 border-[#0C1208]/30 border-t-[#0C1208] animate-spin" />
                                        Signing in…
                                    </>
                                ) : (
                                    <>
                                        Sign in
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Social proof mini strip */}
                    <div className="mt-6 pt-6 border-t border-[#2D3A22] grid grid-cols-3 text-center gap-4">
                        <div>
                            <p className="font-serif text-xl font-semibold text-[#F0EDE5]">
                                50K<span className="text-[#A8D44C]">+</span>
                            </p>
                            <p className="text-[10px] text-[#6B7A5A] mt-0.5">Active users</p>
                        </div>
                        <div>
                            <p className="font-serif text-xl font-semibold text-[#F0EDE5]">
                                Free<span className="text-[#A8D44C]">.</span>
                            </p>
                            <p className="text-[10px] text-[#6B7A5A] mt-0.5">Forever</p>
                        </div>
                        <div>
                            <p className="font-serif text-xl font-semibold text-[#F0EDE5]">
                                4.9<span className="text-[#A8D44C]">★</span>
                            </p>
                            <p className="text-[10px] text-[#6B7A5A] mt-0.5">Rating</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* ── Footer ───────────────────────────────────────────────────────── */}
            <footer className="relative z-10 text-center py-6 px-6">
                <Link href="/" className="text-xs text-[#6B7A5A] hover:text-[#8A9478] transition-colors">
                    ← Back to homepage
                </Link>
            </footer>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0C1208]" />}>
            <LoginContent />
        </Suspense>
    );
}