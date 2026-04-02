import { useState } from 'react';
import { Search, Plus, Download, ArrowUpDown, Pencil, Trash2 } from 'lucide-react';
import { useTransactions } from '@/contexts/TransactionsContext';
import { useRole } from '@/contexts/RoleContext';
import { useApi } from '@/contexts/ApiContext';
import { addTransaction as apiAdd, updateTransaction as apiUpdate, deleteTransaction as apiDelete } from '@/api/mockApi';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ALL_CATEGORIES, Transaction, TransactionCategory, TransactionType } from '@/data/mockTransactions';
import { toast } from 'sonner';

function TransactionForm({ transaction, onSubmit, onClose }: {
  transaction?: Transaction;
  onSubmit: (t: Omit<Transaction, 'id'> & { id?: string }) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    date: transaction?.date || new Date().toISOString().slice(0, 10),
    description: transaction?.description || '',
    category: transaction?.category || 'Food' as TransactionCategory,
    amount: transaction?.amount?.toString() || '',
    type: transaction?.type || 'expense' as TransactionType,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: transaction?.id,
      ...form,
      amount: parseFloat(form.amount) || 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Date</Label>
        <Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
      </div>
      <div className="space-y-2">
        <Label>Amount (₹)</Label>
        <Input type="number" min="0" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as TransactionCategory })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {ALL_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Type</Label>
          <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as TransactionType })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
        <Button type="submit">{transaction ? 'Update' : 'Add'} Transaction</Button>
      </div>
    </form>
  );
}

export default function Transactions() {
  const { state, dispatch, filteredTransactions, isLoading } = useTransactions();
  const { role } = useRole();
  const { trackCall } = useApi();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | undefined>();

  const { filters } = state;

  const setFilter = (f: Partial<typeof filters>) => dispatch({ type: 'SET_FILTER', payload: f });

  const handleAdd = async (t: Omit<Transaction, 'id'> & { id?: string }) => {
    try {
      const newTx = await trackCall(() => apiAdd({ date: t.date, description: t.description, category: t.category, amount: t.amount, type: t.type }));
      dispatch({ type: 'ADD_TRANSACTION', payload: newTx });
      toast.success('Transaction added successfully');
      setDialogOpen(false);
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handleUpdate = async (t: Omit<Transaction, 'id'> & { id?: string }) => {
    if (!t.id) return;
    try {
      const updated = await trackCall(() => apiUpdate(t.id!, { date: t.date, description: t.description, category: t.category, amount: t.amount, type: t.type }));
      dispatch({ type: 'UPDATE_TRANSACTION', payload: updated });
      toast.success('Transaction updated successfully');
      setDialogOpen(false);
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await trackCall(() => apiDelete(id));
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
      toast.success('Transaction deleted');
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

  const exportCSV = () => {
    const headers = 'Date,Description,Category,Amount (INR),Type\n';
    const rows = filteredTransactions.map(t => `${t.date},"${t.description}",${t.category},₹${t.amount.toLocaleString('en-IN')},${t.type}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'zorvyn-transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleSort = (by: 'date' | 'amount') => {
    if (filters.sortBy === by) {
      setFilter({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' });
    } else {
      setFilter({ sortBy: by, sortOrder: 'desc' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl md:text-3xl font-bold">Transactions</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="h-4 w-4 mr-1" /> Export CSV
          </Button>
          {role === 'admin' && (
            <Button size="sm" onClick={() => { setEditing(undefined); setDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-1" /> Add Transaction
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={filters.search}
            onChange={e => setFilter({ search: e.target.value })}
            className="pl-9"
          />
        </div>
        <Select value={filters.category} onValueChange={(v) => setFilter({ category: v as any })}>
          <SelectTrigger className="w-[150px]"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {ALL_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filters.type} onValueChange={(v) => setFilter({ type: v as any })}>
          <SelectTrigger className="w-[130px]"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center space-y-3">
          <div className="text-5xl">📭</div>
          <h3 className="text-lg font-semibold">No transactions found</h3>
          <p className="text-muted-foreground text-sm">Try adjusting your filters or add a new transaction.</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="glass-card rounded-xl overflow-hidden hidden md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-4 text-muted-foreground font-medium cursor-pointer" onClick={() => toggleSort('date')}>
                    <span className="flex items-center gap-1">Date <ArrowUpDown className="h-3 w-3" /></span>
                  </th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Description</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Category</th>
                  <th className="text-left p-4 text-muted-foreground font-medium cursor-pointer" onClick={() => toggleSort('amount')}>
                    <span className="flex items-center gap-1">Amount <ArrowUpDown className="h-3 w-3" /></span>
                  </th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Type</th>
                  {role === 'admin' && <th className="text-right p-4 text-muted-foreground font-medium">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map(t => (
                  <tr key={t.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                    <td className="p-4">{new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td className="p-4 font-medium">{t.description}</td>
                    <td className="p-4"><Badge variant="secondary" className="text-xs">{t.category}</Badge></td>
                    <td className={`p-4 font-semibold ${t.type === 'income' ? 'text-primary' : 'text-destructive'}`}>
                      {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-4">
                      <Badge variant={t.type === 'income' ? 'default' : 'destructive'} className="text-xs">
                        {t.type === 'income' ? 'Income' : 'Expense'}
                      </Badge>
                    </td>
                    {role === 'admin' && (
                      <td className="p-4 text-right">
                        <div className="flex gap-1 justify-end">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditing(t); setDialogOpen(true); }}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(t.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="space-y-3 md:hidden">
            {filteredTransactions.map(t => (
              <div key={t.id} className="glass-card rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{t.description}</span>
                  <span className={`font-semibold ${t.type === 'income' ? 'text-primary' : 'text-destructive'}`}>
                    {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                  <Badge variant="secondary" className="text-xs">{t.category}</Badge>
                  <Badge variant={t.type === 'income' ? 'default' : 'destructive'} className="text-xs">{t.type}</Badge>
                </div>
                {role === 'admin' && (
                  <div className="flex gap-2 pt-1">
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => { setEditing(t); setDialogOpen(true); }}>
                      <Pencil className="h-3 w-3 mr-1" /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive" onClick={() => handleDelete(t.id)}>
                      <Trash2 className="h-3 w-3 mr-1" /> Delete
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit' : 'Add'} Transaction</DialogTitle>
          </DialogHeader>
          <TransactionForm
            transaction={editing}
            onSubmit={editing ? handleUpdate : handleAdd}
            onClose={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
