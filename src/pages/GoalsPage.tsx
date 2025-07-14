import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, Target, Calendar, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import GoalManager from "@/components/GoalManager";

interface Goal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  emoji: string;
  created_at: string;
}

const GoalsPage = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGoalManager, setShowGoalManager] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar metas:', error);
      toast({
        title: "Erro ao carregar metas",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoalAdded = () => {
    fetchGoals();
    setShowGoalManager(false);
    toast({
      title: "Meta criada! 🎯",
      description: "Sua nova meta foi adicionada com sucesso",
    });
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-64 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Metas e Sonhos</h1>
            <p className="text-muted-foreground">
              Acompanhe o progresso dos seus objetivos financeiros
            </p>
          </div>
          
          <Button
            onClick={() => setShowGoalManager(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nova Meta</span>
          </Button>
        </div>

        {goals.length === 0 ? (
          <Card className="shadow-magical">
            <CardContent className="text-center py-12">
              <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Nenhuma meta criada</h3>
              <p className="text-muted-foreground mb-6">
                Comece definindo seus objetivos financeiros para manter o foco
              </p>
              <Button
                onClick={() => setShowGoalManager(true)}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Criar Primeira Meta</span>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => {
              const progress = calculateProgress(Number(goal.current_amount), Number(goal.target_amount));
              const remaining = Number(goal.target_amount) - Number(goal.current_amount);
              
              return (
                <Card key={goal.id} className="shadow-magical hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <span className="text-2xl">{goal.emoji}</span>
                      <span className="text-lg">{goal.name}</span>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Progresso</span>
                        <span className="text-sm font-medium">{progress.toFixed(1)}%</span>
                      </div>
                      <Progress value={progress} className="h-3" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Atual:</span>
                        <span className="font-medium text-success">
                          {formatCurrency(Number(goal.current_amount))}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Meta:</span>
                        <span className="font-medium">
                          {formatCurrency(Number(goal.target_amount))}
                        </span>
                      </div>
                      
                      {remaining > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Faltam:</span>
                          <span className="font-medium text-primary">
                            {formatCurrency(remaining)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Prazo: {goal.deadline}</span>
                    </div>
                    
                    {progress >= 100 && (
                      <div className="text-center py-2">
                        <div className="inline-flex items-center space-x-2 text-success bg-success/10 px-3 py-1 rounded-full">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm font-medium">Meta Alcançada! 🎉</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {showGoalManager && (
          <GoalManager />
        )}
      </main>
    </div>
  );
};

export default GoalsPage;