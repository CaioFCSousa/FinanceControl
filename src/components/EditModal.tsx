import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Transaction } from '../lib/supabase';

interface EditModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Transaction>) => void;
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

export default function EditModal({ transaction, onClose, onSave }: EditModalProps) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Outros');

  useEffect(() => {
    if (transaction) {
      setTitle(transaction.title);
      setAmount(transaction.amount.toString());
      setCategory(transaction.category);
    }
  }, [transaction]);

  if (!transaction) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !amount || parseFloat(amount) <= 0) {
      alert('Por favor, preencha todos os campos corretamente!');
      return;
    }

    onSave(transaction.id, {
      title: title.trim(),
      amount: parseFloat(amount),
      category
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar Transação</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="edit-title">Descrição</label>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-amount">Valor (R$)</label>
            <input
              id="edit-amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-category">Categoria</label>
            <select
              id="edit-category"
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

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-save">
              <Save size={20} />
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
