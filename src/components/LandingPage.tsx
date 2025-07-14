import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Mic, Camera, MessageCircle, Target, BarChart3, Users, CheckCircle, Star } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Header */}
      <header className="bg-gradient-primary shadow-magical sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="text-white h-8 w-8" />
              <h1 className="text-white text-2xl font-bold">DinDinMágico</h1>
            </div>
            <Button asChild className="bg-white text-primary hover:bg-white/90">
              <a href="/auth">Começar Grátis</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-6 bg-gradient-fun text-white border-none text-lg px-4 py-2">
            🎉 O controle financeiro que você sempre quis!
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Nunca mais perca o controle do seu dinheiro
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            O DinDinMágico transforma o chato controle financeiro em uma experiência 
            divertida e motivacional. Anote gastos em segundos, receba elogios e 
            realize seus sonhos! ✨
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-success text-lg px-8 py-3 shadow-success">
              <a href="/auth">🚀 Começar Grátis Agora</a>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3">
              📱 Ver Demonstração
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-4">
            ✅ Sem precisar conectar banco • ✅ Sem senhas complicadas • ✅ Resultado em dias
          </p>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Como é que funciona a mágica?</h2>
            <p className="text-xl text-muted-foreground">
              Simples, rápido e divertido - do jeito que deveria ser!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-soft hover:shadow-magical transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-fun rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-3">1. Anote Ultra-Fácil</h3>
                <p className="text-muted-foreground mb-4">
                  Digite "40 mercado", fale por voz ou tire foto da nota. 
                  Categorizamos automaticamente!
                </p>
                <div className="flex justify-center space-x-2">
                  <Badge variant="outline"><Mic className="h-3 w-3 mr-1" />Voz</Badge>
                  <Badge variant="outline"><Camera className="h-3 w-3 mr-1" />Foto</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-soft hover:shadow-magical transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-success rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-3">2. Receba Elogios</h3>
                <p className="text-muted-foreground mb-4">
                  Cada anotação vira motivo de comemoração! Pontos, 
                  memes e frases motivacionais te mantêm animado.
                </p>
                <div className="text-2xl">🎉 💪 ⭐ 🚀</div>
              </CardContent>
            </Card>
            
            <Card className="shadow-soft hover:shadow-magical transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-magical rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-3">3. Realize Sonhos</h3>
                <p className="text-muted-foreground mb-4">
                  Defina metas, acompanhe progresso e comemore 
                  cada conquista rumo aos seus objetivos!
                </p>
                <div className="text-2xl">📱 🏖️ 🏠 ✈️</div>
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
            <Card className="shadow-soft">
              <CardContent className="p-6 text-center">
                <MessageCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h4 className="font-bold mb-2">WhatsApp Integrado</h4>
                <p className="text-sm text-muted-foreground">
                  Anote direto pelo WhatsApp sem baixar app pesado
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-soft">
              <CardContent className="p-6 text-center">
                <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <h4 className="font-bold mb-2">Relatórios Semanais</h4>
                <p className="text-sm text-muted-foreground">
                  Resumos descomplicados com dicas práticas
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-soft">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                <h4 className="font-bold mb-2">Família Conectada</h4>
                <p className="text-sm text-muted-foreground">
                  Organize finanças em conjunto e faça desafios
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-soft">
              <CardContent className="p-6 text-center">
                <Target className="h-12 w-12 text-red-600 mx-auto mb-3" />
                <h4 className="font-bold mb-2">Metas Visuais</h4>
                <p className="text-sm text-muted-foreground">
                  Cofrinhos virtuais para realizar seus sonhos
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
            <Card className="shadow-magical border-primary/20">
              <CardContent className="p-8 text-center">
                <Badge className="mb-4 bg-gradient-fun text-white border-none">
                  Mais Popular
                </Badge>
                <h3 className="text-2xl font-bold mb-2">DinDinMágico Premium</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-primary">R$ 9,90</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                
                <div className="space-y-3 mb-8 text-left">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>Anotação por voz e foto</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>WhatsApp e Telegram integrados</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>Relatórios semanais personalizados</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>Metas ilimitadas</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>Ranking familiar</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>Suporte prioritário</span>
                  </div>
                </div>
                
                <Button asChild className="w-full bg-gradient-success text-lg py-3 shadow-success">
                  <a href="/auth">🚀 Começar Agora - 7 Dias Grátis</a>
                </Button>
                
                <p className="text-xs text-muted-foreground mt-4">
                  Cancele quando quiser • Sem compromisso • Dados sempre seus
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
    </div>
  );
};

export default LandingPage;