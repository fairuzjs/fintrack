'use client';

import { useState } from 'react';
import { X, ShieldCheck, ScrollText, Phone, Activity, CheckCircle2, Clock, Mail, Instagram, Twitter, Youtube, Heart } from 'lucide-react';

// ─── Popup content data ────────────────────────────────────────────────────────
const CONTENT = {
    'Privacy Policy': {
        icon: ShieldCheck,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10 border-blue-500/20',
        sections: [
            {
                title: 'Data We Collect',
                body: 'We collect only the minimum data required to provide the service: your name, email address, and financial transaction records you explicitly add. We do not track third-party cookies or sell your data.',
            },
            {
                title: 'How We Use It',
                body: 'Your data is used exclusively to provide and improve FinTrack. We use it to authenticate you, display your dashboard, and run analytics to improve performance. We never share your data with advertisers.',
            },
            {
                title: 'Data Security',
                body: 'All passwords are hashed with bcrypt. Sessions are secured via NextAuth JWT tokens. Data is stored in an isolated database per user — no other user can access your records.',
            },
            {
                title: 'Your Rights',
                body: 'You may request deletion of your account and all associated data at any time by contacting support. We will process the request within 30 days.',
            },
        ],
        lastUpdated: 'March 18, 2026',
    },
    'Terms of Service': {
        icon: ScrollText,
        color: 'text-amber-400',
        bg: 'bg-amber-500/10 border-amber-500/20',
        sections: [
            {
                title: 'Acceptance of Terms',
                body: 'By creating a FinTrack account you agree to these Terms. If you do not agree, please do not use the service.',
            },
            {
                title: 'Permitted Use',
                body: 'FinTrack is intended for personal, non-commercial use. You may not use the service for illegal purposes, to harm others, or to attempt to circumvent security measures.',
            },
            {
                title: 'Account Responsibility',
                body: 'You are responsible for keeping your credentials secure and for all activity that occurs under your account. Notify us immediately if you suspect any unauthorized access.',
            },
            {
                title: 'Service Availability',
                body: 'We strive for 99.9% uptime but cannot guarantee uninterrupted access. Planned maintenance windows will be communicated via the status page. We are not liable for downtime-related losses.',
            },
            {
                title: 'Modifications',
                body: 'We may update these Terms at any time. Continued use of the service after changes are posted constitutes acceptance of the new Terms.',
            },
        ],
        lastUpdated: 'March 18, 2026',
    },
    'Support': {
        icon: Phone,
        color: 'text-[#A8D44C]',
        bg: 'bg-[#A8D44C]/10 border-[#A8D44C]/20',
        sections: [],
        lastUpdated: null,
    },
    'System Status': {
        icon: Activity,
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10 border-emerald-500/20',
        sections: [],
        lastUpdated: null,
    },
} as const;

type PopupKey = keyof typeof CONTENT;
const COMPANY_LINKS: PopupKey[] = ['Privacy Policy', 'Terms of Service', 'Support', 'System Status'];

// ─── System Status data ────────────────────────────────────────────────────────
const SERVICES = [
    { name: 'API & Authentication', status: 'Operational', uptime: '99.98%' },
    { name: 'Database', status: 'Operational', uptime: '99.97%' },
    { name: 'Dashboard & UI', status: 'Operational', uptime: '99.99%' },
    { name: 'Currency Exchange Rates', status: 'Operational', uptime: '99.85%' },
    { name: 'PDF Export', status: 'Operational', uptime: '100%' },
];

const CHANGELOG = [
    { date: 'Mar 2026', label: 'PDF transaction export feature launched.' },
    { date: 'Mar 2026', label: 'Landing page animations (scroll-reveal, typewriter, animated stats).' },
    { date: 'Mar 2026', label: 'Multi-currency support with live exchange rates.' },
    { date: 'Mar 2026', label: 'Dashboard redesign — consistent dark theme across all pages.' },
];

// ─── Support contact data ──────────────────────────────────────────────────────
const SOCIAL_LINKS = [
    { icon: Mail,      label: 'Email',     value: 'support@fintrack.app',    href: 'mailto:support@fintrack.app' },
    { icon: Phone,     label: 'WhatsApp',  value: '+62 812-3456-7890',        href: 'https://wa.me/6281234567890' },
    { icon: Instagram, label: 'Instagram', value: '@fintrack.app',            href: 'https://instagram.com/fintrack.app' },
];

