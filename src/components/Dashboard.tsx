import { TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import { Transaction } from '../lib/supabase';

interface DashboardProps {
  transactions: Transaction[];
}

export default function Dashboard({ transactions }: DashboardProps) {
  const completedTransactions = transactions.filter(t => t.status === 'completed');

  const totalIncome = completedTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = completedTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-card balance">
        <div className="card-icon">
          <DollarSign size={24} />
        </div>
        <div className="card-content">
          <p className="card-label">Saldo Total</p>
          <p className={`card-value ${balance >= 0 ? 'positive' : 'negative'}`}>
            {formatCurrency(balance)}
          </p>
        </div>
      </div>

      <div className="dashboard-card income">
        <div className="card-icon">
          <TrendingUp size={24} />
        </div>
        <div className="card-content">
          <p className="card-label">Entradas</p>
          <p className="card-value positive">{formatCurrency(totalIncome)}</p>
        </div>
      </div>

      <div className="dashboard-card expense">
        <div className="card-icon">
          <TrendingDown size={24} />
        </div>
        <div className="card-content">
          <p className="card-label">Saídas</p>
          <p className="card-value negative">{formatCurrency(totalExpense)}</p>
        </div>
      </div>

      <div className="dashboard-card transactions">
        <div className="card-icon">
          <PieChart size={24} />
        </div>
        <div className="card-content">
          <p className="card-label">Transações</p>
          <p className="card-value">{completedTransactions.length}</p>
        </div>
      </div>
    </div>
  );
}
