'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function addTransaction(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        throw new Error("Unauthorized");
    }
    const userId = (session.user as any).id;

    const amount = parseFloat(formData.get('amount') as string);
    const description = formData.get('description') as string;
    const date = new Date(formData.get('date') as string);
    const type = formData.get('type') as string;
    const categoryId = formData.get('categoryId') as string || null;

    try {
        await prisma.transaction.create({
            data: {
                amount,
                description,
                date,
                type,
                userId,
                categoryId,
            },
        });

        // Revalidate the dashboard page to show new data immediately
        revalidatePath('/');
        revalidatePath('/transactions');
        return { success: true };
    } catch (error) {
        console.error('Failed to add transaction:', error);
        return { error: 'Failed to add transaction' };
    }
}

export async function deleteTransaction(id: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) throw new Error("Unauthorized");
        const userId = (session.user as any).id;

        await prisma.transaction.delete({
            where: { id, userId }
        });

        revalidatePath('/');
        revalidatePath('/transactions');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete transaction:', error);
        return { error: 'Failed' };
    }
}
