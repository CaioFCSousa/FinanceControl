import { useState } from 'react';
import { TrendingUp, Calculator, Trash2 } from 'lucide-react';
import { InvestmentSimulation } from '../lib/supabase';

interface InvestmentSimulatorProps {
  onAddSimulation: (simulation: {
    initial_amount: number;
    interest_rate: number;
    time_period: number;
    final_amount: number;
  }) => void;
  simulations: InvestmentSimulation[];
  onDeleteSimulation: (id: string) => void;
}

export default function InvestmentSimulator({
  onAddSimulation,
  simulations,
  onDeleteSimulation
}: InvestmentSimulatorProps) {
  const [initialAmount, setInitialAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [timePeriod, setTimePeriod] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const calculateInvestment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!initialAmount || !interestRate || !timePeriod) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    const principal = parseFloat(initialAmount);
    const rate = parseFloat(interestRate) / 100 / 12;
    const time = parseInt(timePeriod);

    const finalAmount = principal * Math.pow(1 + rate, time);
    setResult(finalAmount);

    onAddSimulation({
      initial_amount: principal,
      interest_rate: parseFloat(interestRate),
      time_period: time,
      final_amount: finalAmount
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="investment-simulator">
      <h2 className="simulator-title">
        <TrendingUp size={24} />
        Simulador de Investimentos
      </h2>

      <form onSubmit={calculateInvestment} className="simulator-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="initial-amount">Valor Inicial (R$)</label>
            <input
              id="initial-amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="1000.00"
              value={initialAmount}
              onChange={(e) => setInitialAmount(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="interest-rate">Taxa de Juros (% ao ano)</label>
            <input
              id="interest-rate"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="10.00"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="time-period">Período (meses)</label>
            <input
              id="time-period"
              type="number"
              min="1"
              placeholder="12"
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn-calculate">
          <Calculator size={20} />
          Simular Investimento
        </button>
      </form>

      {result !== null && (
        <div className="simulation-result">
          <div className="result-card">
            <p className="result-label">Valor Final Estimado</p>
            <p className="result-value">{formatCurrency(result)}</p>
            <p className="result-profit">
              Lucro: {formatCurrency(result - parseFloat(initialAmount))}
            </p>
          </div>
        </div>
      )}

      {simulations.length > 0 && (
        <div className="simulations-history">
          <h3>Histórico de Simulações</h3>
          <div className="simulations-list">
            {simulations.map((sim) => (
              <div key={sim.id} className="simulation-item">
                <div className="simulation-info">
                  <p className="simulation-main">
                    <strong>{formatCurrency(sim.initial_amount)}</strong>
                    <span className="arrow">→</span>
                    <strong className="final">{formatCurrency(sim.final_amount)}</strong>
                  </p>
                  <p className="simulation-details">
                    {sim.interest_rate}% a.a. • {sim.time_period} meses
                  </p>
                  <p className="simulation-date">{formatDate(sim.created_at)}</p>
                </div>
                <button
                  className="delete-sim-btn"
                  onClick={() => onDeleteSimulation(sim.id)}
                  title="Excluir simulação"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
