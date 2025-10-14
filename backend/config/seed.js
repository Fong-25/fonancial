// Run this file to seed the database with sample transactions
import pool from './db.js';

const seedTransactions = async () => {
    try {
        console.log('Starting transaction seeding...');

        const userId = 2;
        const accountId = 5;

        // Helper function to create a date in the past
        const createDate = (monthsAgo, day = 15, hour = 12) => {
            const date = new Date();
            date.setMonth(date.getMonth() - monthsAgo);
            date.setDate(day);
            date.setHours(hour, 0, 0, 0);
            return date;
        };

        const transactions = [
            // May (Month 5)
            { type: 'income', category: 'salary', amount: 12000000, description: 'Monthly salary', date: createDate(5, 1, 9) },
            { type: 'income', category: 'parents', amount: 1500000, description: 'Allowance from parents', date: createDate(5, 1, 10) },
            { type: 'expense', category: 'rent', amount: 4500000, description: 'Monthly rent', date: createDate(5, 2, 14) },
            { type: 'expense', category: 'food', amount: 350000, description: 'Grocery shopping', date: createDate(5, 3, 16) },
            { type: 'expense', category: 'transport', amount: 280000, description: 'Monthly transportation', date: createDate(5, 4, 8) },
            { type: 'expense', category: 'food', amount: 180000, description: 'Dinner with friends', date: createDate(5, 7, 19) },
            { type: 'expense', category: 'entertainment', amount: 250000, description: 'Concert tickets', date: createDate(5, 10, 20) },
            { type: 'expense', category: 'shopping', amount: 600000, description: 'New clothes', date: createDate(5, 12, 15) },
            { type: 'expense', category: 'health', amount: 200000, description: 'Pharmacy', date: createDate(5, 15, 11) },
            { type: 'expense', category: 'food', amount: 95000, description: 'Lunch at cafe', date: createDate(5, 18, 13) },

            // June (Month 6) - as in your example
            { type: 'income', category: 'salary', amount: 12000000, description: 'Monthly salary', date: createDate(6, 1, 9) },
            { type: 'income', category: 'parents', amount: 1500000, description: 'Allowance from parents', date: createDate(6, 1, 10) },
            { type: 'expense', category: 'rent', amount: 4500000, description: 'Monthly rent', date: createDate(6, 2, 14) },
            { type: 'expense', category: 'food', amount: 350000, description: 'Grocery shopping', date: createDate(6, 3, 16) },
            { type: 'expense', category: 'transport', amount: 280000, description: 'Monthly transportation', date: createDate(6, 4, 8) },
            { type: 'expense', category: 'food', amount: 180000, description: 'Dinner with friends', date: createDate(6, 7, 19) },
            { type: 'expense', category: 'entertainment', amount: 250000, description: 'Concert tickets', date: createDate(6, 10, 20) },
            { type: 'expense', category: 'shopping', amount: 600000, description: 'New clothes', date: createDate(6, 12, 15) },
            { type: 'expense', category: 'health', amount: 200000, description: 'Pharmacy', date: createDate(6, 15, 11) },
            { type: 'expense', category: 'food', amount: 95000, description: 'Lunch at cafe', date: createDate(6, 18, 13) },

            // July (Month 7)
            { type: 'income', category: 'salary', amount: 12000000, description: 'Monthly salary', date: createDate(7, 1, 9) },
            { type: 'income', category: 'parents', amount: 1500000, description: 'Allowance from parents', date: createDate(7, 1, 10) },
            { type: 'expense', category: 'rent', amount: 4500000, description: 'Monthly rent', date: createDate(7, 2, 14) },
            { type: 'expense', category: 'food', amount: 350000, description: 'Grocery shopping', date: createDate(7, 3, 16) },
            { type: 'expense', category: 'transport', amount: 280000, description: 'Monthly transportation', date: createDate(7, 4, 8) },
            { type: 'expense', category: 'food', amount: 180000, description: 'Dinner with friends', date: createDate(7, 7, 19) },
            { type: 'expense', category: 'entertainment', amount: 250000, description: 'Concert tickets', date: createDate(7, 10, 20) },
            { type: 'expense', category: 'shopping', amount: 600000, description: 'New clothes', date: createDate(7, 12, 15) },
            { type: 'expense', category: 'health', amount: 200000, description: 'Pharmacy', date: createDate(7, 15, 11) },
            { type: 'expense', category: 'food', amount: 95000, description: 'Lunch at cafe', date: createDate(7, 18, 13) },

            // August (Month 8)
            { type: 'income', category: 'salary', amount: 12000000, description: 'Monthly salary', date: createDate(8, 1, 9) },
            { type: 'income', category: 'parents', amount: 1500000, description: 'Allowance from parents', date: createDate(8, 1, 10) },
            { type: 'expense', category: 'rent', amount: 4500000, description: 'Monthly rent', date: createDate(8, 2, 14) },
            { type: 'expense', category: 'food', amount: 350000, description: 'Grocery shopping', date: createDate(8, 3, 16) },
            { type: 'expense', category: 'transport', amount: 280000, description: 'Monthly transportation', date: createDate(8, 4, 8) },
            { type: 'expense', category: 'food', amount: 180000, description: 'Dinner with friends', date: createDate(8, 7, 19) },
            { type: 'expense', category: 'entertainment', amount: 250000, description: 'Concert tickets', date: createDate(8, 10, 20) },
            { type: 'expense', category: 'shopping', amount: 600000, description: 'New clothes', date: createDate(8, 12, 15) },
            { type: 'expense', category: 'health', amount: 200000, description: 'Pharmacy', date: createDate(8, 15, 11) },
            { type: 'expense', category: 'food', amount: 95000, description: 'Lunch at cafe', date: createDate(8, 18, 13) },

            // September (Month 9)
            { type: 'income', category: 'salary', amount: 12000000, description: 'Monthly salary', date: createDate(9, 1, 9) },
            { type: 'income', category: 'parents', amount: 1500000, description: 'Allowance from parents', date: createDate(9, 1, 10) },
            { type: 'expense', category: 'rent', amount: 4500000, description: 'Monthly rent', date: createDate(9, 2, 14) },
            { type: 'expense', category: 'food', amount: 350000, description: 'Grocery shopping', date: createDate(9, 3, 16) },
            { type: 'expense', category: 'transport', amount: 280000, description: 'Monthly transportation', date: createDate(9, 4, 8) },
            { type: 'expense', category: 'food', amount: 180000, description: 'Dinner with friends', date: createDate(9, 7, 19) },
            { type: 'expense', category: 'entertainment', amount: 250000, description: 'Concert tickets', date: createDate(9, 10, 20) },
            { type: 'expense', category: 'shopping', amount: 600000, description: 'New clothes', date: createDate(9, 12, 15) },
            { type: 'expense', category: 'health', amount: 200000, description: 'Pharmacy', date: createDate(9, 15, 11) },
            { type: 'expense', category: 'food', amount: 95000, description: 'Lunch at cafe', date: createDate(9, 18, 13) },

            // October (Month 10)
            { type: 'income', category: 'salary', amount: 12000000, description: 'Monthly salary', date: createDate(10, 1, 9) },
            { type: 'income', category: 'parents', amount: 1500000, description: 'Allowance from parents', date: createDate(10, 1, 10) },
            { type: 'expense', category: 'rent', amount: 4500000, description: 'Monthly rent', date: createDate(10, 2, 14) },
            { type: 'expense', category: 'food', amount: 350000, description: 'Grocery shopping', date: createDate(10, 3, 16) },
            { type: 'expense', category: 'transport', amount: 280000, description: 'Monthly transportation', date: createDate(10, 4, 8) },
            { type: 'expense', category: 'food', amount: 180000, description: 'Dinner with friends', date: createDate(10, 7, 19) },
            { type: 'expense', category: 'entertainment', amount: 250000, description: 'Concert tickets', date: createDate(10, 10, 20) },
            { type: 'expense', category: 'shopping', amount: 600000, description: 'New clothes', date: createDate(10, 12, 15) },
            { type: 'expense', category: 'health', amount: 200000, description: 'Pharmacy', date: createDate(10, 15, 11) },
            { type: 'expense', category: 'food', amount: 95000, description: 'Lunch at cafe', date: createDate(10, 18, 13) }
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