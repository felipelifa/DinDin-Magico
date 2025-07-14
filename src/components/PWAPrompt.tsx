import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { Smartphone, Download, X } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { useToast } from '@/hooks/use-toast';

const PWAPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const { isInstallable, isInstalled, installApp } = usePWA();
  const { toast } = useToast();

  useEffect(() => {
    // Verificar se deve mostrar o prompt
    const hasSeenPrompt = localStorage.getItem('pwa-prompt-seen');
    const isFirstVisit = !localStorage.getItem('user-visited');
    
    if (isInstallable && !isInstalled && !hasSeenPrompt) {
      // Mostrar prompt após alguns segundos na primeira visita
      const timer = setTimeout(() => {
        setShowPrompt(true);
        localStorage.setItem('pwa-prompt-seen', 'true');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
    
    if (isFirstVisit) {
      localStorage.setItem('user-visited', 'true');
    }
  }, [isInstallable, isInstalled]);

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      toast({
        title: "🎉 App instalado com sucesso!",
        description: "Agora você pode usar o DinDin Mágico como um app nativo!",
      });
      setShowPrompt(false);
    } else {
      toast({
        title: "Instalação não concluída",
        description: "Tente novamente ou use o botão de instalação no menu",
        variant: "destructive"
      });
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (!showPrompt || isInstalled) return null;

  return (
    <AlertDialog open={showPrompt}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gradient-primary rounded-full p-3">
              <Smartphone className="h-6 w-6 text-white" />
            </div>
            <div>
              <AlertDialogTitle className="text-xl">
                Instalar DinDin Mágico
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-muted-foreground">
                Transforme em um app real no seu dispositivo
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-primary">
              🚀 Vantagens do App Instalado:
            </h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>✅ Acesso offline aos seus dados</li>
              <li>✅ Funciona como app nativo</li>
              <li>✅ Notificações de lembretes</li>
              <li>✅ Carregamento mais rápido</li>
              <li>✅ Sem barra do navegador</li>
            </ul>
          </div>
        </div>

        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            onClick={handleInstall}
            className="w-full bg-gradient-primary hover:bg-gradient-primary/90 text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Instalar Agora
          </Button>
          <AlertDialogCancel onClick={handleDismiss} className="w-full">
            Agora não
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PWAPrompt;