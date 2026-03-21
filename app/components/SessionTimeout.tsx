'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { signOut } from 'next-auth/react';
import { AlertTriangle, Clock, ShieldOff } from 'lucide-react';

// ─── Config ───────────────────────────────────────────────────────────────────
const TIMEOUT_MS = 2 * 60 * 1000;  // 2 minutes total
const WARNING_MS = 30 * 1000;       // show warning 30s before logout
const IDLE_LIMIT = TIMEOUT_MS - WARNING_MS; // = 90s before warning appears

// Events that count as "activity"
const ACTIVITY_EVENTS = [
    'mousemove', 'mousedown', 'keydown',
    'scroll', 'touchstart', 'click', 'wheel',
] as const;

export default function SessionTimeout() {
    const [showWarning, setShowWarning] = useState(false);
    const [countdown, setCountdown] = useState(WARNING_MS / 1000); // seconds

    const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // ── Clear all timers ──────────────────────────────────────────────────────
    const clearTimers = useCallback(() => {
        if (idleTimer.current) clearTimeout(idleTimer.current);
        if (countdownRef.current) clearInterval(countdownRef.current);
    }, []);

    // ── Start warning countdown (runs last 30s) ────────────────────────────
    const startCountdown = useCallback(() => {
        setCountdown(WARNING_MS / 1000);
        countdownRef.current = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(countdownRef.current!);
                    signOut({ callbackUrl: '/login' });
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, []);

    // ── Reset idle timer ──────────────────────────────────────────────────────
    const resetTimer = useCallback(() => {
        // If warning is shown, ignore mouse noise — only manual "Stay" resets
        if (showWarning) return;

        clearTimers();
        idleTimer.current = setTimeout(() => {
            setShowWarning(true);
            startCountdown();
        }, IDLE_LIMIT);
    }, [showWarning, clearTimers, startCountdown]);

    // ── "Stay logged in" action ────────────────────────────────────────────
    const handleStay = useCallback(() => {
        clearTimers();
        setShowWarning(false);
        setCountdown(WARNING_MS / 1000);

        // Restart idle timer
        idleTimer.current = setTimeout(() => {
            setShowWarning(true);
            startCountdown();
        }, IDLE_LIMIT);
    }, [clearTimers, startCountdown]);

    // ── Attach / detach activity listeners ───────────────────────────────────
    useEffect(() => {
        const handler = () => resetTimer();

        ACTIVITY_EVENTS.forEach(e =>
            window.addEventListener(e, handler, { passive: true })
        );
        // Start the first idle timer
        idleTimer.current = setTimeout(() => {
            setShowWarning(true);
            startCountdown();
        }, IDLE_LIMIT);

        return () => {
            clearTimers();
            ACTIVITY_EVENTS.forEach(e =>
                window.removeEventListener(e, handler)
            );
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!showWarning) return null;

    // ── Progress arc (SVG circle) ────────────────────────────────────────────
    const total = WARNING_MS / 1000;
    const progress = countdown / total;
    const R = 22;
    const circ = 2 * Math.PI * R;
    const dash = circ * progress;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm" />

            {/* Modal */}
            <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
                <div className="relative w-full max-w-sm bg-[#0d1117] border border-white/[0.10] rounded-3xl shadow-2xl shadow-black/50 overflow-hidden">

                    {/* Top accent line */}
                    <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />

                    <div className="p-8 flex flex-col items-center text-center gap-5">

                        {/* Icon + countdown ring */}
                        <div className="relative w-20 h-20">
                            {/* Background ring */}
                            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 56 56" width="80" height="80">
                                <circle cx="28" cy="28" r={R} fill="none" stroke="white" strokeOpacity="0.06" strokeWidth="4" />
                                <circle
                                    cx="28" cy="28" r={R}
                                    fill="none"
                                    stroke={countdown <= 10 ? '#f43f5e' : '#f59e0b'}
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    strokeDasharray={`${dash} ${circ}`}
                                    className="transition-all duration-1000"
                                />
                            </svg>
                            {/* Center icon */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className={`p-3 rounded-full ${countdown <= 10 ? 'bg-rose-500/15' : 'bg-amber-500/15'}`}>
                                    <Clock className={`w-6 h-6 ${countdown <= 10 ? 'text-rose-400' : 'text-amber-400'}`} />
                                </div>
                            </div>
                        </div>

                        {/* Text */}
                        <div>
                            <h2 className="text-white font-extrabold text-xl mb-2">
                                Still there?
                            </h2>
                            <p className="text-white/45 text-sm leading-relaxed">
                                You've been inactive for a while. For your security, you'll be automatically logged out in
                            </p>
                            <p className={`text-4xl font-black mt-3 tabular-nums ${countdown <= 10 ? 'text-rose-400' : 'text-amber-400'}`}>
                                {countdown}s
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3 w-full mt-1">
                            <button
                                onClick={handleStay}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 rounded-2xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-[0.98]"
                            >
                                Yes, keep me logged in
                            </button>
                            <button
                                onClick={() => signOut({ callbackUrl: '/login' })}
                                className="w-full flex items-center justify-center gap-2 border border-white/[0.08] hover:bg-white/[0.05] text-white/40 hover:text-white/70 font-semibold py-3 rounded-2xl transition-all text-sm"
                            >
                                <ShieldOff className="w-4 h-4" />
                                Log out now
                            </button>
                        </div>

                        {/* Security note */}
                        <p className="text-white/20 text-[10px] flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Auto-logout protects your account on shared devices
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
