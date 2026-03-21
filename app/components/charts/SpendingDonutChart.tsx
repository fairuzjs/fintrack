'use client';

import { useState } from 'react';

interface Slice {
    name: string;
    value: number;
    percentage: number;
}

const COLORS = [
    '#3b82f6', // blue
    '#10b981', // emerald
    '#f59e0b', // amber
    '#f43f5e', // rose
    '#a855f7', // purple
    '#06b6d4', // cyan
];

function fmtRp(n: number) {
    if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)}K`;
    return `Rp ${n.toLocaleString('id-ID')}`;
}

export default function SpendingDonutChart({ data }: { data: Slice[] }) {
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

    if (!data.length) {
        return (
            <div className="flex flex-col items-center justify-center h-48 text-white/25 text-sm">
                <svg className="w-12 h-12 mb-3 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                </svg>
                No expense data yet
            </div>
        );
    }

    const R = 60;
    const r = 38;
    const cx = 80;
    const cy = 80;
    const gap = 2;

    function polarToXY(deg: number, radius: number) {
        const rad = (deg - 90) * (Math.PI / 180);
        return {
            x: cx + radius * Math.cos(rad),
            y: cy + radius * Math.sin(rad),
        };
    }

    function arcPath(startDeg: number, endDeg: number) {
        const start = polarToXY(startDeg + gap / 2, R);
        const end = polarToXY(endDeg - gap / 2, R);
        const si = polarToXY(startDeg + gap / 2, r);
        const ei = polarToXY(endDeg - gap / 2, r);
        const large = endDeg - startDeg > 180 ? 1 : 0;
        return [
            `M ${start.x} ${start.y}`,
            `A ${R} ${R} 0 ${large} 1 ${end.x} ${end.y}`,
            `L ${ei.x} ${ei.y}`,
            `A ${r} ${r} 0 ${large} 0 ${si.x} ${si.y}`,
            'Z',
        ].join(' ');
    }

    let current = 0;
    const arcs = data.map((slice, i) => {
        const deg = (slice.percentage / 100) * 360;
        const path = arcPath(current, current + deg);
        current += deg;
        return { ...slice, path, color: COLORS[i % COLORS.length] };
    });

    const total = data.reduce((s, d) => s + d.value, 0);
    const hovered = hoveredIdx !== null ? arcs[hoveredIdx] : null;

    return (
        <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* SVG donut */}
            <div className="relative flex-shrink-0">
                {/* Hover tooltip */}
                {hovered && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1a2234] border border-white/10 text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg shadow-lg whitespace-nowrap z-10 pointer-events-none">
                        {hovered.name}: {hovered.percentage}% · {fmtRp(hovered.value)}
                    </div>
                )}
                <svg
                    width="160"
                    height="160"
                    viewBox="0 0 160 160"
                    role="img"
                    aria-label="Spending by category donut chart"
                >
                    {arcs.map((arc, i) => (
                        <path
                            key={i}
                            d={arc.path}
                            fill={arc.color}
                            opacity={hoveredIdx === i ? 1 : hoveredIdx !== null ? 0.5 : 0.85}
                            className="cursor-pointer transition-opacity duration-150"
                            onMouseEnter={() => setHoveredIdx(i)}
                            onMouseLeave={() => setHoveredIdx(null)}
                        />
                    ))}
                    {/* Center label */}
                    <text
                        x={cx} y={cy - 8}
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="600"
                        letterSpacing="1"
                        fill="rgba(255,255,255,0.35)"
                    >
                        TOTAL
                    </text>
                    <text
                        x={cx} y={cy + 10}
                        textAnchor="middle"
                        fontSize="12"
                        fontWeight="700"
                        fill="white"
                    >
                        {fmtRp(total)}
                    </text>
                </svg>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-2 flex-1 w-full min-w-0">
                {arcs.map((arc, i) => (
                    <div
                        key={i}
                        className={`flex items-center gap-2 cursor-default transition-opacity duration-150 ${hoveredIdx !== null && hoveredIdx !== i ? 'opacity-40' : 'opacity-100'
                            }`}
                        onMouseEnter={() => setHoveredIdx(i)}
                        onMouseLeave={() => setHoveredIdx(null)}
                    >
                        <span
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: arc.color }}
                        />
                        <span className="text-white/60 text-xs truncate flex-1">{arc.name}</span>
                        <span className="text-white/80 text-xs font-semibold">{arc.percentage}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
