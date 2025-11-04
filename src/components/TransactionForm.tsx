import { useState } from 'react';
import { DollarSign, Calendar, Tag } from 'lucide-react';

interface TransactionFormProps {
  onAddTransaction: (transaction: {
    title: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    transaction_date: string;
  }) => void;
}

const categories = [
  'Alimentação',
  'Transporte',
  'Saúde',
  'Educação',
  'Lazer',
  'Moradia',
  'Salário',
  'Investimentos',
  'Outros'
];

export default function TransactionForm({ onAddTransaction }: TransactionFormProps) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('Outros');
  const [transactionDate, setTransactionDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !amount || parseFloat(amount) <= 0) {
      alert('Por favor, preencha todos os campos corretamente!');
      return;
    }

    onAddTransaction({
      title: title.trim(),
      amount: parseFloat(amount),
      type,
      category,
      transaction_date: transactionDate
    });

    setTitle('');
    setAmount('');
    setType('expense');
    setCategory('Outros');
    setTransactionDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      <h2 className="form-title">
        <DollarSign size={24} />
        Nova Transação
      </h2>

      <div className="form-grid">
        <div className="form-group full-width">
          <label htmlFor="title">Descrição</label>
          <input
            id="title"
            type="text"
            placeholder="Ex: Compra no supermercado"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Valor (R$)</label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">
            <Calendar size={16} />
            Data
          </label>
          <input
            id="date"
            type="date"
            value={transactionDate}
            onChange={(e) => setTransactionDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">
            <Tag size={16} />
            Categoria
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Tipo</label>
          <div className="type-buttons">
            <button
              type="button"
              className={`type-btn ${type === 'income' ? 'active income' : ''}`}
              onClick={() => setType('income')}
            >
              Entrada
            </button>
            <button
              type="button"
              className={`type-btn ${type === 'expense' ? 'active expense' : ''}`}
              onClick={() => setType('expense')}
            >
              Saída
            </button>
          </div>
        </div>
      </div>

      <button type="submit" className="btn-submit">
        Adicionar Transação
      </button>
    </form>
  );
}
