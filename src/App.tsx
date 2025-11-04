import { useState, useEffect } from 'react';
import { Wallet } from 'lucide-react';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import InvestmentSimulator from './components/InvestmentSimulator';
import EditModal from './components/EditModal';
import { supabase, Transaction, InvestmentSimulation } from './lib/supabase';

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [simulations, setSimulations] = useState<InvestmentSimulation[]>([]);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense' | 'pending' | 'completed'>('all');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
    loadSimulations();
  }, []);

  const loadTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('transaction_date', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
      alert('Erro ao carregar transações. Por favor, recarregue a página.');
    } finally {
      setLoading(false);
    }
  };

  const loadSimulations = async () => {
    try {
      const { data, error } = await supabase
        .from('investment_simulations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSimulations(data || []);
    } catch (error) {
      console.error('Erro ao carregar simulações:', error);
    }
  };

  const addTransaction = async (newTransaction: {
    title: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    transaction_date: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([{ ...newTransaction, status: 'pending' }])
        .select()
        .single();

      if (error) throw error;
      setTransactions([data, ...transactions]);
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      alert('Erro ao adicionar transação. Tente novamente.');
    }
  };

  const toggleTransactionStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';

    try {
      const { error } = await supabase
        .from('transactions')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setTransactions(
        transactions.map((t) =>
          t.id === id ? { ...t, status: newStatus as 'pending' | 'completed' } : t
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status. Tente novamente.');
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta transação?')) return;

    try {
      const { error } = await supabase.from('transactions').delete().eq('id', id);

      if (error) throw error;
      setTransactions(transactions.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      alert('Erro ao excluir transação. Tente novamente.');
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setTransactions(
        transactions.map((t) => (t.id === id ? { ...t, ...updates } : t))
      );
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      alert('Erro ao atualizar transação. Tente novamente.');
    }
  };

  const addSimulation = async (simulation: {
    initial_amount: number;
    interest_rate: number;
    time_period: number;
    final_amount: number;
  }) => {
    try {
      const { data, error } = await supabase
        .from('investment_simulations')
        .insert([simulation])
        .select()
        .single();

      if (error) throw error;
      setSimulations([data, ...simulations]);
    } catch (error) {
      console.error('Erro ao salvar simulação:', error);
      alert('Erro ao salvar simulação. Tente novamente.');
    }
  };

  const deleteSimulation = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta simulação?')) return;

    try {
      const { error } = await supabase
        .from('investment_simulations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSimulations(simulations.filter((s) => s.id !== id));
    } catch (error) {
      console.error('Erro ao excluir simulação:', error);
      alert('Erro ao excluir simulação. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <Wallet size={32} />
              <h1>FinanceControl</h1>
            </div>
            <p className="subtitle">Controle Financeiro Pessoal</p>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <Dashboard transactions={transactions} />

          <div className="content-grid">
            <div className="left-column">
              <TransactionForm onAddTransaction={addTransaction} />
              <InvestmentSimulator
                onAddSimulation={addSimulation}
                simulations={simulations}
                onDeleteSimulation={deleteSimulation}
              />
            </div>

            <div className="right-column">
              <TransactionList
                transactions={transactions}
                onToggleStatus={toggleTransactionStatus}
                onDelete={deleteTransaction}
                onEdit={setEditingTransaction}
                filter={filter}
                onFilterChange={setFilter}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>&copy; 2025 FinanceControl - Sistema de Controle Financeiro Pessoal</p>
        </div>
      </footer>

      <EditModal
        transaction={editingTransaction}
        onClose={() => setEditingTransaction(null)}
        onSave={updateTransaction}
      />
    </div>
  );
}

export default App;
