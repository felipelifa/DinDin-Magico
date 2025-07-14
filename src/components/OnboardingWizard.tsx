import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Target, Heart, Home, Plane, GraduationCap, Car } from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: () => void;
}

const dreamOptions = [
  { id: 'house', label: 'Comprar um apartamento', icon: Home, emoji: '🏠', steps: 90 },
  { id: 'travel', label: 'Viajar para Paris', icon: Plane, emoji: '✈️', steps: 75 },
  { id: 'education', label: 'Fazer uma pós-graduação', icon: GraduationCap, emoji: '🎓', steps: 60 },
  { id: 'car', label: 'Comprar um carro', icon: Car, emoji: '🚗', steps: 45 },
  { id: 'family', label: 'Poupar para minha família', icon: Heart, emoji: '💖', steps: 80 },
  { id: 'freedom', label: 'Ter liberdade financeira', icon: Target, emoji: '🎯', steps: 100 },
];

const OnboardingWizard = ({ onComplete }: OnboardingWizardProps) => {
  const [step, setStep] = useState(1);
  const [selectedDream, setSelectedDream] = useState<typeof dreamOptions[0] | null>(null);
  const [dreamDetails, setDreamDetails] = useState({
    targetAmount: '',
    deadline: '',
    monthlyContribution: ''
  });
  const [showCelebration, setShowCelebration] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();

  const handleDreamSelection = (dream: typeof dreamOptions[0]) => {
    setSelectedDream(dream);
    setStep(2);
  };

  const handleComplete = async () => {
    if (!user || !selectedDream) return;
    try {
      await supabase.from('goals').insert({
        user_id: user.id,
        name: selectedDream.label,
        target_amount: parseFloat(dreamDetails.targetAmount) || 10000,
        current_amount: 0,
        deadline: dreamDetails.deadline || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        emoji: selectedDream.emoji
      });
      await supabase.from('profiles').update({
        onboarding_completed: true,
        main_dream: selectedDream.id,
        dream_steps: selectedDream.steps
      }).eq('id', user.id);

      setShowCelebration(true);

      setTimeout(() => {
        onComplete();
      }, 3000);

    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar suas informações",
        variant: "destructive"
      });
    }
  };

  if (showCelebration) {
    return (
      <div className="fixed inset-0 bg-gradient-magical flex items-center justify-center z-50 py-16">
        <div className="text-center text-white animate-scale-in">
          <div className="text-8xl mb-4 animate-bounce">✨</div>
          <h1 className="text-4xl font-bold mb-4">
            Incrível! Você está a {selectedDream?.steps} passos do seu sonho!
          </h1>
          <p className="text-xl mb-6">
            {selectedDream?.emoji} {selectedDream?.label} ✨
          </p>
          <p className="text-lg opacity-90">
            Vamos juntos transformar seus sonhos em realidade!
          </p>
          <div className="mt-8">
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-6 py-3">
              <Sparkles className="h-5 w-5" />
              <span>Você ganhou o selo: "Primeiro Passo" 🥇</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progress = (step / 3) * 100;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-12">
      <Card className="w-full max-w-lg md:max-w-2xl mx-auto rounded-2xl shadow-magical border-0 animate-fade-in">
        <CardHeader className="text-center px-4 pt-8 pb-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl">Bem-vindo ao DinDinMágico! ✨</CardTitle>
          </div>
          <Progress value={progress} className="w-full max-w-sm mx-auto" />
          <p className="text-sm text-muted-foreground mt-2">Passo {step} de 3</p>
        </CardHeader>

        <CardContent className="space-y-6 px-4 pb-8">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Qual é o seu maior sonho? 🌟</h3>
                <p className="text-muted-foreground">
                  Escolha seu objetivo principal e vamos criar um plano mágico para realizá-lo!
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {dreamOptions.map((dream) => {
                  const Icon = dream.icon;
                  return (
                    <Button
                      key={dream.id}
                      type="button"
                      variant="outline"
                      className="w-full h-auto min-h-[68px] p-3 text-left hover:border-primary hover:bg-primary/5 rounded-xl"
                      onClick={() => handleDreamSelection(dream)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <span className="text-2xl">{dream.emoji}</span>
                        <div className="flex flex-col">
                          <span className="font-medium leading-tight">{dream.label}</span>
                          <span className="text-xs text-muted-foreground leading-tight">
                            ~{dream.steps} passos para conquistar
                          </span>
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && selectedDream && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-4xl mb-2">{selectedDream.emoji}</div>
                <h3 className="text-xl font-semibold mb-2">Vamos detalhar seu sonho!</h3>
                <p className="text-muted-foreground">
                  Quanto mais específico, mais mágico será o resultado ✨
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="targetAmount">Quanto você precisa? (R$)</Label>
                  <Input
                    id="targetAmount"
                    type="number"
                    placeholder="50000"
                    value={dreamDetails.targetAmount}
                    onChange={(e) =>
                      setDreamDetails((prev) => ({ ...prev, targetAmount: e.target.value }))
                    }
                    className="mt-1 w-full max-w-xs"
                  />
                </div>
                <div>
                  <Label htmlFor="deadline">Quando você quer conquistar?</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={dreamDetails.deadline}
                    onChange={(e) =>
                      setDreamDetails((prev) => ({ ...prev, deadline: e.target.value }))
                    }
                    className="mt-1 w-full max-w-xs"
                  />
                </div>
                <div>
                  <Label htmlFor="monthlyContribution">Quanto pode guardar por mês? (R$)</Label>
                  <Input
                    id="monthlyContribution"
                    type="number"
                    placeholder="500"
                    value={dreamDetails.monthlyContribution}
                    onChange={(e) =>
                      setDreamDetails((prev) => ({
                        ...prev,
                        monthlyContribution: e.target.value,
                      }))
                    }
                    className="mt-1 w-full max-w-xs"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 min-w-[120px]"
                >
                  Voltar
                </Button>
                <Button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 min-w-[120px] bg-gradient-magical text-white"
                >
                  Continuar ✨
                </Button>
              </div>
            </div>
          )}

          {step === 3 && selectedDream && (
            <div className="space-y-6 text-center">
              <div>
                <div className="text-4xl mb-4">{selectedDream.emoji}</div>
                <h3 className="text-xl font-semibold mb-2">Perfeito! Seu plano mágico está pronto! 🎯</h3>
                <p className="text-muted-foreground mb-6">
                  Você está prestes a começar uma jornada incrível rumo à realização dos seus sonhos!
                </p>
              </div>
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 space-y-3 max-w-md mx-auto">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Seu objetivo:</span>
                  <span>{selectedDream.label}</span>
                </div>
                {dreamDetails.targetAmount && (
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Meta:</span>
                    <span>R$ {parseFloat(dreamDetails.targetAmount).toLocaleString('pt-BR')}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-medium">Passos estimados:</span>
                  <span>{selectedDream.steps} conquistas</span>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  🎁 <strong>Bônus de boas-vindas:</strong> Você terá 7 dias de acesso total para explorar
                  todos os recursos mágicos do DinDinMágico!
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1 min-w-[120px]"
                >
                  Voltar
                </Button>
                <Button
                  type="button"
                  onClick={handleComplete}
                  className="flex-1 min-w-[120px] bg-gradient-magical text-white"
                >
                  Começar minha jornada! ✨
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingWizard;
