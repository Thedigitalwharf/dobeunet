import { useState, useEffect, useRef } from 'react';
import { X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { promptPWAInstall, isPWAInstalled } from '@/utils/pwaUtils';
import { useAuth } from '@/contexts/AuthContext';

const DISMISS_DURATION_MS = 30 * 24 * 60 * 60 * 1000;
const AUTO_DISMISS_TIME_MS = 15000;

export const PWAInstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const { user } = useAuth();
  const autoDismissTimerRef = useRef<NodeJS.Timeout>();
  const [hasShownOnLogin, setHasShownOnLogin] = useState(false);

  useEffect(() => {
    const dismissedData = localStorage.getItem('pwa-install-dismissed');
    if (dismissedData) {
      try {
        const { timestamp } = JSON.parse(dismissedData);
        const dismissedTime = new Date(timestamp).getTime();
        const currentTime = new Date().getTime();

        if (currentTime - dismissedTime < DISMISS_DURATION_MS) {
          setIsDismissed(true);
          return;
        } else {
          localStorage.removeItem('pwa-install-dismissed');
        }
      } catch (e) {
        localStorage.removeItem('pwa-install-dismissed');
      }
    }

    if (isPWAInstalled()) {
      return;
    }

    const handleInstallAvailable = () => {
      if (!isDismissed && user && !hasShownOnLogin) {
        setShowPrompt(true);
        setHasShownOnLogin(true);

        autoDismissTimerRef.current = setTimeout(() => {
          handleDismiss();
        }, AUTO_DISMISS_TIME_MS);
      }
    };

    const handleInstalled = () => {
      setShowPrompt(false);
      if (autoDismissTimerRef.current) {
        clearTimeout(autoDismissTimerRef.current);
      }
    };

    window.addEventListener('pwa-install-available', handleInstallAvailable);
    window.addEventListener('pwa-installed', handleInstalled);

    return () => {
      window.removeEventListener('pwa-install-available', handleInstallAvailable);
      window.removeEventListener('pwa-installed', handleInstalled);
      if (autoDismissTimerRef.current) {
        clearTimeout(autoDismissTimerRef.current);
      }
    };
  }, [isDismissed, user, hasShownOnLogin]);

  const handleInstall = async () => {
    if (autoDismissTimerRef.current) {
      clearTimeout(autoDismissTimerRef.current);
    }
    const accepted = await promptPWAInstall();
    if (accepted) {
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    if (autoDismissTimerRef.current) {
      clearTimeout(autoDismissTimerRef.current);
    }
    setShowPrompt(false);
    setIsDismissed(true);
    localStorage.setItem('pwa-install-dismissed', JSON.stringify({
      timestamp: new Date().toISOString(),
    }));
  };

  if (!showPrompt || isDismissed || isPWAInstalled()) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md">
      <Card className="p-4 shadow-lg border-2 border-primary/20 bg-card/95 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <Download className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="font-semibold text-sm">Install App</h3>
            <p className="text-xs text-muted-foreground">
              Install this app for quick access and offline functionality. Auto-dismisses in 15 seconds.
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleInstall}
                className="text-xs"
                aria-label="Install Progressive Web App"
              >
                Install
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDismiss}
                className="text-xs"
                aria-label="Dismiss installation prompt"
              >
                Not now
              </Button>
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleDismiss}
            className="flex-shrink-0 h-6 w-6"
            aria-label="Close installation prompt"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </Card>
    </div>
  );
};
