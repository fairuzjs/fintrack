'use client';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download } from 'lucide-react';
import { useState } from 'react';

type Transaction = {
    date: string | Date;
    description: string;
    amount: number;
    type: string;
    category?: { name: string } | null;
};

export default function DownloadPdfButton({
    transactions,
    totalIncome,
    totalExpense,
    filterContext,
}: {
    transactions: Transaction[];
    totalIncome: number;
    totalExpense: number;
    filterContext?: string;
}) {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownload = () => {
        setIsGenerating(true);
        try {
            const doc = new jsPDF();
            
            // Branding / Title
            doc.setFontSize(22);
            doc.setTextColor(168, 212, 76); // matches #A8D44C accent
            doc.text("FinTrack", 14, 20);

            doc.setFontSize(16);
            doc.setTextColor(12, 18, 8); // #0C1208
            doc.text("Transaction History Report", 14, 30);
            
            // Meta Info
            doc.setFontSize(10);
            doc.setTextColor(107, 122, 90); // #6B7A5A
            doc.text(`Generated on: ${new Date().toLocaleDateString('en-US', { dateStyle: 'medium' })}`, 14, 40);
            if (filterContext) {
                doc.text(`Filter: ${filterContext}`, 14, 46);
            }

            // Summary Box (approximate line drawing)
            doc.setDrawColor(200, 200, 200);
            doc.rect(14, 52, 182, 24);

            doc.setFontSize(11);
            doc.setTextColor(12, 18, 8); 
            doc.text("Summary", 18, 60);

            doc.setFontSize(10);
            doc.setTextColor(16, 185, 129); // emerald-500
            doc.text(`Total Income: + Rp ${totalIncome.toLocaleString('id-ID')}`, 18, 68);

            doc.setTextColor(244, 63, 94); // rose-500
            doc.text(`Total Expense: - Rp ${totalExpense.toLocaleString('id-ID')}`, 90, 68);

            // Table Data Format
            const tableBody = transactions.map(t => [
                new Date(t.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
                t.description,
                t.category?.name || 'Uncategorized',
                t.type,
                (t.type === 'INCOME' ? '+' : '-') + ' Rp ' + t.amount.toLocaleString('id-ID', { minimumFractionDigits: 0 })
            ]);

            autoTable(doc, {
                startY: 85,
                head: [['Date', 'Description', 'Category', 'Type', 'Amount']],
                body: tableBody,
                headStyles: { 
                    fillColor: [168, 212, 76], // #A8D44C
                    textColor: [12, 18, 8],     // #0C1208
                    fontStyle: 'bold'
                },
                alternateRowStyles: { fillColor: [248, 250, 245] }, 
                styles: { fontSize: 9, cellPadding: 4 },
                columnStyles: {
                    4: { halign: 'right', fontStyle: 'bold' }
                },
                didParseCell: function (data: any) {
                    // Color positive green, negative red in Amount column
                    if (data.section === 'body' && data.column.index === 4) {
                        const type = data.row.raw[3];
                        if (type === 'INCOME') {
                            data.cell.styles.textColor = [16, 185, 129];
                        } else {
                            data.cell.styles.textColor = [225, 29, 72];
                        }
                    }
                }
            });

            doc.save("fintrack-transaction-history.pdf");
        } catch (error) {
            console.error("Failed to generate PDF", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <button 
            onClick={handleDownload}
            disabled={isGenerating || transactions.length === 0}
            className={`flex items-center gap-2 px-4 py-2 bg-[#1C2416] border border-[#2D3A22] rounded-xl text-sm font-semibold transition-all shadow-sm ${
                transactions.length === 0 
                    ? 'opacity-50 cursor-not-allowed text-[#6B7A5A]' 
                    : 'text-[#F0EDE5] hover:border-[#A8D44C]/50 hover:text-[#A8D44C] active:scale-[0.98]'
            }`}
        >
            <Download className={`w-4 h-4 ${isGenerating ? 'animate-bounce' : ''}`} />
            {isGenerating ? 'Generating...' : 'Export PDF'}
        </button>
    );
}
