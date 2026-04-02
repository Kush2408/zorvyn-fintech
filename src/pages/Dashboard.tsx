import { useMemo, useState, useEffect } from 'react';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useTransactions } from '@/contexts/TransactionsContext';
import { useApi } from '@/contexts/ApiContext';
import { getSummaryStats } from '@/api/mockApi';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { toast } from 'sonner';

const CHART_COLORS = [
  'hsl(163, 100%, 42%)',
  'hsl(43, 90%, 61%)',
  'hsl(200, 80%, 55%)',
  'hsl(280, 65%, 60%)',
  'hsl(340, 75%, 55%)',
  'hsl(120, 60%, 50%)',
];

export default function Dashboard() {
  const { state, isLoading } = useTransactions();
  const { trackCall } = useApi();
  const { transactions } = state;
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryStats, setSummaryStats] = useState<{ totalBalance: number; totalIncome: number; totalExpenses: number; savingsRate: number } | null>(null);

  useEffect(() => {
    if (isLoading) return;
    let cancelled = false;
    const load = async () => {
      setSummaryLoading(true);
      try {
        const stats = await trackCall(getSummaryStats);
        if (!cancelled) setSummaryStats(stats);
      } catch {
        if (!cancelled) toast.error('Failed to load summary stats. Please refresh.');
      } finally {
        if (!cancelled) setSummaryLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [isLoading, transactions, trackCall]);

  const stats = useMemo(() => {
    if (summaryStats) return summaryStats;
    const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { totalBalance: income - expenses, totalIncome: income, totalExpenses: expenses, savingsRate: income > 0 ? ((income - expenses) / income) * 100 : 0 };
  }, [transactions, summaryStats]);

  const balanceTrend = useMemo(() => {
    const months: Record<string, number> = {};
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let running = 0;
    sorted.forEach(t => {
      const key = t.date.slice(0, 7);
      running += t.type === 'income' ? t.amount : -t.amount;
      months[key] = running;
    });
    return Object.entries(months).map(([month, balance]) => ({
      month: new Date(month + '-01').toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
      balance,
    }));
  }, [transactions]);

  const categoryBreakdown = useMemo(() => {
    const cats: Record<string, number> = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      cats[t.category] = (cats[t.category] || 0) + t.amount;
    });
    return Object.entries(cats).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const summaryCards = [
    { label: 'Total Balance', value: stats.totalBalance, icon: Wallet, change: 12.5, positive: true },
    { label: 'Total Income', value: stats.totalIncome, icon: TrendingUp, change: 8.2, positive: true },
    { label: 'Total Expenses', value: stats.totalExpenses, icon: TrendingDown, change: 3.1, positive: false },
    { label: 'Savings Rate', value: stats.savingsRate, icon: PiggyBank, change: 2.4, positive: true, isPercent: true },
  ];

  const showSkeleton = isLoading || summaryLoading;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="glass-card rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{card.label}</span>
              <card.icon className="h-5 w-5 text-primary" />
            </div>
            {showSkeleton ? (
              <Skeleton className="h-8 w-3/4" />
            ) : (
              <div className="text-2xl font-bold">
                {card.isPercent ? (
                  <AnimatedCounter value={card.value} suffix="%" decimals={1} />
                ) : (
                  <AnimatedCounter value={card.value} prefix="₹" />
                )}
              </div>
            )}
            {showSkeleton ? (
              <Skeleton className="h-4 w-1/2" />
            ) : (
              <div className={`flex items-center gap-1 text-xs ${card.positive ? 'text-primary' : 'text-destructive'}`}>
                {card.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                <span>{card.change}% vs last month</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-5 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Balance Trend</h2>
          {isLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={balanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 18%)" />
                <XAxis dataKey="month" stroke="hsl(215, 15%, 55%)" fontSize={12} />
                <YAxis stroke="hsl(215, 15%, 55%)" fontSize={12} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: 'hsl(215, 25%, 10%)', border: '1px solid hsl(215, 20%, 18%)', borderRadius: 8 }}
                  labelStyle={{ color: 'hsl(210, 40%, 98%)' }}
                  formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Balance']}
                />
                <Line type="monotone" dataKey="balance" stroke="hsl(163, 100%, 42%)" strokeWidth={2.5} dot={{ fill: 'hsl(163, 100%, 42%)', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="glass-card rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-4">Spending by Category</h2>
          {isLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={categoryBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                  {categoryBreakdown.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'hsl(215, 25%, 10%)', border: '1px solid hsl(215, 20%, 18%)', borderRadius: 8 }}
                  formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
