'use client';

import { useState } from 'react';

interface MonthData {
    month: string;
    income: number;
    expense: number;
}

function fmtShort(n: number) {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
    return String(n);
}

function fmtRp(n: number) {
    if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)}K`;
    return `Rp ${n.toLocaleString('id-ID')}`;
}

export default function MonthlyBarChart({ data }: { data: MonthData[] }) {
    const [hovered, setHovered] = useState<{ idx: number; type: 'income' | 'expense' } | null>(null);

    if (!data.length) {
        return (
            <div className="flex flex-col items-center justify-center h-40 text-white/25 text-sm">
                No monthly data yet
            </div>
        );
    }

    const maxVal = Math.max(...data.flatMap(d => [d.income, d.expense]), 1);
    const chartH = 120;
    const barW = 18;
    const gap = 6;
    const groupW = barW * 2 + gap + 16;
    const svgW = data.length * groupW + 24;
    const svgH = chartH + 36;

    const hoveredItem = hovered !== null ? data[hovered.idx] : null;

    return (
        <div className="overflow-x-auto w-full">
            {/* Legend + tooltip */}
            <div className="flex items-center gap-4 mb-3">
                <div className="flex gap-4">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 opacity-80" />
                        <span className="text-white/40 text-[10px] font-medium">Income</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 opacity-80" />
                        <span className="text-white/40 text-[10px] font-medium">Expenses</span>
                    </div>
                </div>
                {/* Inline tooltip */}
                {hovered && hoveredItem && (
                    <div className="ml-auto bg-[#1a2234] border border-white/10 text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg shadow-lg whitespace-nowrap">
                        {data[hovered.idx].month} {hovered.type === 'income' ? '↑ Income' : '↓ Expense'}:&nbsp;
                        <span className={hovered.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}>
                            {fmtRp(hovered.type === 'income' ? hoveredItem.income : hoveredItem.expense)}
                        </span>
                    </div>
                )}
            </div>

            <svg
                width="100%"
                viewBox={`0 0 ${svgW} ${svgH}`}
                preserveAspectRatio="xMidYMid meet"
                className="overflow-visible"
                role="img"
                aria-label="Monthly income vs expenses bar chart"
            >
                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((p) => {
                    const y = chartH - p * chartH;
                    return (
                        <g key={p}>
                            <line
                                x1="0" y1={y} x2={svgW} y2={y}
                                stroke="white" strokeOpacity="0.05" strokeWidth="1"
                            />
                            {p > 0 && (
                                <text x="0" y={y - 3} fontSize="7" fill="white" fillOpacity="0.25" textAnchor="start">
                                    {fmtShort(maxVal * p)}
                                </text>
                            )}
                        </g>
                    );
                })}

                {/* Bars */}
                {data.map((d, i) => {
                    const x = i * groupW + 24;
                    const incomeH = (d.income / maxVal) * chartH;
                    const expenseH = (d.expense / maxVal) * chartH;
                    const isHovIncome = hovered?.idx === i && hovered?.type === 'income';
                    const isHovExpense = hovered?.idx === i && hovered?.type === 'expense';

                    return (
                        <g key={d.month}>
                            {/* Income bar */}
                            <rect
                                x={x}
                                y={chartH - incomeH}
                                width={barW}
                                height={Math.max(incomeH, incomeH > 0 ? 2 : 0)}
                                rx="3"
                                fill="#10b981"
                                opacity={hovered && !isHovIncome ? 0.35 : 0.85}
                                className="cursor-pointer transition-opacity duration-150"
                                onMouseEnter={() => setHovered({ idx: i, type: 'income' })}
                                onMouseLeave={() => setHovered(null)}
                            />

                            {/* Expense bar */}
                            <rect
                                x={x + barW + gap}
                                y={chartH - expenseH}
                                width={barW}
                                height={Math.max(expenseH, expenseH > 0 ? 2 : 0)}
                                rx="3"
                                fill="#f43f5e"
                                opacity={hovered && !isHovExpense ? 0.35 : 0.85}
                                className="cursor-pointer transition-opacity duration-150"
                                onMouseEnter={() => setHovered({ idx: i, type: 'expense' })}
                                onMouseLeave={() => setHovered(null)}
                            />

                            {/* Month label */}
                            <text
                                x={x + barW + gap / 2}
                                y={chartH + 14}
                                fontSize="8"
                                textAnchor="middle"
                                fill="white"
                                fillOpacity={hovered?.idx === i ? 0.8 : 0.3}
                                fontWeight="600"
                            >
                                {d.month}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}
