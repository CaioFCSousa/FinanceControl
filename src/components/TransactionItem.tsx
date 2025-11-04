import { Check, X, Edit2, Trash2, Calendar, Tag } from 'lucide-react';
import { Transaction } from '../lib/supabase';

interface TransactionItemProps {
  transaction: Transaction;
  onToggleStatus: (id: string, currentStatus: string) => void;
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
}

export default function TransactionItem({
  transaction,
  onToggleStatus,
  onDelete,
  onEdit
}: TransactionItemProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  return (
    <div
      className={`transaction-item ${transaction.type} ${
        transaction.status === 'completed' ? 'completed' : ''
      }`}
    >
      <div className="transaction-main">
        <button
          className="status-btn"
          onClick={() => onToggleStatus(transaction.id, transaction.status)}
          title={
            transaction.status === 'completed'
              ? 'Marcar como pendente'
              : 'Marcar como concluída'
          }
        >
          {transaction.status === 'completed' ? (
            <Check size={20} />
          ) : (
            <div className="unchecked-circle" />
          )}
        </button>

        <div className="transaction-info">
          <h3 className={transaction.status === 'completed' ? 'strikethrough' : ''}>
            {transaction.title}
          </h3>
          <div className="transaction-meta">
            <span className="meta-item">
              <Calendar size={14} />
              {formatDate(transaction.transaction_date)}
            </span>
            <span className="meta-item">
              <Tag size={14} />
              {transaction.category}
            </span>
          </div>
        </div>

        <div className="transaction-amount">
          <span className={`amount ${transaction.type}`}>
            {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
          </span>
        </div>
      </div>

      <div className="transaction-actions">
        <button
          className="action-btn edit"
          onClick={() => onEdit(transaction)}
          title="Editar"
        >
          <Edit2 size={16} />
        </button>
        <button
          className="action-btn delete"
          onClick={() => onDelete(transaction.id)}
          title="Excluir"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
