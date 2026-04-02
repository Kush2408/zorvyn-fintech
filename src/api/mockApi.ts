import { Transaction, mockTransactions, TransactionCategory } from '@/data/mockTransactions';

// Simulated delay between 600-900ms
function delay(): Promise<void> {
  const ms = 600 + Math.random() * 300;
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 10% random failure rate
function maybeThrow() {
  if (Math.random() < 0.1) {
    throw new Error('Network error: Something went wrong. Please try again.');
  }
}

// Internal store (simulates server-side DB)
let store: Transaction[] = [...mockTransactions];

export async function getAllTransactions(): Promise<Transaction[]> {
  await delay();
  maybeThrow();
  return [...store];
}

export async function addTransaction(data: Omit<Transaction, 'id'>): Promise<Transaction> {
  await delay();
  maybeThrow();
  const newTx: Transaction = { ...data, id: Date.now().toString() };
  store = [newTx, ...store];
  return newTx;
}

export async function updateTransaction(id: string, data: Partial<Omit<Transaction, 'id'>>): Promise<Transaction> {
  await delay();
  maybeThrow();
  const idx = store.findIndex(t => t.id === id);
  if (idx === -1) throw new Error('Transaction not found');
  store[idx] = { ...store[idx], ...data };
  return { ...store[idx] };
}

export async function deleteTransaction(id: string): Promise<{ message: string }> {
  await delay();
  maybeThrow();
  store = store.filter(t => t.id !== id);
  return { message: 'Transaction deleted successfully' };
}

export async function getSummaryStats(): Promise<{
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  savingsRate: number;
}> {
  await delay();
  maybeThrow();
  const income = store.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = store.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  return {
    totalBalance: income - expenses,
    totalIncome: income,
    totalExpenses: expenses,
    savingsRate: income > 0 ? ((income - expenses) / income) * 100 : 0,
  };
}

export async function getInsights(): Promise<{
  topCategory: { name: string; amount: number; percent: number };
  biggestExpense: Transaction | null;
  monthComparison: { name: string; Income: number; Expenses: number }[];
}> {
  await delay();
  maybeThrow();

  // Top category
  const cats: Record<string, number> = {};
  store.filter(t => t.type === 'expense').forEach(t => {
    cats[t.category] = (cats[t.category] || 0) + t.amount;
  });
  const total = Object.values(cats).reduce((s, v) => s + v, 0);
  const sorted = Object.entries(cats).sort((a, b) => b[1] - a[1]);
  const topCategory = sorted.length > 0
    ? { name: sorted[0][0], amount: sorted[0][1], percent: total > 0 ? (sorted[0][1] / total) * 100 : 0 }
    : { name: 'N/A', amount: 0, percent: 0 };

  // Biggest expense
  const expenses = store.filter(t => t.type === 'expense');
  const biggestExpense = expenses.length > 0
    ? expenses.reduce((max, t) => t.amount > max.amount ? t : max, expenses[0])
    : null;

  // Month comparison
  const now = new Date();
  const currMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const prev = new Date(now.getFullYear(), now.getMonth() - 1);
  const prevMonth = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`;

  const calc = (month: string) => {
    const txs = store.filter(t => t.date.startsWith(month));
    return {
      income: txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
      expenses: txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    };
  };

  const curr = calc(currMonth);
  const prevData = calc(prevMonth);

  return {
    topCategory,
    biggestExpense,
    monthComparison: [
      { name: 'Previous', Income: prevData.income, Expenses: prevData.expenses },
      { name: 'Current', Income: curr.income, Expenses: curr.expenses },
    ],
  };
}

// Reset store (for testing)
export function resetStore() {
  store = [...mockTransactions];
}
