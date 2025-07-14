import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Download, Smartphone } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { useToast } from '@/hooks/use-toast';

const PWAInstallBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { isInstallable, isInstalled, installApp } = usePWA();
  const { toast } = useToast();

  useEffect(() => {
    // Mostrar banner apenas se for instalável, não estiver instalado e não foi dispensado
    const wasDismissed = localStorage.getItem('pwa-banner-dismissed') === 'true';
    
    if (isInstallable && !isInstalled && !wasDismissed) {
      // Delay menor para aparecer mais rápido
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled]);

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      toast({
        title: "App instalado! 🎉",
        description: "DinDin Mágico foi instalado em seu dispositivo",
      });
      setShowBanner(false);
    } else {
      toast({
        title: "Instalação cancelada",
        description: "Você pode instalar o app a qualquer momento pelo menu",
        variant: "destructive"
      });
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setDismissed(true);
    localStorage.setItem('pwa-banner-dismissed', 'true');
  };

  if (!showBanner || isInstalled) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <Card className="bg-gradient-primary shadow-magical border-primary/20 p-4">
        <div className="flex items-start space-x-3">
          <div className="bg-white/20 rounded-full p-2 flex-shrink-0">
            <Smartphone className="h-5 w-5 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm mb-1">
              Instalar DinDin Mágico
            </h3>
            <p className="text-white/80 text-xs mb-3">
              Instale nosso app para acesso rápido e offline! 📱✨
            </p>
            
            <div className="flex space-x-2">
              <Button
                onClick={handleInstall}
                size="sm"
                variant="secondary"
                className="flex-1 h-8 text-xs"
              >
                <Download className="h-3 w-3 mr-1" />
                Instalar
              </Button>
              <Button
                onClick={handleDismiss}
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/10 h-8 px-2"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PWAInstallBanner;