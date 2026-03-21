import Link from 'next/link';
import {
    ArrowRight, BarChart3, Zap, ShieldCheck, Globe,
    PieChart, TrendingUp, CreditCard, CheckCircle2,
    Star
} from 'lucide-react';
import LandingNav from './components/LandingNav';
import InteractiveMockup from './components/InteractiveMockup';
import AnimatedSection from './components/AnimatedSection';
import AnimatedGrid, { AnimatedGridItem } from './components/AnimatedGrid';
import AnimatedStats from './components/AnimatedStats';
import TypewriterText from './components/TypewriterText';
import FooterPopups from './components/FooterPopups';

// ─── Static Data ─────────────────────────────────────────────────────────────
const stats = [
    { value: '50K+', label: 'Active Users' },
    { value: '$2.4B', label: 'Transactions Tracked' },
    { value: '99.9%', label: 'Uptime' },
    { value: '4.9★', label: 'Average Rating' },
];

const features = [
    {
        icon: BarChart3,
        title: 'Smart Dashboard',
        desc: 'Visualize your finances at a glance. Dynamic charts, balance summaries, and category breakdowns update in real time.',
    },
    {
        icon: Zap,
        title: 'Lightning Fast',
        desc: 'Built on Next.js App Router with Server Actions — zero-latency mutations and instant page transitions.',
    },
    {
        icon: ShieldCheck,
        title: 'Private & Secure',
        desc: 'Your data is encrypted with bcrypt and isolated per-user via NextAuth JWT sessions. Only you see your numbers.',
    },
    {
        icon: Globe,
        title: 'Multi-Currency',
        desc: 'Switch between IDR and USD with live exchange rates fetched automatically. Global finance, made local.',
    },
    {
        icon: PieChart,
        title: 'Category Intelligence',
        desc: 'Create custom income and expense categories. Bulk operations and smart suggestions keep things tidy.',
    },
    {
        icon: TrendingUp,
        title: 'Trend Analysis',
        desc: 'Track spending patterns over time. Understand your habits with percentage breakdowns and historical comparisons.',
    },
];

const steps = [
    {
        step: '01',
        icon: CheckCircle2,
        title: 'Create your account',
        desc: 'Sign up in seconds with just your email and a password. No credit card required.',
    },
    {
        step: '02',
        icon: CreditCard,
        title: 'Log transactions',
        desc: 'Add income or expenses with a category, date, and description. Takes under 10 seconds.',
    },
    {
        step: '03',
        icon: TrendingUp,
        title: 'Gain insights',
        desc: 'Watch your dashboard fill with charts and summaries. Understand where every rupiah goes.',
    },
];

