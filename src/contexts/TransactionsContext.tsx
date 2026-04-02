import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { Transaction, TransactionCategory, TransactionType } from '@/data/mockTransactions';
import { getAllTransactions } from '@/api/mockApi';
import { useApi } from '@/contexts/ApiContext';

interface Filters {
  search: string;
  category: TransactionCategory | 'all';
  type: TransactionType | 'all';
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
}

interface State {
  transactions: Transaction[];
  filters: Filters;
}

type Action =
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'SET_FILTER'; payload: Partial<Filters> };

const defaultFilters: Filters = {
  search: '',
  category: 'all',
  type: 'all',
  sortBy: 'date',
  sortOrder: 'desc',
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t => t.id === action.payload.id ? action.payload : t),
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      };
    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    default:
      return state;
  }
}

interface TransactionsContextType {
  state: State;
  dispatch: React.Dispatch<Action>;
  filteredTransactions: Transaction[];
  isLoading: boolean;
}

const TransactionsContext = createContext<TransactionsContextType>(null!);

export const useTransactions = () => useContext(TransactionsContext);

export const TransactionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    transactions: [],
    filters: defaultFilters,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { trackCall } = useApi();

  // Load transactions from mock API on mount
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const txs = await trackCall(getAllTransactions);
        if (!cancelled) {
          dispatch({ type: 'SET_TRANSACTIONS', payload: txs });
        }
      } catch {
        // Will be retried or handled by consumer
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [trackCall]);

  // Persist to localStorage on change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('zorvyn-transactions', JSON.stringify(state.transactions));
    }
  }, [state.transactions, isLoading]);

  const filteredTransactions = React.useMemo(() => {
    let result = [...state.transactions];
    const { search, category, type, sortBy, sortOrder } = state.filters;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(t => t.description.toLowerCase().includes(q));
    }
    if (category !== 'all') result = result.filter(t => t.category === category);
    if (type !== 'all') result = result.filter(t => t.type === type);

    result.sort((a, b) => {
      const mul = sortOrder === 'asc' ? 1 : -1;
      if (sortBy === 'date') return mul * (new Date(a.date).getTime() - new Date(b.date).getTime());
      return mul * (a.amount - b.amount);
    });

    return result;
  }, [state.transactions, state.filters]);

  return (
    <TransactionsContext.Provider value={{ state, dispatch, filteredTransactions, isLoading }}>
      {children}
    </TransactionsContext.Provider>
  );
};
