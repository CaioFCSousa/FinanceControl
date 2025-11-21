import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
console.log("Supabase URL Check:", supabaseUrl);
export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  status: 'pending' | 'completed';
  transaction_date: string;
  created_at: string;
}

export interface InvestmentSimulation {
  id: string;
  initial_amount: number;
  interest_rate: number;
  time_period: number;
  final_amount: number;
  created_at: string;
}
