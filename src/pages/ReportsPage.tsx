import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, PieChart, TrendingUp, Calendar } from "lucide-react";
import Header from "@/components/Header";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];

const ReportsPage = () => {
  const { user } = useAuth();

  // Query para gastos por categoria
  const { data: expensesByCategory } = useQuery({
    queryKey: ['expenses-by-category', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('expenses')
        .select('category, amount')
        .eq('user_id', user.id);

      if (error) throw error;

      // Agrupar por categoria
      const grouped = data.reduce((acc: any, expense: any) => {
        if (!acc[expense.category]) {
          acc[expense.category] = 0;
        }
        acc[expense.category] += Number(expense.amount);
        return acc;
      }, {});

      return Object.entries(grouped).map(([name, value]) => ({
        name,
        value: Number(value)
      }));
    },
    enabled: !!user?.id
  });

  // Query para entradas por fonte
  const { data: incomesBySource } = useQuery({
    queryKey: ['incomes-by-source', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('income_entries')
        .select('source_type, amount')
        .eq('user_id', user.id);

      if (error) throw error;

      // Agrupar por fonte
      const grouped = data.reduce((acc: any, income: any) => {
        const sourceType = income.source_type || 'other';
        if (!acc[sourceType]) {
          acc[sourceType] = 0;
        }
        acc[sourceType] += Number(income.amount);
        return acc;
      }, {});

      return Object.entries(grouped).map(([key, value]) => ({
        name: key === 'salary' ? 'Salário' :
              key === 'freelance' ? 'Freelance' :
              key === 'sales' ? 'Vendas' :
              key === 'investment' ? 'Investimentos' :
              key === 'gift' ? 'Presente' :
              key === 'cashback' ? 'Cashback' :
              'Outros',
        value: Number(value)
      }));
    },
    enabled: !!user?.id
  });

  // Query para evolução mensal
  const { data: monthlyEvolution } = useQuery({
    queryKey: ['monthly-evolution', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const months = [];
      for (let i = 5; i >= 0; i--) {
        const date = subMonths(new Date(), i);
        const start = startOfMonth(date);
        const end = endOfMonth(date);
        
        // Buscar gastos do mês
        const { data: expenses } = await supabase
          .from('expenses')
          .select('amount')
          .eq('user_id', user.id)
          .gte('date', start.toISOString().split('T')[0])
          .lte('date', end.toISOString().split('T')[0]);

        // Buscar entradas do mês
        const { data: incomes } = await supabase
          .from('income_entries')
          .select('amount')
          .eq('user_id', user.id)
          .gte('receive_date', start.toISOString().split('T')[0])
          .lte('receive_date', end.toISOString().split('T')[0]);

        const totalExpenses = expenses?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;
        const totalIncome = incomes?.reduce((sum, income) => sum + Number(income.amount), 0) || 0;

        months.push({
          month: format(date, 'MMM', { locale: ptBR }),
          expenses: totalExpenses,
          income: totalIncome
        });
      }
      
      return months;
    },
    enabled: !!user?.id
  });

  // Calcular totais
  const totalExpenses = expensesByCategory?.reduce((sum, category) => sum + category.value, 0) || 0;
  const totalIncomes = incomesBySource?.reduce((sum, source) => sum + source.value, 0) || 0;
  const balance = totalIncomes - totalExpenses;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="w-full px-3 md:px-4 lg:px-6 py-4 md:py-6 max-w-7xl mx-auto">
        <div className="space-y-4 md:space-y-6">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Relatórios Financeiros</h1>
            <p className="text-sm md:text-base text-muted-foreground">Análise completa das suas finanças</p>
          </div>

          {/* Resumo Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <Card className="shadow-soft">
              <CardHeader className="pb-2 px-3 md:px-6 pt-3 md:pt-6">
                <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                  Total de Gastos
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-destructive flex-shrink-0" />
                  <span className="text-lg md:text-2xl font-bold text-destructive truncate">
                    R$ {totalExpenses.toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader className="pb-2 px-3 md:px-6 pt-3 md:pt-6">
                <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                  Total de Entradas
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-success flex-shrink-0" />
                  <span className="text-lg md:text-2xl font-bold text-success truncate">
                    R$ {totalIncomes.toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader className="pb-2 px-3 md:px-6 pt-3 md:pt-6">
                <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                  Saldo Total
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
                  <span className={`text-lg md:text-2xl font-bold truncate ${
                    balance >= 0 ? 'text-success' : 'text-destructive'
                  }`}>
                    R$ {balance.toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader className="pb-2 px-3 md:px-6 pt-3 md:pt-6">
                <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                  Última Atualização
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 md:h-5 md:w-5 text-accent flex-shrink-0" />
                  <span className="text-sm md:text-lg font-bold">
                    {format(new Date(), 'dd/MM/yyyy', { locale: ptBR })}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Gastos por Categoria */}
            <Card className="shadow-soft">
              <CardHeader className="px-3 md:px-6 pt-3 md:pt-6 pb-3 md:pb-6">
                <CardTitle className="flex items-center space-x-2 text-lg md:text-xl">
                  <PieChart className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  <span>Gastos por Categoria</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPieChart>
                    <Pie
                      data={expensesByCategory || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {(expensesByCategory || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Entradas por Fonte */}
            <Card className="shadow-soft">
              <CardHeader className="px-3 md:px-6 pt-3 md:pt-6 pb-3 md:pb-6">
                <CardTitle className="flex items-center space-x-2 text-lg md:text-xl">
                  <BarChart3 className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  <span>Entradas por Fonte</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={incomesBySource || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      fontSize={12}
                      interval={0}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis fontSize={12} />
                    <Tooltip 
                      formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, 'Valor']}
                    />
                    <Bar dataKey="value" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Evolução Mensal */}
          <Card className="shadow-soft">
            <CardHeader className="px-3 md:px-6 pt-3 md:pt-6 pb-3 md:pb-6">
              <CardTitle className="flex items-center space-x-2 text-lg md:text-xl">
                <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                <span className="text-sm md:text-lg">Evolução Mensal dos Últimos 6 Meses</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyEvolution || []}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="month" 
                    fontSize={12}
                  />
                  <YAxis fontSize={12} />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip 
                    formatter={(value, name) => [
                      `R$ ${Number(value).toFixed(2)}`, 
                      name === 'income' ? 'Entradas' : 'Gastos'
                    ]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="income" 
                    stackId="1" 
                    stroke="#10b981" 
                    fillOpacity={1} 
                    fill="url(#colorIncome)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="expenses" 
                    stackId="2" 
                    stroke="#ef4444" 
                    fillOpacity={1} 
                    fill="url(#colorExpense)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ReportsPage;