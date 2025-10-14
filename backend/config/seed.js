// Run this file to seed the database with sample transactions
import pool from './db.js';

const seedTransactions = async () => {
    try {
        console.log('Starting transaction seeding...');

        const userId = 2;
        const accountId = 5;

        const transactions = [
            // Income transactions
            { type: 'income', category: 'salary', amount: 15000000, description: 'Monthly salary' },
            { type: 'income', category: 'parents', amount: 2000000, description: 'Monthly allowance from parents' },
            { type: 'income', category: 'gift', amount: 500000, description: 'Birthday gift' },

            // Expense transactions
            { type: 'expense', category: 'rent', amount: 5000000, description: 'Monthly rent payment' },
            { type: 'expense', category: 'food', amount: 250000, description: 'Groceries shopping' },
            { type: 'expense', category: 'food', amount: 120000, description: 'Lunch at restaurant' },
            { type: 'expense', category: 'food', amount: 85000, description: 'Coffee and breakfast' },
            { type: 'expense', category: 'food', amount: 150000, description: 'Dinner with friends' },
            { type: 'expense', category: 'transport', amount: 300000, description: 'Monthly bus pass' },
            { type: 'expense', category: 'transport', amount: 50000, description: 'Grab ride' },
            { type: 'expense', category: 'transport', amount: 35000, description: 'Gas for motorbike' },
            { type: 'expense', category: 'shopping', amount: 800000, description: 'New clothes' },
            { type: 'expense', category: 'shopping', amount: 450000, description: 'Shoes' },
            { type: 'expense', category: 'entertainment', amount: 200000, description: 'Movie tickets' },
            { type: 'expense', category: 'entertainment', amount: 150000, description: 'Gaming subscription' },
            { type: 'expense', category: 'health', amount: 300000, description: 'Doctor visit' },
            { type: 'expense', category: 'health', amount: 180000, description: 'Medicine' },
            { type: 'expense', category: 'education', amount: 500000, description: 'Online course' },
            { type: 'expense', category: 'education', amount: 250000, description: 'Books' },
            { type: 'expense', category: 'other', amount: 100000, description: 'Phone bill' },
        ];

        // Insert transactions
        for (const tx of transactions) {
            await pool.query(
                `INSERT INTO transactions (user_id, account_id, type, category, amount, description)
         VALUES ($1, $2, $3, $4, $5, $6)`,
                [userId, accountId, tx.type, tx.category, tx.amount, tx.description]
            );
        }

        console.log(`Successfully inserted ${transactions.length} transactions for user ${userId}`);

        // Show summary
        const incomeTotal = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expenseTotal = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        console.log(`\nSummary:`);
        console.log(`Total Income: ${incomeTotal.toLocaleString('vi-VN')} VND`);
        console.log(`Total Expenses: ${expenseTotal.toLocaleString('vi-VN')} VND`);
        console.log(`Net: ${(incomeTotal - expenseTotal).toLocaleString('vi-VN')} VND`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding transactions:', error);
        process.exit(1);
    }
};

seedTransactions();