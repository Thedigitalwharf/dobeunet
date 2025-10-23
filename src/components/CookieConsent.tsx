import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Cookie, Settings, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

const COOKIE_CONSENT_KEY = 'cookie-consent';
const COOKIE_PREFERENCES_KEY = 'cookie-preferences';
const CONSENT_EXPIRY_DAYS = 365;

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);

    if (!consent) {
      setShowBanner(true);
    } else {
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }
      initializeTracking(savedPreferences ? JSON.parse(savedPreferences) : preferences);
    }
  }, []);

  const initializeTracking = (prefs: CookiePreferences) => {
    if (prefs.analytics) {
      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(arguments);
      }
      gtag('js', new Date());
      gtag('config', 'G-6MX5G49Z0R');
      gtag('consent', 'update', {
        analytics_storage: 'granted',
      });
    }
  };

  const saveConsent = (prefs: CookiePreferences) => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + CONSENT_EXPIRY_DAYS);

    const consentData = {
      timestamp: new Date().toISOString(),
      expiry: expiryDate.toISOString(),
      preferences: prefs,
    };

    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentData));
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs));

    setPreferences(prefs);
    initializeTracking(prefs);
  };

  const handleAcceptAll = () => {
    const allPrefs = { essential: true, analytics: true, marketing: true };
    saveConsent(allPrefs);
    setShowBanner(false);
  };

  const handleRejectNonEssential = () => {
    const essentialOnly = { essential: true, analytics: false, marketing: false };
    saveConsent(essentialOnly);
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
    setShowPreferences(false);
    setShowBanner(false);
  };

  const handleOpenPreferences = () => {
    setShowPreferences(true);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4"
            role="dialog"
            aria-live="polite"
            aria-label="Cookie consent banner"
          >
            <Card className="glass-strong border-border/50 shadow-2xl max-w-7xl mx-auto">
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center">
                      <Cookie className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                  </div>

                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      Cookie Consent
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      We use cookies to enhance your browsing experience, analyze site traffic, and provide personalized content.
                      By clicking "Accept All", you consent to our use of cookies. You can customize your preferences or reject non-essential cookies.
                      {' '}
                      <Link to="/privacy" className="text-primary hover:underline" aria-label="Read our Privacy Policy">
                        Learn more in our Privacy Policy
                      </Link>
                      .
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleOpenPreferences}
                      className="glass-card border-border/50 hover:border-primary/30 min-w-[140px]"
                      aria-label="Customize cookie preferences"
                    >
                      <Settings className="mr-2 h-4 w-4" aria-hidden="true" />
                      Customize
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRejectNonEssential}
                      className="glass-card border-border/50 hover:border-primary/30 min-w-[140px]"
                      aria-label="Reject non-essential cookies"
                    >
                      Reject All
                    </Button>

                    <Button
                      size="sm"
                      onClick={handleAcceptAll}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[140px]"
                      aria-label="Accept all cookies"
                    >
                      Accept All
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
        <DialogContent className="sm:max-w-[500px]" aria-describedby="cookie-preferences-description">
          <DialogHeader>
            <DialogTitle>Cookie Preferences</DialogTitle>
            <DialogDescription id="cookie-preferences-description">
              Customize which types of cookies you want to allow. Essential cookies cannot be disabled as they are required for the website to function.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4 p-4 rounded-lg glass-subtle">
                <div className="flex-1 space-y-1">
                  <label htmlFor="essential-cookies" className="text-sm font-medium text-foreground">
                    Essential Cookies
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Required for the website to function properly. These cannot be disabled.
                  </p>
                </div>
                <Switch
                  id="essential-cookies"
                  checked={true}
                  disabled
                  aria-label="Essential cookies (always enabled)"
                />
              </div>

              <div className="flex items-start justify-between gap-4 p-4 rounded-lg glass-subtle">
                <div className="flex-1 space-y-1">
                  <label htmlFor="analytics-cookies" className="text-sm font-medium text-foreground">
                    Analytics Cookies
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Help us understand how visitors interact with our website by collecting and reporting information anonymously.
                  </p>
                </div>
                <Switch
                  id="analytics-cookies"
                  checked={preferences.analytics}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, analytics: checked })
                  }
                  aria-label="Toggle analytics cookies"
                />
              </div>

              <div className="flex items-start justify-between gap-4 p-4 rounded-lg glass-subtle">
                <div className="flex-1 space-y-1">
                  <label htmlFor="marketing-cookies" className="text-sm font-medium text-foreground">
                    Marketing Cookies
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Used to track visitors across websites to display relevant advertisements and marketing campaigns.
                  </p>
                </div>
                <Switch
                  id="marketing-cookies"
                  checked={preferences.marketing}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, marketing: checked })
                  }
                  aria-label="Toggle marketing cookies"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowPreferences(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSavePreferences}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                Save Preferences
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

declare global {
  interface Window {
    dataLayer: any[];
  }
}