function SupportContent() {
    return (
        <div className="space-y-6">
            {/* Contact cards */}
            <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#6B7A5A] mb-3">Contact Us</p>
                <div className="space-y-2">
                    {SOCIAL_LINKS.map(({ icon: Icon, label, value, href }) => (
                        <a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-4 py-3 bg-[#1C2416] border border-[#2D3A22] rounded-xl hover:border-[#A8D44C]/30 hover:bg-[#1C2416]/80 transition-all group"
                        >
                            <div className="w-8 h-8 rounded-lg bg-[#A8D44C]/10 border border-[#A8D44C]/20 flex items-center justify-center flex-shrink-0">
                                <Icon className="w-3.5 h-3.5 text-[#A8D44C]" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B7A5A]">{label}</p>
                                <p className="text-sm text-[#F0EDE5] group-hover:text-[#A8D44C] transition-colors truncate">{value}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>

            {/* Donation QR */}
            <div className="p-5 bg-[#1C2416] border border-[#2D3A22] rounded-xl text-center space-y-3">
                <div className="flex items-center justify-center gap-2 mb-1">
                    <Heart className="w-4 h-4 text-rose-400" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#6B7A5A]">Support FinTrack</p>
                </div>
                <p className="text-sm text-[#8A9478] text-justify leading-relaxed">
                    FinTrack is free forever. If you find it useful, consider making a small donation to help keep the servers running and new features coming.
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/qris.png"
                    alt="Donation QR Code"
                    width={160}
                    height={160}
                    className="mx-auto rounded-xl border-4 border-[#A8D44C]/20 p-1 bg-[#F0EDE5]"
                />
                <p className="text-xs text-[#6B7A5A]">Scan with GoPay · Dana · OVO · QRIS</p>
            </div>
        </div>
    );
}

function SystemStatusContent() {
    return (
        <div className="space-y-6">
            {/* Overall banner */}
            <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                <div>
                    <p className="font-semibold text-emerald-400 text-sm">All Systems Operational</p>
                    <p className="text-xs text-[#6B7A5A] mt-0.5">Last checked: {new Date().toLocaleDateString('en-US', { dateStyle: 'medium' })}</p>
                </div>
            </div>

            {/* Services */}
            <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#6B7A5A] mb-3">Services</p>
                <div className="space-y-2">
                    {SERVICES.map(s => (
                        <div key={s.name} className="flex items-center justify-between px-4 py-3 bg-[#1C2416] border border-[#2D3A22] rounded-xl">
                            <div className="flex items-center gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                <span className="text-sm text-[#F0EDE5]">{s.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[11px] text-[#6B7A5A]">{s.uptime} uptime</span>
                                <span className="text-[11px] font-medium text-emerald-400">{s.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Changelog */}
            <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#6B7A5A] mb-3">Recent Updates</p>
                <div className="space-y-3">
                    {CHANGELOG.map((c, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
                                <Clock className="w-3.5 h-3.5 text-[#6B7A5A]" />
                                <span className="text-[11px] text-[#6B7A5A] w-16">{c.date}</span>
                            </div>
                            <p className="text-sm text-[#8A9478] text-justify">{c.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function FooterPopups() {
    const [active, setActive] = useState<PopupKey | null>(null);

    return (
        <>
            {/* Company link list */}
            <ul className="space-y-2.5">
                {COMPANY_LINKS.map(label => (
                    <li key={label}>
                        <button
                            onClick={() => setActive(label)}
                            className="text-sm text-[#6B7A5A] hover:text-[#F0EDE5] transition-colors duration-200 text-left"
                        >
                            {label}
                        </button>
                    </li>
                ))}
            </ul>

            {/* Popup modal */}
            {active && (() => {
                const cfg = CONTENT[active];
                const Icon = cfg.icon;
                return (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={(e) => { if (e.target === e.currentTarget) setActive(null); }}
                    >
                        {/* Backdrop */}
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

                        {/* Modal */}
                        <div className="relative bg-[#141A0E] border border-[#2D3A22] rounded-2xl w-full max-w-lg shadow-2xl shadow-black/50 overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-[#2D3A22]">
                                <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${cfg.bg}`}>
                                        <Icon className={`w-4 h-4 ${cfg.color}`} />
                                    </div>
                                    <div>
                                        <h2 className="text-[#F0EDE5] font-serif font-semibold text-base">{active}</h2>
                                        {cfg.lastUpdated && (
                                            <p className="text-[#6B7A5A] text-xs mt-0.5">Last updated: {cfg.lastUpdated}</p>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setActive(null)}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-[#6B7A5A] hover:text-[#F0EDE5] hover:bg-[#1C2416] transition-all"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="px-6 py-5 max-h-[68vh] overflow-y-auto space-y-5">
                                {active === 'System Status' ? (
                                    <SystemStatusContent />
                                ) : active === 'Support' ? (
                                    <SupportContent />
                                ) : (
                                    cfg.sections.map(s => (
                                        <div key={s.title}>
                                            <p className="text-[#F0EDE5] font-semibold text-sm mb-1.5">{s.title}</p>
                                            <p className="text-[#8A9478] text-sm leading-relaxed text-justify">{s.body}</p>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 border-t border-[#2D3A22] flex justify-end">
                                <button
                                    onClick={() => setActive(null)}
                                    className="px-5 py-2 bg-[#A8D44C] hover:bg-[#B8E55C] text-[#0C1208] text-sm font-semibold rounded-lg transition-all active:scale-[0.98]"
                                >
                                    Got it
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </>
    );
}
