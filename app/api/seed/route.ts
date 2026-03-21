import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        // 1. Create a default User first (since transactions need a user)
        const user = await prisma.user.upsert({
            where: { email: 'demo@fintrack.test' },
            update: {},
            create: {
                name: 'Demo User',
                email: 'demo@fintrack.test',
            },
        });

        // 2. Create standard Categories
        const incomeCategory = await prisma.category.upsert({
            where: {
                name_userId_type: { name: 'Salary', userId: user.id, type: 'INCOME' }
            },
            update: {},
            create: {
                name: 'Salary',
                type: 'INCOME',
                userId: user.id,
            },
        });

        const foodCategory = await prisma.category.upsert({
            where: {
                name_userId_type: { name: 'Food', userId: user.id, type: 'EXPENSE' }
            },
            update: {},
            create: {
                name: 'Food',
                type: 'EXPENSE',
                userId: user.id,
            },
        });

        // 3. Insert dummy Transactions linking to the user and categories
        await prisma.transaction.createMany({
            data: [
                {
                    amount: 8250.00,
                    description: 'Monthly Salary',
                    date: new Date(new Date().setDate(1)), // First day of current month
                    type: 'INCOME',
                    categoryId: incomeCategory.id,
                    userId: user.id
                },
                {
                    amount: 1500.00,
                    description: 'Freelance Design',
                    date: new Date(new Date().setDate(15)),
                    type: 'INCOME',
                    categoryId: incomeCategory.id,
                    userId: user.id
                },
                {
                    amount: 120.50,
                    description: 'Grocery Shopping',
                    date: new Date(),
                    type: 'EXPENSE',
                    categoryId: foodCategory.id,
                    userId: user.id
                },
                {
                    amount: 45.00,
                    description: 'Coffee Shop',
                    date: new Date(new Date().setDate(new Date().getDate() - 1)),
                    type: 'EXPENSE',
                    categoryId: foodCategory.id,
                    userId: user.id
                }
            ],
            skipDuplicates: true
        });

        return NextResponse.json({ message: 'Database seeded successfully with dummy data!' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
    }
}
