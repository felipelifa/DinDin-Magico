import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  CreditCard, 
  ShoppingCart, 
  Home, 
  Car, 
  Coffee,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Wallet,
  Crown,
  Calculator,
  Menu,
  User
} from "lucide-react";

const DemoPage = () => {
  // Dados fictícios para demonstração
  const [demoData] = useState({
    balance: 2850.75,
    income: 4500.00,
    fixedExpenses: 1200.00,
    variableExpenses: 449.25,
    recurringIncome: 0,
    
    recentTransactions: [
      { id: 1, description: "Salário", amount: 4500.00, category: "Receita", date: "2024-01-15", type: "income", emoji: "💰" },
      { id: 2, description: "Aluguel", amount: -800.00, category: "Moradia", date: "2024-01-10", type: "fixed", emoji: "🏠" },
      { id: 3, description: "Supermercado", amount: -125.50, category: "Alimentação", date: "2024-01-08", type: "variable", emoji: "🍽️" },
      { id: 4, description: "Conta de Luz", amount: -150.00, category: "Contas", date: "2024-01-05", type: "fixed", emoji: "💡" },
      { id: 5, description: "Uber", amount: -25.75, category: "Transporte", date: "2024-01-03", type: "variable", emoji: "🚗" },
      { id: 6, description: "Netflix", amount: -29.90, category: "Lazer", date: "2024-01-02", type: "fixed", emoji: "📺" },
      { id: 7, description: "Farmácia", amount: -45.80, category: "Saúde", date: "2024-01-01", type: "variable", emoji: "💊" },
    ],
    
    goals: [
      { id: 1, title: "Reserva de Emergência", emoji: "🚨", target: 10000, current: 3500, progress: 35 },
      { id: 2, title: "Viagem para Europa", emoji: "✈️", target: 8000, current: 2400, progress: 30 },
      { id: 3, title: "Novo Notebook", emoji: "💻", target: 3000, current: 1800, progress: 60 },
    ],
    
    topCategory: "Alimentação"
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Moradia": return <Home className="h-4 w-4" />;
      case "Alimentação": return <ShoppingCart className="h-4 w-4" />;
      case "Transporte": return <Car className="h-4 w-4" />;
      case "Lazer": return <Coffee className="h-4 w-4" />;
      case "Saúde": return <span className="text-sm">💊</span>;
      case "Contas": return <span className="text-sm">💡</span>;
      case "Receita": return <DollarSign className="h-4 w-4" />;
      default: return <CreditCard className="h-4 w-4" />;
    }
  };

  // Cálculos inteligentes
  const totalIncome = demoData.income + demoData.recurringIncome;
  const totalExpenses = demoData.variableExpenses + demoData.fixedExpenses;
  const monthlyBalance = totalIncome - totalExpenses;
  const variableBudget = totalIncome - demoData.fixedExpenses;
  const variableUsagePercentage = variableBudget > 0 ? (demoData.variableExpenses / variableBudget) * 100 : 100;

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Banner de Demo */}
      <div className="bg-warning/20 border-b border-warning/50 sticky top-0 z-50 shadow-soft">
        <div className="w-full px-2 md:px-4 py-3 md:py-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-warning rounded-full animate-pulse shadow-sm"></div>
                <AlertTriangle className="h-4 md:h-5 w-4 md:w-5 text-warning drop-shadow-sm" />
                <span className="font-bold text-warning-foreground text-sm md:text-base">
                  Você está no modo demonstração
                </span>
              </div>
              <Badge variant="outline" className="border-warning/50 text-warning-foreground bg-warning/10 font-semibold text-xs">
                Nenhum dado é salvo permanentemente
              </Badge>
            </div>
            <div className="flex items-center space-x-2 md:space-x-3 w-full lg:w-auto">
              <Button asChild variant="outline" size="sm" className="text-xs md:text-sm flex-1 lg:flex-none">
                <a href="/auth">Fazer Login</a>
              </Button>
              <Button asChild variant="default" size="sm" className="text-xs md:text-sm flex-1 lg:flex-none">
                <a href="/">Voltar ao Site</a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Header igual ao original */}
      <header className="bg-gradient-primary shadow-soft sticky top-0 z-40">
        <div className="w-full px-3 md:px-4 py-2 md:py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 md:space-x-2">
              <Sparkles className="text-white h-6 w-6 md:h-8 md:w-8" />
              <h1 className="text-white text-lg md:text-2xl font-bold">DinDinMágico</h1>
              <Badge className="bg-white/20 text-white border-white/30 text-xs">
                DEMO
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="hidden lg:flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 bg-white/20">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Relatórios
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <Target className="h-4 w-4 mr-2" />
                  Metas
                </Button>
              </div>
              
              <div className="lg:hidden">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 p-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
              
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 p-2">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content igual ao original */}
      <main className="w-full px-2 md:px-4 lg:px-6 py-4 md:py-6 max-w-7xl mx-auto overflow-x-hidden">
        
        {/* Cards de Resumo igual ao original */}
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

          {/* Gastos Variáveis */}
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
                  R$ {demoData.variableExpenses.toFixed(2)}
                </span>
              </div>
              <Progress 
                value={Math.min(variableUsagePercentage, 100)} 
                className="h-2 mb-1"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Usado: {variableUsagePercentage.toFixed(0)}%</span>
                <span className="truncate">Livre: R$ {Math.max(0, variableBudget - demoData.variableExpenses).toFixed(0)}</span>
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
              <div className="flex items-center space-x-2 mb-2">
                <Target className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
                <span className="text-sm md:text-lg font-bold truncate">
                  {demoData.goals[0].emoji} {demoData.goals[0].title}
                </span>
              </div>
              <Progress value={demoData.goals[0].progress} className="h-2 mb-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>R$ {demoData.goals[0].current.toFixed(0)}</span>
                <span>R$ {demoData.goals[0].target.toFixed(0)}</span>
              </div>
              <p className="text-xs text-primary mt-1">
                {demoData.goals[0].progress}% concluído
              </p>
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
                <span className="text-lg md:text-xl font-bold truncate">{demoData.topCategory}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Onde você mais gastou
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 md:space-y-6">
          {/* Resumo Financeiro Inteligente */}
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
                      (variableBudget - demoData.variableExpenses) >= 0 ? 'text-success' : 'text-destructive'
                    }`}>
                      R$ {Math.max(0, variableBudget - demoData.variableExpenses).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Insights Inteligentes */}
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <h4 className="font-medium text-primary mb-2">💡 Insights</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-success">🎉 Parabéns! Você conseguiu economizar este mês.</p>
                  <p className="text-primary">📊 Seus gastos estão bem controlados.</p>
                  <p className="text-accent">🎯 Continue assim para alcançar suas metas!</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transações Recentes */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Histórico de Movimentações</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {demoData.recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{transaction.emoji}</span>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.category} • {new Date(transaction.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className={`font-semibold ${transaction.amount > 0 ? 'text-success' : 'text-destructive'}`}>
                      {transaction.amount > 0 ? '+' : ''}R$ {Math.abs(transaction.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Explicações de como funciona */}
          <div className="space-y-4">
            <Card className="shadow-soft border-primary/30">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-primary rounded-full p-3 flex-shrink-0">
                    <Sparkles className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-primary">
                      💰 Como funciona o controle financeiro?
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      O DinDinMágico separa automaticamente seus gastos em <strong>fixos</strong> (aluguel, contas) 
                      e <strong>variáveis</strong> (compras do dia a dia). Assim você sempre sabe quanto tem 
                      disponível para gastar sem comprometer seu orçamento!
                    </p>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm">
                        <strong>Exemplo:</strong> Você tem R$ 4.500 de receita, R$ 1.200 de gastos fixos e 
                        R$ 449 de gastos variáveis. Sobram <strong>R$ 2.851</strong> livres para você gastar!
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft border-success/30">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-success rounded-full p-3 flex-shrink-0">
                    <Target className="h-6 w-6 text-success-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-success">
                      🎯 Sistema de metas inteligente
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Crie metas financeiras e acompanhe seu progresso visualmente. 
                      O sistema calcula automaticamente quanto você precisa guardar por mês 
                      para alcançar cada objetivo!
                    </p>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm">
                        <strong>Exemplo:</strong> Meta de R$ 10.000 para emergência já tem R$ 3.500 (35% concluída). 
                        Você precisa economizar R$ 325/mês para completar em 2 anos!
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA para versão completa */}
          <Alert className="border-primary/30 bg-primary/5">
            <Sparkles className="h-4 w-4 text-primary" />
            <AlertDescription className="flex items-center justify-between">
              <div>
                <p className="font-medium text-primary">Gostou do que viu?</p>
                <p className="text-sm text-muted-foreground">
                  Acesse a versão completa e comece a organizar suas finanças de verdade!
                </p>
              </div>
              <Button asChild variant="default" className="ml-4">
                <a href="/auth" className="flex items-center space-x-2">
                  <span>Começar Agora</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </main>
    </div>
  );
};

export default DemoPage;