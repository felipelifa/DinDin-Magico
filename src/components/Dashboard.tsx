import React, { useState } from "react";
import Header from "./Header";
import SummaryCards from "./SummaryCards";
import FinancialSummary from "./FinancialSummary";
import TransactionHistory from "./TransactionHistory";
import QuickTransactionForm from "./QuickTransactionForm";
import { useAuth } from "@/contexts/AuthContext";
import { DateProvider, useDateContext } from "@/contexts/DateContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  emoji: string;
}

const DashboardContent = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budget, setBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const { user } = useAuth();
  const { triggerRefresh } = useDateContext();
  const { toast } = useToast();

  // Carregar gastos do mês atual será feito pelos componentes individuais usando o contexto

  const addExpense = async (newExpense: { amount: number; description: string; category: string }) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive",
      });
      return;
    }

    try {
      const expenseData = {
        user_id: user.id,
        amount: newExpense.amount,
        description: newExpense.description,
        category: newExpense.category,
        emoji: getCategoryEmoji(newExpense.category),
        date: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
        expense_type: 'normal'
      };

      const { data, error } = await supabase
        .from('expenses')
        .insert([expenseData])
        .select();

      if (error) throw error;

      // Atualizar estado local também
      const expense: Expense = {
        id: data[0].id,
        ...newExpense,
        date: expenseData.date,
        emoji: getCategoryEmoji(newExpense.category)
      };
      setExpenses([expense, ...expenses]);

      toast({
        title: "Gasto salvo! 🎉",
        description: `R$ ${newExpense.amount.toFixed(2)} adicionado com sucesso`,
      });

      // Atualizar o contexto para todos os componentes
      triggerRefresh();
    } catch (error: any) {
      console.error('Erro ao salvar gasto:', error);
      toast({
        title: "Erro ao salvar gasto",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getCategoryEmoji = (category: string) => {
    const emojis: Record<string, string> = {
      'Alimentação': '🍽️',
      'Transporte': '🚗',
      'Lazer': '🎬',
      'Saúde': '💊',
      'Casa': '🏠',
      'Compras': '🛍️',
      'Outros': '💰'
    };
    return emojis[category] || emojis['Outros'];
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="w-full px-3 md:px-4 lg:px-6 py-4 md:py-6 max-w-7xl mx-auto">
        {/* Cards de Resumo no Topo */}
        <SummaryCards />

        <div className="space-y-4 md:space-y-6">
          {/* Formulário de movimentações */}
          <QuickTransactionForm />
          
          {/* Resumo Financeiro Inteligente */}
          <FinancialSummary />
          
          {/* Histórico de Movimentações */}
          <TransactionHistory />
        </div>
      </main>
    </div>
  );
};

const Dashboard = () => {
  return (
    <DateProvider>
      <DashboardContent />
    </DateProvider>
  );
};

export default Dashboard;