const testimonials = [
    {
        name: 'Aditya R.',
        role: 'Freelance Designer',
        avatar: 'AR',
        quote: 'FinTrack changed how I manage my irregular income. The category breakdowns finally make my finances legible.',
        stars: 5,
    },
    {
        name: 'Siti N.',
        role: 'Software Engineer',
        avatar: 'SN',
        quote: 'The IDR/USD toggle is brilliant. I get paid in USD, spend in IDR — FinTrack handles the mental math for me.',
        stars: 5,
    },
    {
        name: 'Budi H.',
        role: 'Small Business Owner',
        avatar: 'BH',
        quote: 'Clean, fast, and secure. I tried three other tools before this. FinTrack is the only one I actually stick with.',
        stars: 5,
    },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#0C1208] text-[#F0EDE5] font-sans overflow-x-hidden">

            {/* ── Navbar ─────────────────────────────────────────────────────────── */}
            <LandingNav />

            {/* ── Hero ───────────────────────────────────────────────────────────── */}
            <section
                id="hero"
                className="relative px-6 pt-28 pb-20 sm:pt-36 sm:pb-28 [scroll-margin-top:4rem] overflow-hidden"
            >
                {/* Subtle radial glow */}
                <div className="pointer-events-none absolute -top-20 right-0 h-[600px] w-[600px] -translate-y-0 translate-x-1/4 rounded-full bg-[radial-gradient(circle,rgba(168,212,76,0.07)_0%,transparent_70%)]" />
                <div className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] -translate-x-1/4 rounded-full bg-[radial-gradient(circle,rgba(168,212,76,0.04)_0%,transparent_70%)]" />

                <div className="mx-auto max-w-6xl">
                    {/* Two-column layout on large screens, stacked on mobile */}
                    <div className="flex flex-col items-center gap-16 lg:flex-row lg:items-center lg:gap-12">

                        {/* Left — copy */}
                        <AnimatedSection className="flex-1 text-center lg:text-left">
                            {/* Eyebrow badge */}
                            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#A8D44C]/20 bg-[#A8D44C]/8 px-4 py-2 text-xs font-medium uppercase tracking-widest text-[#A8D44C]">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#A8D44C]" />
                                Personal Finance Manager
                            </div>

                            <h1 className="font-serif text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl xl:text-7xl">
                                <TypewriterText text="Your money," delayOffset={0} />
                                <br />
                                <em className="font-serif font-light italic text-[#A8D44C]">
                                    <TypewriterText text="finally" delayOffset={0.6} />
                                </em>
                                <br />
                                <TypewriterText text="under control." delayOffset={1.0} />
                            </h1>

                            <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-[#8A9478] lg:mx-0 lg:text-lg">
                                Track income, manage expenses, and understand your financial patterns all in one focused, ultra-fast app.
                            </p>

                            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
                                <Link
                                    href="/register"
                                    className="group inline-flex items-center gap-2 rounded-full bg-[#A8D44C] px-7 py-3.5 text-sm font-medium text-[#0C1208] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#B8E55C] sm:text-base"
                                >
                                    Start for free
                                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                                </Link>
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-2 rounded-full border border-[#2D3A22] px-7 py-3.5 text-sm font-medium text-[#8A9478] transition-all duration-200 hover:border-[#6B7A5A] hover:text-[#F0EDE5] sm:text-base"
                                >
                                    Sign in
                                </Link>
                            </div>

                            {/* Trust note */}
                            <p className="mt-6 text-xs text-[#6B7A5A]">
                                No credit card · No setup fees · Cancel anytime
                            </p>
                        </AnimatedSection>

                        {/* Right — Interactive Mockup */}
                        <AnimatedSection delay={0.2} className="w-full max-w-lg flex-shrink-0 lg:w-[480px]">
                            <div className="relative">
                                {/* Decorative ring behind mockup */}
                                <div className="pointer-events-none absolute inset-0 -m-4 rounded-2xl border border-[#A8D44C]/10" />
                                <InteractiveMockup />
                            </div>
                        </AnimatedSection>

                    </div>
                </div>
            </section>

            {/* ── Stats Bar ──────────────────────────────────────────────────────── */}
            <section className="border-y border-[#2D3A22] py-12 px-6">
                <AnimatedSection className="mx-auto max-w-5xl">
                    <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-4 sm:gap-y-0">
                        {stats.map(({ value, label }, i) => (
                            <div
                                key={label}
                                className={`text-center ${
                                    i !== 0 ? 'sm:border-l sm:border-[#2D3A22]' : ''
                                } ${
                                    i === 2 ? 'border-l border-[#2D3A22]' : ''
                                }`}
                            >
                                <p className="font-serif text-3xl font-semibold tracking-tight text-[#F0EDE5] sm:text-4xl">
                                    <AnimatedStats value={value} />
                                </p>
                                <p className="mt-1.5 text-xs font-medium uppercase tracking-wider text-[#6B7A5A]">
                                    {label}
                                </p>
                            </div>
                        ))}
                    </div>
                </AnimatedSection>
            </section>

            {/* ── Features ───────────────────────────────────────────────────────── */}
            <section id="features" className="py-24 px-6 [scroll-margin-top:4rem]">
                <div className="mx-auto max-w-6xl">
                    {/* Header */}
                    <AnimatedSection className="mb-14">
                        <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[#A8D44C]">
                            Features
                        </p>
                        <h2 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-[#F0EDE5] sm:text-5xl">
                            Everything you need,
                            <br />
                            <em className="font-light italic text-[#8A9478]">nothing you don't.</em>
                        </h2>
                    </AnimatedSection>

                    {/* Grid — bordered cell layout */}
                    <AnimatedGrid className="grid grid-cols-1 overflow-hidden rounded-2xl border border-[#2D3A22] sm:grid-cols-2 lg:grid-cols-3">
                        {features.map(({ icon: Icon, title, desc }, i) => (
                            <AnimatedGridItem
                                key={title}
                                className={`group bg-[#141A0E] p-7 transition-colors duration-200 hover:bg-[#1C2416] ${
                                    // Right border for first two cols on lg
                                    i % 3 !== 2 ? 'lg:border-r lg:border-[#2D3A22]' : ''
                                } ${
                                    // Right border for first col on sm
                                    i % 2 !== 1 ? 'sm:border-r sm:border-[#2D3A22] lg:border-r-0' : ''
                                } ${
                                    i % 3 !== 2 && i % 2 !== 1
                                        ? 'sm:border-r sm:border-[#2D3A22]'
                                        : ''
                                } ${
                                    // Bottom border except last row
                                    i < 3 ? 'border-b border-[#2D3A22]' : ''
                                } ${
                                    // On sm, bottom border for rows that aren't the last row
                                    i < 4 ? 'sm:border-b sm:border-[#2D3A22]' : ''
                                }`}
                            >
                                <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-lg border border-[#2D3A22] bg-[#1C2416] transition-colors duration-200 group-hover:border-[#A8D44C]/30 group-hover:bg-[#A8D44C]/5">
                                    <Icon className="h-4 w-4 stroke-[#A8D44C]" strokeWidth={1.5} />
                                </div>
                                <h3 className="mb-2.5 text-sm font-medium text-[#F0EDE5]">{title}</h3>
                                <p className="text-xs leading-relaxed text-[#6B7A5A]">{desc}</p>
                            </AnimatedGridItem>
                        ))}
                    </AnimatedGrid>
                </div>
            </section>

            {/* ── How it Works ───────────────────────────────────────────────────── */}
            <section
                id="how-it-works"
                className="border-y border-[#2D3A22] bg-[#141A0E] py-24 px-6 [scroll-margin-top:4rem]"
            >
                <div className="mx-auto max-w-5xl">
                    {/* Header */}
                    <AnimatedSection className="mb-16">
                        <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[#A8D44C]">
                            Simple Setup
                        </p>
                        <h2 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-[#F0EDE5] sm:text-5xl">
                            Up and running
                            <br />
                            <em className="font-light italic text-[#8A9478]">in minutes.</em>
                        </h2>
                    </AnimatedSection>

                    {/* Steps */}
                    <AnimatedGrid className="relative grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
                        {/* Connector line — desktop only */}
                        <div className="pointer-events-none absolute top-6 left-[calc(16.5%+24px)] right-[calc(16.5%+24px)] hidden h-px bg-gradient-to-r from-[#2D3A22] via-[#7DB82A] to-[#2D3A22] md:block" />

                        {steps.map(({ step, title, desc }) => (
                            <AnimatedGridItem key={step} className="flex flex-col items-center text-center md:items-center">
                                <div className="relative mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-[#2D3A22] bg-[#1C2416]">
                                    <span className="font-serif text-lg font-semibold text-[#A8D44C]">
                                        {step}
                                    </span>
                                </div>
                                <h3 className="mb-2.5 text-sm font-medium text-[#F0EDE5]">{title}</h3>
                                <p className="max-w-[220px] text-xs leading-relaxed text-[#6B7A5A]">{desc}</p>
                            </AnimatedGridItem>
                        ))}
                    </AnimatedGrid>
                </div>
            </section>

            {/* ── Testimonials ───────────────────────────────────────────────────── */}
            <section id="testimonials" className="py-24 px-6 [scroll-margin-top:4rem]">
                <div className="mx-auto max-w-6xl">
                    {/* Header */}
                    <AnimatedSection className="mb-14">
                        <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[#A8D44C]">
                            Testimonials
                        </p>
                        <h2 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-[#F0EDE5] sm:text-5xl">
                            Loved by{' '}
                            <em className="font-light italic text-[#8A9478]">real people.</em>
                        </h2>
                    </AnimatedSection>

                    <AnimatedGrid className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {testimonials.map(({ name, role, avatar, quote, stars }) => (
                            <AnimatedGridItem
                                key={name}
                                className="rounded-2xl border border-[#2D3A22] bg-[#141A0E] p-6 transition-all duration-200 hover:border-[#6B7A5A]"
                            >
                                {/* Stars */}
                                <div className="mb-4 flex gap-1">
                                    {[...Array(stars)].map((_, i) => (
                                        <Star key={i} className="h-3 w-3 fill-[#D4A853] text-[#D4A853]" />
                                    ))}
                                </div>

                                <p className="mb-6 text-sm leading-relaxed text-[#8A9478]">
                                    &ldquo;{quote}&rdquo;
                                </p>

                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-[#A8D44C]/20 bg-[#A8D44C]/10 text-xs font-medium text-[#A8D44C]">
                                        {avatar}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-[#F0EDE5]">{name}</p>
                                        <p className="text-xs text-[#6B7A5A]">{role}</p>
                                    </div>
                                </div>
                            </AnimatedGridItem>
                        ))}
                    </AnimatedGrid>
                </div>
            </section>

            {/* ── CTA ────────────────────────────────────────────────────────────── */}
            <section id="get-started" className="py-24 px-6 [scroll-margin-top:4rem]">
                <div className="mx-auto max-w-4xl">
                    <AnimatedSection className="relative overflow-hidden rounded-3xl border border-[#2D3A22] bg-[#141A0E] px-8 py-16 text-center sm:px-16 sm:py-20">
                        {/* Background glow */}
                        <div className="pointer-events-none absolute -top-20 left-1/2 h-72 w-96 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(168,212,76,0.08)_0%,transparent_70%)]" />

                        <h2 className="relative font-serif text-4xl font-semibold leading-tight tracking-tight text-[#F0EDE5] sm:text-5xl xl:text-6xl">
                            Start tracking
                            <br />
                            <em className="font-light italic text-[#A8D44C]">your money today.</em>
                        </h2>

                        <p className="relative mx-auto mt-5 max-w-7xl text-base leading-relaxed text-[#8A9478]">
                            Join thousands of people who finally understand where their money goes every month.
                        </p>

                        <Link
                            href="/register"
                            className="group relative mt-10 inline-flex items-center gap-2.5 rounded-full bg-[#A8D44C] px-10 py-4 text-sm font-medium text-[#0C1208] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#B8E55C] sm:text-base"
                        >
                            Create your free account
                            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>

                        <p className="relative mt-5 text-xs tracking-wide text-[#6B7A5A]">
                            No credit card · No setup fees · Cancel anytime
                        </p>
                    </AnimatedSection>
                </div>
            </section>

            {/* ── Footer ─────────────────────────────────────────────────────────── */}
            <footer className="relative border-t border-[#2D3A22] px-6 pt-16 pb-10 overflow-hidden">

                {/* Subtle glow top-left */}
                <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-[#A8D44C]/30 to-transparent" />
                <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[200px] rounded-full bg-[radial-gradient(ellipse,rgba(168,212,76,0.05)_0%,transparent_70%)]" />

                <div className="mx-auto max-w-6xl">
                    {/* Top row — brand + columns */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">

                        {/* Brand column */}
                        <div className="col-span-2 lg:col-span-2">
                            <div className="flex items-center gap-2.5 mb-4">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#A8D44C]">
                                    <PieChart className="h-4 w-4 text-[#0C1208]" strokeWidth={2} />
                                </div>
                                <span className="font-serif text-xl font-semibold text-[#F0EDE5] tracking-tight">FinTrack</span>
                            </div>
                            <p className="max-w-xs text-sm leading-relaxed text-[#6B7A5A] text-justify">
                                The personal finance manager built for clarity. Track income, manage expenses, understand your money all in one place.
                            </p>
                            <p className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-[#A8D44C]/20 bg-[#A8D44C]/8 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-[#A8D44C]">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#A8D44C]" />
                                Free forever · No credit card
                            </p>
                        </div>

                        {/* Product links */}
                        <div>
                            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.15em] text-[#6B7A5A]">Product</p>
                            <ul className="space-y-2.5">
                                {[
                                    { label: 'Features', href: '#features' },
                                    { label: 'How It Works', href: '#how-it-works' },
                                    { label: 'Testimonials', href: '#testimonials' },
                                    { label: 'Get Started', href: '/register' },
                                ].map(({ label, href }) => (
                                    <li key={label}>
                                        <Link
                                            href={href}
                                            className="text-sm text-[#6B7A5A] hover:text-[#F0EDE5] transition-colors duration-200"
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Company links — each opens a popup */}
                        <div>
                            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.15em] text-[#6B7A5A]">Company</p>
                            <FooterPopups />
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="my-12 h-px bg-gradient-to-r from-transparent via-[#2D3A22] to-transparent" />

                    {/* Bottom row */}
                    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <p className="text-xs text-[#6B7A5A]">
                            © {new Date().getFullYear()} FinTrack. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6 text-xs text-[#6B7A5A]">
                            <span className="flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70 animate-pulse" />
                                All systems operational
                            </span>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
}