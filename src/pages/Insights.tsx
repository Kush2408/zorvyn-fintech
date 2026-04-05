import { useState, useEffect, useMemo } from 'react';
import { useTransactions } from '@/contexts/TransactionsContext';
import { useApi } from '@/contexts/ApiContext';
import { getInsights } from '@/api/mockApi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, Zap, Calendar, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function Insights() {
  const { state, isLoading: txLoading } = useTransactions();
  const { trackCall } = useApi();
  const { transactions } = state;
  const [insightsLoading, setInsightsLoading] = useState(true);
  const [insightsData, setInsightsData] = useState<Awaited<ReturnType<typeof getInsights>> | null>(null);

  useEffect(() => {
    if (txLoading) return;
    let cancelled = false;
    const load = async () => {
      setInsightsLoading(true);
      try {
        const data = await trackCall(getInsights);
        if (!cancelled) setInsightsData(data);
      } catch {
        if (!cancelled) toast.error('Failed to load insights. Please refresh.');
      } finally {
        if (!cancelled) setInsightsLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [txLoading, transactions, trackCall]);

  const spendingStreak = useMemo(() => {
    const avgDaily = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0) / 180;
    const budget = avgDaily * 1.2;
    const days: Record<string, number> = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      days[t.date] = (days[t.date] || 0) + t.amount;
    });
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 60; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const spent = days[key] || 0;
      if (spent <= budget) streak++;
      else break;
    }
    return streak;
  }, [transactions]);

  const loading = txLoading || insightsLoading;
  const topCategory = insightsData?.topCategory ?? { name: 'N/A', amount: 0, percent: 0 };
  const biggestExpense = insightsData?.biggestExpense ?? null;
  const monthComparison = insightsData?.monthComparison ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Insights</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4 text-primary" />
            Highest Spending Category
          </div>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-2 w-full" />
            </div>
          ) : (
            <>
              <div>
                <h3 className="text-xl font-bold">{topCategory.name}</h3>
                <p className="text-sm text-muted-foreground">₹{topCategory.amount.toLocaleString('en-IN')}</p>
              </div>
              <Progress value={topCategory.percent} className="h-2" />
              <p className="text-xs text-muted-foreground">{topCategory.percent.toFixed(1)}% of total spending</p>
            </>
          )}
        </div>

        <div className="glass-card rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertTriangle className="h-4 w-4 text-accent" />
            Biggest Single Expense
          </div>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          ) : biggestExpense ? (
            <div>
              <h3 className="text-xl font-bold">{biggestExpense.description}</h3>
              <p className="text-sm text-destructive font-semibold">₹{biggestExpense.amount.toLocaleString('en-IN')}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(biggestExpense.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground">No expenses recorded</p>
          )}
        </div>

        <div className="glass-card rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="h-4 w-4 text-primary" />
            Spending Streak
          </div>
          {loading ? (
            <Skeleton className="h-10 w-24" />
          ) : (
            <>
              <h3 className="text-3xl font-bold">{spendingStreak} <span className="text-lg font-normal text-muted-foreground">days</span></h3>
              <p className="text-sm text-muted-foreground">You've kept expenses under daily budget</p>
            </>
          )}
        </div>

        <div className="glass-card rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 text-accent" />
            Quick Summary
          </div>
          {loading ? (
            <Skeleton className="h-6 w-16" />
          ) : (
            <>
              <h3 className="text-xl font-bold">{transactions.length}</h3>
              <p className="text-sm text-muted-foreground">Total transactions recorded across 6 months</p>
            </>
          )}
        </div>
      </div>

      <div className="glass-card rounded-xl p-5">
        <h2 className="text-lg font-semibold mb-4">Month-over-Month Comparison</h2>
        {loading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthComparison} barGap={8} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 18%)" />
              <XAxis dataKey="name" stroke="hsl(215, 15%, 55%)" fontSize={12} />
              <YAxis stroke="hsl(215, 15%, 55%)" fontSize={12} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: 'hsl(215, 25%, 10%)', border: '1px solid hsl(215, 20%, 18%)', borderRadius: 8 }}
                formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`]}
              />
              <Legend />
              <Bar dataKey="Income" fill="hsl(163, 100%, 42%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Expenses" fill="hsl(340, 75%, 55%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
