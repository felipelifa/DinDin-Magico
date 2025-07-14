import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, DollarSign, Calculator, Target } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useDateContext } from "@/contexts/DateContext";
import { supabase } from "@/integrations/supabase/client";

const FinancialSummary = () => {
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [recurringIncome, setRecurringIncome] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [fixedExpenses, setFixedExpenses] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { currentDate, refreshTrigger } = useDateContext();

  useEffect(() => {
    if (user) {
      fetchFinancialData();
    }
  }, [user, currentDate, refreshTrigger]);

  const fetchFinancialData = async () => {
    try {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      const startDate = startOfMonth.toISOString().split('T')[0];
      const endDate = endOfMonth.toISOString().split('T')[0];

      // Buscar gastos variáveis do mês
      const { data: expenses } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user?.id)
        .gte('date', startDate)
        .lte('date', endDate);

      // Buscar entradas do mês
      const { data: incomes } = await supabase
        .from('income_entries')
        .select('*')
        .eq('user_id', user?.id)
        .gte('receive_date', startDate)
        .lte('receive_date', endDate);

      // Buscar renda recorrente ativa
      const { data: recurringIncomes } = await supabase
        .from('recurring_income')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_active', true);

      // Buscar gastos fixos
      const { data: fixedExpensesData } = await supabase
        .from('fixed_expenses')
        .select('*')
        .eq('user_id', user?.id);

      // Calcular totais
      const totalExpenses = expenses?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;
      const totalIncomes = incomes?.reduce((sum, income) => sum + Number(income.amount), 0) || 0;
      const totalRecurringIncome = recurringIncomes?.reduce((sum, income) => sum + Number(income.amount), 0) || 0;
      const totalFixedExpenses = fixedExpensesData?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;

      setMonthlyExpenses(totalExpenses);
      setMonthlyIncome(totalIncomes);
      setRecurringIncome(totalRecurringIncome);
      setFixedExpenses(totalFixedExpenses);
    } catch (error) {
      console.error('Erro ao carregar dados financeiros:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="shadow-soft">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-1/2"></div>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-16 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Cálculos inteligentes
  const totalIncome = monthlyIncome + recurringIncome;
  const totalExpenses = monthlyExpenses + fixedExpenses;
  const monthlyBalance = totalIncome - totalExpenses;
  const variableBudget = totalIncome - fixedExpenses; // Quanto sobra após gastos fixos
  const variableUsagePercentage = variableBudget > 0 ? (monthlyExpenses / variableBudget) * 100 : 100;

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calculator className="h-5 w-5 text-primary" />
          <span>Resumo Financeiro Inteligente</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Fluxo de Caixa Principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-success/10 rounded-lg border border-success/20">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5 text-success" />
              <span className="text-lg font-bold text-success">R$ {totalIncome.toFixed(2)}</span>
            </div>
            <p className="text-sm text-muted-foreground">Total de Entradas</p>
          </div>

          <div className="text-center p-4 bg-destructive/10 rounded-lg border border-destructive/20">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <TrendingDown className="h-5 w-5 text-destructive" />
              <span className="text-lg font-bold text-destructive">R$ {totalExpenses.toFixed(2)}</span>
            </div>
            <p className="text-sm text-muted-foreground">Total de Gastos</p>
          </div>

          <div className={`text-center p-4 rounded-lg border ${
            monthlyBalance >= 0 
              ? 'bg-success/10 border-success/20' 
              : 'bg-destructive/10 border-destructive/20'
          }`}>
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Target className={`h-5 w-5 ${monthlyBalance >= 0 ? 'text-success' : 'text-destructive'}`} />
              <span className={`text-lg font-bold ${
                monthlyBalance >= 0 ? 'text-success' : 'text-destructive'
              }`}>
                R$ {monthlyBalance.toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Saldo Final</p>
            <p className={`text-xs mt-1 ${monthlyBalance >= 0 ? 'text-success' : 'text-destructive'}`}>
              {monthlyBalance >= 0 ? 'Sobrou este mês' : 'Déficit este mês'}
            </p>
          </div>
        </div>

        {/* Análise de Gastos Variáveis */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Orçamento para Gastos Variáveis</h4>
            <span className="text-sm text-muted-foreground">
              {variableUsagePercentage.toFixed(0)}% usado
            </span>
          </div>
          
          <Progress 
            value={Math.min(variableUsagePercentage, 100)} 
            className="h-3"
          />
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Orçamento disponível:</p>
              <p className="font-bold text-primary">R$ {variableBudget.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Ainda pode gastar:</p>
              <p className={`font-bold ${
                (variableBudget - monthlyExpenses) >= 0 ? 'text-success' : 'text-destructive'
              }`}>
                R$ {Math.max(0, variableBudget - monthlyExpenses).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Insights Inteligentes */}
        <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
          <h4 className="font-medium text-primary mb-2">💡 Insights</h4>
          <div className="space-y-2 text-sm">
            {variableUsagePercentage > 90 && (
              <p className="text-warning">⚠️ Você está próximo do limite de gastos variáveis!</p>
            )}
            {monthlyBalance > 0 && (
              <p className="text-success">🎉 Parabéns! Você conseguiu economizar este mês.</p>
            )}
            {fixedExpenses > totalIncome * 0.5 && (
              <p className="text-destructive">📊 Seus gastos fixos representam mais de 50% da renda.</p>
            )}
            {monthlyBalance < 0 && (
              <p className="text-destructive">📉 Este mês você gastou mais do que ganhou.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialSummary;