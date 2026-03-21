import Sidebar from "../components/Sidebar";
import SessionTimeout from "../components/SessionTimeout";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect('/login');

    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' }
    });

    return (
        <div className="flex h-screen overflow-hidden bg-[#0C1208]">
            <Sidebar categories={categories} />

            {/*
             * pt-14  → push content below the mobile top bar (h-14)
             * pb-16  → push content above the mobile bottom nav (py-3 × 2 + icon ≈ ~60px)
             * md:pt-0 md:pb-0 → reset on desktop (no top/bottom bars there)
             */}
            <main className="flex-1 overflow-y-auto relative w-full pt-14 pb-16 md:pt-0 md:pb-0">
                {children}
            </main>

            {/* Session timeout — auto-logout after 2min idle */}
            <SessionTimeout />
        </div>
    );
}
