/*
  # Sistema de Controle Financeiro Pessoal - Database Schema

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key) - Identificador único da transação
      - `title` (text) - Título/descrição da transação
      - `amount` (decimal) - Valor da transação
      - `type` (text) - Tipo: 'income' (entrada) ou 'expense' (saída)
      - `category` (text) - Categoria da transação
      - `status` (text) - Status: 'pending' ou 'completed'
      - `transaction_date` (date) - Data da transação
      - `created_at` (timestamptz) - Data de criação do registro
      - `user_id` (uuid) - ID do usuário (para futura autenticação)
    
    - `investment_simulations`
      - `id` (uuid, primary key) - Identificador único da simulação
      - `initial_amount` (decimal) - Valor inicial do investimento
      - `interest_rate` (decimal) - Taxa de juros (% ao ano)
      - `time_period` (integer) - Período em meses
      - `final_amount` (decimal) - Valor final calculado
      - `created_at` (timestamptz) - Data de criação
      - `user_id` (uuid) - ID do usuário (para futura autenticação)

  2. Security
    - Enable RLS on both tables
    - Add policies for public access (authenticated users can manage their data)
    
  3. Notes
    - Default values set for better data integrity
    - Indexes added for performance on frequently queried columns
*/

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  amount decimal(10,2) NOT NULL,
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  category text NOT NULL DEFAULT 'Outros',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  transaction_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  user_id uuid
);

-- Create investment_simulations table
CREATE TABLE IF NOT EXISTS investment_simulations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  initial_amount decimal(12,2) NOT NULL,
  interest_rate decimal(5,2) NOT NULL,
  time_period integer NOT NULL,
  final_amount decimal(12,2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_simulations_created ON investment_simulations(created_at DESC);

-- Enable Row Level Security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_simulations ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (permite acesso público para demonstração)
CREATE POLICY "Enable read access for all users"
  ON transactions
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable insert access for all users"
  ON transactions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Enable update access for all users"
  ON transactions
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete access for all users"
  ON transactions
  FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Enable read access for all users on simulations"
  ON investment_simulations
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable insert access for all users on simulations"
  ON investment_simulations
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Enable delete access for all users on simulations"
  ON investment_simulations
  FOR DELETE
  TO public
  USING (true);