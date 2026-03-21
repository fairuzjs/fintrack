'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    PieChart, ArrowRight, CheckCircle2,
    BarChart3, ShieldCheck, Globe, Eye, EyeOff,
} from 'lucide-react';

const PERKS = [
    { icon: BarChart3,   label: 'Beautiful financial dashboard' },
    { icon: Globe,       label: 'Real-time IDR & USD rates'     },
    { icon: ShieldCheck, label: 'bcrypt-encrypted & private'    },
];

const PASSWORD_REQUIREMENTS = [
    { label: 'At least 8 characters', test: (p: string) => p.length >= 8   },
    { label: 'At least one number',   test: (p: string) => /\d/.test(p)    },
];

export default function RegisterPage() {
    const router = useRouter();
    const [name,            setName]            = useState('');
    const [email,           setEmail]           = useState('');
    const [password,        setPassword]        = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword,    setShowPassword]    = useState(false);
    const [showConfirm,     setShowConfirm]     = useState(false);
    const [error,           setError]           = useState<string | null>(null);
    const [isLoading,       setIsLoading]       = useState(false);

    const passwordsMatch = confirmPassword === '' || password === confirmPassword;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsLoading(true);
        try {
            const res  = await fetch('/api/register', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ name, email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Registration failed. Please try again.');
            router.push('/login?registered=true');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#0C1208] min-h-screen flex flex-col">

            {/* Dot grid — full page */}
            <div
                className="pointer-events-none fixed inset-0 opacity-[0.025]"
                style={{
                    backgroundImage: 'radial-gradient(circle, #A8D44C 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                }}
            />
            {/* Radial glow */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[radial-gradient(ellipse_at_top,rgba(168,212,76,0.07)_0%,transparent_65%)]" />
            </div>

            {/* Top bar */}
            <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10 flex-shrink-0">
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="w-7 h-7 rounded-lg bg-[#A8D44C] flex items-center justify-center transition-opacity group-hover:opacity-85">
                        <PieChart className="w-3.5 h-3.5 text-[#0C1208]" strokeWidth={2} />
                    </div>
                    <span className="font-serif text-lg font-semibold text-[#F0EDE5] tracking-tight">FinTrack</span>
                </Link>
                <p className="text-sm text-[#6B7A5A]">
                    Already have an account?{' '}
                    <Link href="/login" className="text-[#A8D44C] hover:text-[#B8E55C] font-medium transition-colors">
                        Sign in
                    </Link>
                </p>
            </header>

            {/* Form area */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-6 sm:px-10">
                <div className="w-full max-w-sm sm:max-w-lg xl:max-w-xl">

                    {/* Heading */}
                    <div className="mb-7">
                        <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#F0EDE5] xl:text-4xl">
                            Create account
                        </h1>
                        <p className="text-[#8A9478] text-sm mt-1.5">
                            Free forever. No credit card required.
                        </p>
                    </div>

                    {/* Error banner */}
                    {error && (
                        <div className="mb-5 flex items-start gap-3 p-4 bg-[#E07A5F]/10 border border-[#E07A5F]/25 text-[#E07A5F] rounded-xl text-sm">
                            <span className="flex-shrink-0 mt-0.5">⚠</span>
                            {error}
                        </div>
                    )}

                    {/* Form card */}
                    <div className="bg-[#141A0E] border border-[#2D3A22] rounded-2xl p-6 shadow-2xl shadow-black/30">
                        <form onSubmit={handleSubmit} noValidate>

                            {/* Row 1: Full Name + Email */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label htmlFor="register-name" className="block text-xs font-medium text-[#8A9478] uppercase tracking-widest">
                                        Full name
                                    </label>
                                    <input
                                        id="register-name"
                                        type="text"
                                        required
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        disabled={isLoading}
                                        placeholder="John Doe"
                                        autoComplete="name"
                                        className="w-full px-4 py-2.5 bg-[#1C2416] border border-[#2D3A22] rounded-xl text-[#F0EDE5] placeholder-[#6B7A5A] text-sm focus:outline-none focus:ring-1 focus:ring-[#A8D44C]/40 focus:border-[#A8D44C]/30 transition-all disabled:opacity-50"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label htmlFor="register-email" className="block text-xs font-medium text-[#8A9478] uppercase tracking-widest">
                                        Email address
                                    </label>
                                    <input
                                        id="register-email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        disabled={isLoading}
                                        placeholder="hello@example.com"
                                        autoComplete="email"
                                        className="w-full px-4 py-2.5 bg-[#1C2416] border border-[#2D3A22] rounded-xl text-[#F0EDE5] placeholder-[#6B7A5A] text-sm focus:outline-none focus:ring-1 focus:ring-[#A8D44C]/40 focus:border-[#A8D44C]/30 transition-all disabled:opacity-50"
                                    />
                                </div>
                            </div>

                            {/* Row 2: Password + Confirm Password */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">

                                {/* Password */}
                                <div className="space-y-1.5">
                                    <label htmlFor="register-password" className="block text-xs font-medium text-[#8A9478] uppercase tracking-widest">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="register-password"
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            disabled={isLoading}
                                            placeholder="Min. 8 characters"
                                            autoComplete="new-password"
                                            className="w-full px-4 py-2.5 pr-11 bg-[#1C2416] border border-[#2D3A22] rounded-xl text-[#F0EDE5] placeholder-[#6B7A5A] text-sm focus:outline-none focus:ring-1 focus:ring-[#A8D44C]/40 focus:border-[#A8D44C]/30 transition-all disabled:opacity-50"
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
                                    {/* Strength hints */}
                                    <div className="flex flex-col gap-1 pt-0.5 transition-all duration-200 opacity-100">
                                        <p className="text-[11px] font-medium text-[#8A9478] mb-0.5">Password requirements:</p>
                                        {PASSWORD_REQUIREMENTS.map(({ label, test }) => (
                                            <div key={label} className="flex items-center gap-1.5">
                                                <CheckCircle2 className={`w-3 h-3 flex-shrink-0 transition-colors ${test(password) ? 'text-[#A8D44C]' : 'text-[#2D3A22]'}`} />
                                                <span className={`text-[11px] transition-colors ${test(password) ? 'text-[#8A9478]' : 'text-[#6B7A5A]'}`}>
                                                    {label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-1.5">
                                    <label htmlFor="register-confirm-password" className="block text-xs font-medium text-[#8A9478] uppercase tracking-widest">
                                        Confirm password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="register-confirm-password"
                                            type={showConfirm ? 'text' : 'password'}
                                            required
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            disabled={isLoading}
                                            placeholder="Re-enter your password"
                                            autoComplete="new-password"
                                            className={`w-full px-4 py-2.5 pr-11 bg-[#1C2416] rounded-xl text-[#F0EDE5] placeholder-[#6B7A5A] text-sm focus:outline-none focus:ring-1 transition-all disabled:opacity-50 border ${
                                                !passwordsMatch
                                                    ? 'border-[#E07A5F]/50 focus:ring-[#E07A5F]/30 focus:border-[#E07A5F]/50'
                                                    : confirmPassword && password === confirmPassword
                                                        ? 'border-[#A8D44C]/40 focus:ring-[#A8D44C]/30 focus:border-[#A8D44C]/40'
                                                        : 'border-[#2D3A22] focus:ring-[#A8D44C]/40 focus:border-[#A8D44C]/30'
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirm(v => !v)}
                                            tabIndex={-1}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7A5A] hover:text-[#8A9478] transition-colors"
                                            aria-label={showConfirm ? 'Hide password' : 'Show password'}
                                        >
                                            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {/* Match indicator */}
                                    <div className={`flex items-center gap-1.5 text-[11px] pt-0.5 transition-all duration-200 ${confirmPassword.length > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'} ${passwordsMatch ? 'text-[#A8D44C]' : 'text-[#E07A5F]'}`}>
                                        <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                                        {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                                    </div>
                                </div>
                            </div>

                            {/* Terms + Submit */}
                            <div className="mt-5 space-y-4">
                                <p className="text-[#6B7A5A] text-xs leading-relaxed">
                                    By creating an account, you agree to our{' '}
                                    <span className="text-[#8A9478] underline underline-offset-2 cursor-pointer hover:text-[#F0EDE5] transition-colors">Terms of Service</span>
                                    {' '}and{' '}
                                    <span className="text-[#8A9478] underline underline-offset-2 cursor-pointer hover:text-[#F0EDE5] transition-colors">Privacy Policy</span>.
                                </p>
                                <button
                                    id="register-submit"
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex items-center justify-center gap-2 bg-[#A8D44C] hover:bg-[#B8E55C] disabled:bg-[#2D3A22] disabled:text-[#6B7A5A] disabled:cursor-not-allowed text-[#0C1208] font-medium py-3 rounded-xl transition-all duration-200 active:scale-[0.98] group"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-4 h-4 rounded-full border-2 border-[#0C1208]/30 border-t-[#0C1208] animate-spin" />
                                            Creating account…
                                        </>
                                    ) : (
                                        <>
                                            Create free account
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </div>

                        </form>
                    </div>

                    {/* Perks strip */}
                    <div className="mt-5 flex items-center justify-center gap-4 flex-wrap">
                        {PERKS.map(({ icon: Icon, label }) => (
                            <div key={label} className="flex items-center gap-1.5 text-[#6B7A5A] text-xs">
                                <Icon className="w-3.5 h-3.5 text-[#A8D44C]/70 flex-shrink-0" strokeWidth={1.5} />
                                {label}
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 flex-shrink-0 text-center py-5 px-6">
                <Link href="/" className="text-xs text-[#6B7A5A] hover:text-[#8A9478] transition-colors">
                    ← Back to homepage
                </Link>
            </footer>
        </div>
    );
}