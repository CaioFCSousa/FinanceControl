import { Transaction } from '../lib/supabase';
import TransactionItem from './TransactionItem';
import { ListFilter } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onToggleStatus: (id: string, currentStatus: string) => void;
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
  filter: 'all' | 'income' | 'expense' | 'pending' | 'completed';
  onFilterChange: (filter: 'all' | 'income' | 'expense' | 'pending' | 'completed') => void;
}

export default function TransactionList({
  transactions,
  onToggleStatus,
  onDelete,
  onEdit,
  filter,
  onFilterChange
}: TransactionListProps) {
  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === 'all') return true;
    if (filter === 'income' || filter === 'expense') {
      return transaction.type === filter;
    }
    return transaction.status === filter;
  });

  return (
    <div className="transaction-list-container">
      <div className="list-header">
        <h2>
          <ListFilter size={24} />
          Transações ({filteredTransactions.length})
        </h2>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => onFilterChange('all')}
          >
            Todas
          </button>
          <button
            className={`filter-btn ${filter === 'income' ? 'active' : ''}`}
            onClick={() => onFilterChange('income')}
          >
            Entradas
          </button>
          <button
            className={`filter-btn ${filter === 'expense' ? 'active' : ''}`}
            onClick={() => onFilterChange('expense')}
          >
            Saídas
          </button>
          <button
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => onFilterChange('pending')}
          >
            Pendentes
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => onFilterChange('completed')}
          >
            Concluídas
          </button>
        </div>
      </div>

      <div className="transaction-list">
        {filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <p>Nenhuma transação encontrada</p>
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onToggleStatus={onToggleStatus}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))
        )}
      </div>
    </div>
  );
}
