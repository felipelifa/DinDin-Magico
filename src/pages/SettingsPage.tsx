import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings, Moon, Sun, Bell, Palette, Shield, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";

const SettingsPage = () => {
  const { signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado! 👋",
        description: "Você foi desconectado com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao fazer logout",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary">Configurações</h1>
          <p className="text-muted-foreground">
            Personalize sua experiência no Dindin Mágico
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Aparência */}
          <Card className="shadow-magical">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5 text-primary" />
                <span>Aparência</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Modo Escuro</Label>
                  <p className="text-sm text-muted-foreground">
                    Ativar tema escuro para melhor visualização noturna
                  </p>
                </div>
                <Switch id="dark-mode" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="animations">Animações</Label>
                  <p className="text-sm text-muted-foreground">
                    Habilitar animações e transições suaves
                  </p>
                </div>
                <Switch id="animations" defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Notificações */}
          <Card className="shadow-magical">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-primary" />
                <span>Notificações</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="expense-reminders">Lembretes de Gastos</Label>
                  <p className="text-sm text-muted-foreground">
                    Receber notificações sobre gastos fixos vencendo
                  </p>
                </div>
                <Switch id="expense-reminders" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="goal-updates">Atualizações de Metas</Label>
                  <p className="text-sm text-muted-foreground">
                    Notificações sobre progresso das suas metas
                  </p>
                </div>
                <Switch id="goal-updates" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="monthly-reports">Relatórios Mensais</Label>
                  <p className="text-sm text-muted-foreground">
                    Resumo mensal dos seus gastos e receitas
                  </p>
                </div>
                <Switch id="monthly-reports" />
              </div>
            </CardContent>
          </Card>

          {/* Privacidade e Segurança */}
          <Card className="shadow-magical">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Privacidade e Segurança</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="biometric-auth">Autenticação Biométrica</Label>
                  <p className="text-sm text-muted-foreground">
                    Usar impressão digital ou Face ID para acessar o app
                  </p>
                </div>
                <Switch id="biometric-auth" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="data-backup">Backup Automático</Label>
                  <p className="text-sm text-muted-foreground">
                    Fazer backup dos seus dados automaticamente
                  </p>
                </div>
                <Switch id="data-backup" defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Conta */}
          <Card className="shadow-magical">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-primary" />
                <span>Conta</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Deseja sair da sua conta?
                </p>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="flex items-center space-x-2 text-red-600 border-red-200 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Fazer Logout</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Integração com outros serviços */}
          <Card className="shadow-magical lg:col-span-2">
            <CardHeader>
              <CardTitle>Integrações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Integrações com bancos e cartões</p>
                <p className="text-sm mt-2">Em desenvolvimento</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;