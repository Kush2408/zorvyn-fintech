export type TransactionCategory = 'Food' | 'Transport' | 'Entertainment' | 'Shopping' | 'Health' | 'Utilities' | 'Salary' | 'Freelance' | 'Investment';
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: TransactionCategory;
  amount: number;
  type: TransactionType;
}

export const EXPENSE_CATEGORIES: TransactionCategory[] = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Health', 'Utilities'];
export const INCOME_CATEGORIES: TransactionCategory[] = ['Salary', 'Freelance', 'Investment'];
export const ALL_CATEGORIES: TransactionCategory[] = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export const mockTransactions: Transaction[] = [
  { id: '1', date: '2024-11-02', description: 'Salary Credit', category: 'Salary', amount: 85000, type: 'income' },
  { id: '2', date: '2024-11-05', description: 'Swiggy Order', category: 'Food', amount: 450, type: 'expense' },
  { id: '3', date: '2024-11-08', description: 'Uber Ride to Office', category: 'Transport', amount: 320, type: 'expense' },
  { id: '4', date: '2024-11-12', description: 'Netflix Subscription', category: 'Entertainment', amount: 649, type: 'expense' },
  { id: '5', date: '2024-11-15', description: 'Amazon Purchase - Headphones', category: 'Shopping', amount: 2499, type: 'expense' },
  { id: '6', date: '2024-11-18', description: 'Gym Membership', category: 'Health', amount: 1500, type: 'expense' },
  { id: '7', date: '2024-11-22', description: 'Electricity Bill', category: 'Utilities', amount: 2200, type: 'expense' },
  { id: '8', date: '2024-11-25', description: 'Freelance Project Payment', category: 'Freelance', amount: 25000, type: 'income' },
  { id: '9', date: '2024-12-01', description: 'Salary Credit', category: 'Salary', amount: 85000, type: 'income' },
  { id: '10', date: '2024-12-03', description: 'Zomato Order', category: 'Food', amount: 680, type: 'expense' },
  { id: '11', date: '2024-12-06', description: 'Ola Ride', category: 'Transport', amount: 280, type: 'expense' },
  { id: '12', date: '2024-12-10', description: 'Spotify Premium', category: 'Entertainment', amount: 119, type: 'expense' },
  { id: '13', date: '2024-12-14', description: 'Myntra Shopping', category: 'Shopping', amount: 3200, type: 'expense' },
  { id: '14', date: '2024-12-18', description: 'Doctor Consultation', category: 'Health', amount: 800, type: 'expense' },
  { id: '15', date: '2024-12-20', description: 'Internet Bill', category: 'Utilities', amount: 999, type: 'expense' },
  { id: '16', date: '2024-12-28', description: 'Dividend Income', category: 'Investment', amount: 5000, type: 'income' },
  { id: '17', date: '2025-01-01', description: 'Salary Credit', category: 'Salary', amount: 85000, type: 'income' },
  { id: '18', date: '2025-01-04', description: 'Dominos Pizza', category: 'Food', amount: 550, type: 'expense' },
  { id: '19', date: '2025-01-08', description: 'Metro Card Recharge', category: 'Transport', amount: 500, type: 'expense' },
  { id: '20', date: '2025-01-12', description: 'BookMyShow Tickets', category: 'Entertainment', amount: 900, type: 'expense' },
  { id: '21', date: '2025-01-20', description: 'Flipkart - Shoes', category: 'Shopping', amount: 2800, type: 'expense' },
  { id: '22', date: '2025-01-25', description: 'Pharmacy - Medicines', category: 'Health', amount: 650, type: 'expense' },
  { id: '23', date: '2025-02-01', description: 'Salary Credit', category: 'Salary', amount: 90000, type: 'income' },
  { id: '24', date: '2025-02-05', description: 'Swiggy Instamart', category: 'Food', amount: 1200, type: 'expense' },
  { id: '25', date: '2025-02-10', description: 'Rapido Bike Ride', category: 'Transport', amount: 150, type: 'expense' },
  { id: '26', date: '2025-02-15', description: 'Gas Bill', category: 'Utilities', amount: 850, type: 'expense' },
  { id: '27', date: '2025-02-20', description: 'Freelance - UI Design', category: 'Freelance', amount: 18000, type: 'income' },
  { id: '28', date: '2025-03-01', description: 'Salary Credit', category: 'Salary', amount: 90000, type: 'income' },
  { id: '29', date: '2025-03-07', description: 'Blinkit Groceries', category: 'Food', amount: 950, type: 'expense' },
  { id: '30', date: '2025-03-12', description: 'Uber Ride', category: 'Transport', amount: 400, type: 'expense' },
  { id: '31', date: '2025-03-18', description: 'Amazon Prime Renewal', category: 'Entertainment', amount: 1499, type: 'expense' },
  { id: '32', date: '2025-03-22', description: 'Reliance Digital - Charger', category: 'Shopping', amount: 1200, type: 'expense' },
  { id: '33', date: '2025-03-28', description: 'Water Bill', category: 'Utilities', amount: 400, type: 'expense' },
  { id: '34', date: '2025-04-01', description: 'Salary Credit', category: 'Salary', amount: 90000, type: 'income' },
  { id: '35', date: '2025-04-03', description: 'Chai Point Order', category: 'Food', amount: 180, type: 'expense' },
];
