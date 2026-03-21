'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function addCategory(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        throw new Error("Unauthorized");
    }
    const userId = (session.user as any).id;

    const name = formData.get('name') as string;
    const type = formData.get('type') as string;

    if (!name || name.trim() === '') {
        return { error: 'Category name is required' };
    }

    try {
        await prisma.category.create({
            data: {
                name: name.trim(),
                type,
                userId,
            },
        });

        // Revalidate the global layout to update the modal dropdown and the categories page
        revalidatePath('/', 'layout');
        return { success: true };
    } catch (error: any) {
        console.error('Failed to add category:', error);
        // Prisma unique constraint violation code
        if (error?.code === 'P2002') {
            return { error: 'A category with this name already exists for this type.' };
        }
        return { error: 'Failed to add category' };
    }
}

export async function deleteCategory(id: string) {
    // Note: Our Prisma schema is set up with:
    // transactions Transaction[]
    // Category? @relation(fields: [categoryId], references: [id], onDelete: SetNull)
    // This implies that if a Category is deleted, any Transactions that belonged to it
    // will just have their categoryId set to "null", rather than being deleted themselves.
    // This is a safe "soft-delete" approach for the relationships!

    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) throw new Error("Unauthorized");
        const userId = (session.user as any).id;

        await prisma.category.delete({
            where: { id, userId }
        });

        revalidatePath('/', 'layout');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete category:', error);
        return { error: 'Failed' };
    }
}
