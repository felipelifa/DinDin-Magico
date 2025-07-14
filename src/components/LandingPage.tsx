import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Mic, Camera, MessageCircle, Target, BarChart3, Users, CheckCircle, Star, Download, Smartphone } from "lucide-react";
import PWAInstallBanner from "@/components/PWAInstallBanner";
import PWAPrompt from "@/components/PWAPrompt";
import { usePWA } from "@/hooks/usePWA";
import { useToast } from "@/hooks/use-toast";

const LandingPage = () => {
  const { isInstallable, installApp } = usePWA();
  const { toast } = useToast();

  const handleInstallApp = async () => {
    const success = await installApp();
    if (success) {
      toast({
        title: "App instalado! 🎉",
        description: "DinDin Mágico foi instalado em seu dispositivo",
      });
    } else {
      toast({
        title: "Instalação cancelada",
        description: "Você pode tentar novamente a qualquer momento",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      {/* Header */}
      <header className="bg-gradient-hero shadow-magical sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between w-full gap-2">

            <div className="flex items-center space-x-2">
              <Sparkles className="text-white h-8 w-8" />
              <h1 className="text-white text-2xl font-bold">DinDinMágico</h1>
            </div>
            <div className="flex items-center space-x-2">
              {isInstallable && (
                <Button 
                  onClick={handleInstallApp}
                  variant="ghost" 
                  size="sm"
                  className="text-white hover:bg-white/10 border border-white/20"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Instalar App
                </Button>
              )}
              <Button asChild variant="accent" className="shadow-card">
                <a href="/dashboard">🚀 Entrar no App</a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-6 bg-gradient-accent text-accent-foreground border-none text-lg px-4 py-2 shadow-card">
            ✨ Controle financeiro inteligente e divertido!
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
            Controle financeiro simples e inteligente
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Gerencie suas receitas, gastos fixos e variáveis, acompanhe suas metas 
            e tenha relatórios detalhados. Tudo em um só lugar! 💰
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="success" className="text-lg px-8 py-3">
              <a href="/dashboard">🚀 Experimente Grátis</a>
            </Button>
            {isInstallable && (
              <Button 
                onClick={handleInstallApp}
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-3 hover:shadow-card border-primary/30 hover:bg-primary/10"
              >
                <Smartphone className="h-5 w-5 mr-2" />
                📱 Instalar App
              </Button>
            )}
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-3 hover:shadow-card">
              <a href="#features">📊 Ver Funcionalidades</a>
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-4">
            ✅ Sem precisar conectar banco • ✅ Sem senhas complicadas • ✅ Resultado em dias
          </p>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="features" className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Como funciona a mágica financeira?
            </h2>
            <p className="text-xl text-muted-foreground">
              IA + Gamificação + Simplicidade = Sucesso garantido!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-card hover:shadow-magical transition-all duration-300 hover:scale-105 border-accent/20">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-primary">
                  <Sparkles className="h-8 w-8 text-accent-foreground" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-primary">1. Entrada Rápida</h3>
                <p className="text-muted-foreground mb-4">
                  Adicione seus gastos e receitas rapidamente com nosso 
                  formulário inteligente. Categorização automática!
                </p>
                <div className="text-2xl">💰 📝 ⚡</div>
              </CardContent>
            </Card>
            
            <Card className="shadow-card hover:shadow-magical transition-all duration-300 hover:scale-105 border-success/20">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-success rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-success">
                  <BarChart3 className="h-8 w-8 text-success-foreground" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-success">2. Controle Inteligente</h3>
                <p className="text-muted-foreground mb-4">
                  Separe gastos fixos e variáveis automaticamente. 
                  Veja seu saldo real e quanto ainda pode gastar!
                </p>
                <div className="text-2xl">📊 🎯 💡</div>
              </CardContent>
            </Card>
            
            <Card className="shadow-card hover:shadow-magical transition-all duration-300 hover:scale-105 border-primary/20">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-magical rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-magical">
                  <Target className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-primary">3. Metas e Relatórios</h3>
                <p className="text-muted-foreground mb-4">
                  Crie metas financeiras e acompanhe seu progresso. 
                  Relatórios detalhados para decisões inteligentes!
                </p>
                <div className="text-2xl">🎯 📈 📊</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Tudo que você precisa (e mais!)</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow-card hover:shadow-primary transition-all duration-300 border-success/20">
              <CardContent className="p-6 text-center">
                <Sparkles className="h-12 w-12 text-success mx-auto mb-3" />
                <h4 className="font-bold mb-2 text-primary">Resumo Inteligente</h4>
                <p className="text-sm text-muted-foreground">
                  Veja saldo real, gastos variáveis e sua categoria campeã automaticamente
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-card hover:shadow-primary transition-all duration-300 border-primary/20">
              <CardContent className="p-6 text-center">
                <BarChart3 className="h-12 w-12 text-primary mx-auto mb-3" />
                <h4 className="font-bold mb-2 text-primary">Relatórios Detalhados</h4>
                <p className="text-sm text-muted-foreground">
                  Gráficos de gastos por categoria, evolução mensal e análises de tendências
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-card hover:shadow-primary transition-all duration-300 border-accent/20">
              <CardContent className="p-6 text-center">
                <Target className="h-12 w-12 text-accent mx-auto mb-3" />
                <h4 className="font-bold mb-2 text-primary">Metas Personais</h4>
                <p className="text-sm text-muted-foreground">
                  Crie suas metas financeiras e acompanhe o progresso visual
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-card hover:shadow-primary transition-all duration-300 border-success/20">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-success mx-auto mb-3" />
                <h4 className="font-bold mb-2 text-primary">Controle Completo</h4>
                <p className="text-sm text-muted-foreground">
                  Gerencie receitas fixas, gastos fixos e variáveis em um só lugar
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Preços */}
      <section className="py-16 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Preço justo que cabe no bolso</h2>
            <p className="text-xl text-muted-foreground">
              Menos que um salgado por semana para transformar sua vida financeira
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <Card className="shadow-magical border-primary/30 hover:shadow-primary transition-all duration-300">
              <CardContent className="p-8 text-center">
                <Badge className="mb-4 bg-gradient-accent text-accent-foreground border-none shadow-card">
                  🔥 Versão Completa
                </Badge>
                <h3 className="text-2xl font-bold mb-2 text-primary">DinDinMágico PRO</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">R$ 9,90</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                
                <div className="space-y-3 mb-8 text-left">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>Controle completo de receitas e gastos</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>Separação automática: fixos x variáveis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>Dashboard inteligente com saldo real</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>Sistema de metas com progresso visual</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>Relatórios detalhados e gráficos</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>Histórico completo de transações</span>
                  </div>
                </div>
                
                <Button asChild variant="success" className="w-full text-lg py-3">
                  <a href="/dashboard">✨ Experimentar Grátis - 7 Dias</a>
                </Button>
                
                <p className="text-xs text-muted-foreground mt-4">
                  Sem cartão • Cancele quando quiser • Seus dados protegidos
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground/5 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">DinDinMágico</span>
          </div>
          <p className="text-muted-foreground mb-4">
            Transformando o controle financeiro brasileiro, um gasto por vez ✨
          </p>
          <p className="text-sm text-muted-foreground">
            © 2024 DinDinMágico. Feito com ❤️ para o brasileiro que quer prosperidade.
          </p>
        </div>
      </footer>
      
      {/* PWA Install Banner */}
      <PWAInstallBanner />
      
      {/* PWA Install Prompt */}
      <PWAPrompt />
    </div>
  );
};

export default LandingPage;