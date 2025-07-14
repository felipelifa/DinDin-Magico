import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Wallet, TrendingUp, Target, Crown, TrendingDown, DollarSign } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useDateContext } from "@/contexts/DateContext";
import { supabase } from "@/integrations/supabase/client";

const SummaryCards = () => {
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [recurringIncome, setRecurringIncome] = useState(0);
  const [fixedExpenses, setFixedExpenses] = useState(0);
  const [mainGoal, setMainGoal] = useState<any>(null);
  const [topCategory, setTopCategory] = useState("Nenhuma");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { currentDate, refreshTrigger } = useDateContext();

  useEffect(() => {
    if (user) {
      fetchSummaryData();
    }
  }, [user, currentDate, refreshTrigger]);

  const fetchSummaryData = async () => {
    try {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      const startDate = startOfMonth.toISOString().split('T')[0];
      const endDate = endOfMonth.toISOString().split('T')[0];

      // Buscar gastos do mês
      const { data: expenses, error: expenseError } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user?.id)
        .gte('date', startDate)
        .lte('date', endDate);

      if (expenseError) throw expenseError;

      // Buscar entradas do mês
      const { data: incomes, error: incomeError } = await supabase
        .from('income_entries')
        .select('*')
        .eq('user_id', user?.id)
        .gte('receive_date', startDate)
        .lte('receive_date', endDate);

      if (incomeError) throw incomeError;

      // Buscar renda recorrente ativa
      const { data: recurringIncomes, error: recurringError } = await supabase
        .from('recurring_income')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_active', true);

      if (recurringError) throw recurringError;

      // Buscar gastos fixos
      const { data: fixedExpensesData, error: fixedError } = await supabase
        .from('fixed_expenses')
        .select('*')
        .eq('user_id', user?.id);

      if (fixedError) throw fixedError;

      // Buscar meta principal
      const { data: goals, error: goalError } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user?.id)
        .order('current_amount', { ascending: false })
        .limit(1);

      if (goalError) throw goalError;

      // Calcular totais
      const totalExpenses = expenses?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;
      const totalIncomes = incomes?.reduce((sum, income) => sum + Number(income.amount), 0) || 0;
      const totalRecurringIncome = recurringIncomes?.reduce((sum, income) => sum + Number(income.amount), 0) || 0;
      const totalFixedExpenses = fixedExpensesData?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;
      
      // Calcular categoria campeã
      const categoryTotals = expenses?.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + Number(expense.amount);
        return acc;
      }, {} as Record<string, number>) || {};

      const topCat = Object.entries(categoryTotals)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || "Nenhuma";

      setMonthlyExpenses(totalExpenses);
      setMonthlyIncome(totalIncomes);
      setRecurringIncome(totalRecurringIncome);
      setFixedExpenses(totalFixedExpenses);
      setMainGoal(goals?.[0] || null);
      setTopCategory(topCat);
    } catch (error: any) {
      console.error('Erro ao carregar dados do resumo:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="shadow-soft">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
                <div className="h-2 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Cálculos inteligentes
  const totalIncome = monthlyIncome + recurringIncome; // Total de entradas do mês
  const totalExpensesPluFixed = monthlyExpenses + fixedExpenses; // Total de gastos (variáveis + fixos)
  const monthlyBalance = totalIncome - totalExpensesPluFixed; // Saldo final do mês
  const variableExpensesBudget = totalIncome - fixedExpenses; // Quanto sobra após gastos fixos
  const variableExpensesPercentage = variableExpensesBudget > 0 ? (monthlyExpenses / variableExpensesBudget) * 100 : 100;
  const goalProgress = mainGoal ? (mainGoal.current_amount / mainGoal.target_amount) * 100 : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
      {/* Saldo do Mês */}
      <Card className="shadow-soft">
        <CardHeader className="pb-2 px-3 md:px-6 pt-3 md:pt-6">
          <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
            Saldo do Mês
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
          <div className="flex items-center space-x-2">
            <Wallet className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
            <span className={`text-lg md:text-2xl font-bold ${
              monthlyBalance >= 0 ? 'text-success' : 'text-destructive'
            } truncate`}>
              R$ {monthlyBalance.toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {monthlyBalance >= 0 ? 'Sobrou este mês' : 'Déficit este mês'}
          </p>
        </CardContent>
      </Card>

      {/* Gastos Variáveis vs Orçamento Livre */}
      <Card className="shadow-soft">
        <CardHeader className="pb-2 px-3 md:px-6 pt-3 md:pt-6">
          <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
            Gastos Variáveis
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
            <span className="text-lg md:text-2xl font-bold truncate">
              R$ {monthlyExpenses.toFixed(2)}
            </span>
          </div>
          <Progress 
            value={Math.min(variableExpensesPercentage, 100)} 
            className="h-2 mb-1"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Usado: {variableExpensesPercentage.toFixed(0)}%</span>
            <span className="truncate">Livre: R$ {Math.max(0, variableExpensesBudget - monthlyExpenses).toFixed(0)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Meta Principal */}
      <Card className="shadow-soft">
        <CardHeader className="pb-2 px-3 md:px-6 pt-3 md:pt-6">
          <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
            Meta Principal
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
          {mainGoal ? (
            <>
              <div className="flex items-center space-x-2 mb-2">
                <Target className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
                <span className="text-sm md:text-lg font-bold truncate">{mainGoal.emoji} {mainGoal.name}</span>
              </div>
              <Progress value={goalProgress} className="h-2 mb-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>R$ {Number(mainGoal.current_amount).toFixed(0)}</span>
                <span>R$ {Number(mainGoal.target_amount).toFixed(0)}</span>
              </div>
              <p className="text-xs text-primary mt-1">
                {goalProgress.toFixed(1)}% concluído
              </p>
            </>
          ) : (
            <div className="text-center py-2">
              <Target className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
              <p className="text-xs md:text-sm text-muted-foreground">
                Nenhuma meta criada
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Categoria Campeã */}
      <Card className="shadow-soft">
        <CardHeader className="pb-2 px-3 md:px-6 pt-3 md:pt-6">
          <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
            Categoria Campeã
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
          <div className="flex items-center space-x-2">
            <Crown className="h-4 w-4 md:h-5 md:w-5 text-warning flex-shrink-0" />
            <span className="text-lg md:text-xl font-bold truncate">{topCategory}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Onde você mais gastou
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;