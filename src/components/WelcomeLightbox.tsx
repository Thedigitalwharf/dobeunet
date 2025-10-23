import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, ArrowRight, Calendar, Mail, Sparkles } from 'lucide-react';

const WELCOME_SHOWN_KEY = 'welcome-lightbox-shown';

export function WelcomeLightbox() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem(WELCOME_SHOWN_KEY);

    if (!hasSeenWelcome) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(WELCOME_SHOWN_KEY, JSON.stringify({
      timestamp: new Date().toISOString(),
      shown: true,
    }));
  };

  const handleBooking = () => {
    handleClose();
    setTimeout(() => {
      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  const handleNewsletter = () => {
    handleClose();
    setTimeout(() => {
      document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="welcome-title"
          aria-describedby="welcome-description"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl"
          >
            <Card className="relative overflow-hidden border-2 border-primary/20 shadow-2xl">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full glass-subtle hover:glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-all duration-300"
                aria-label="Close welcome message"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>

              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-cyan-400 to-primary" aria-hidden="true" />

              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-cyan-400/5 pointer-events-none" aria-hidden="true" />

              <div className="relative p-8 md:p-12">
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="inline-flex items-center gap-2 glass-subtle px-6 py-3 rounded-full mb-6"
                  >
                    <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
                    <span className="text-sm font-semibold text-primary">
                      Welcome to Dobeu Tech Solutions
                    </span>
                  </motion.div>

                  <motion.h2
                    id="welcome-title"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
                  >
                    Transform Your Business with
                    <span className="block gradient-text mt-2">
                      Expert IT Solutions
                    </span>
                  </motion.h2>

                  <motion.p
                    id="welcome-description"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto"
                  >
                    15+ years of expertise in supply chain management, technology consulting, and brand development.
                    Budget-friendly solutions with flexible pricing for small and medium businesses.
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
                >
                  <div className="glass-card rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold gradient-text mb-1">15+</div>
                    <div className="text-xs text-muted-foreground">Years Experience</div>
                  </div>
                  <div className="glass-card rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold gradient-text mb-1">100%</div>
                    <div className="text-xs text-muted-foreground">Satisfaction Guarantee</div>
                  </div>
                  <div className="glass-card rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold gradient-text mb-1">Free</div>
                    <div className="text-xs text-muted-foreground">Trial Work Available</div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Button
                    size="lg"
                    onClick={handleBooking}
                    className="flex-1 glass-card bg-primary hover:bg-primary/90 text-primary-foreground border-primary/20 hover:border-primary/40 h-14 text-base group"
                  >
                    <Calendar className="mr-2 h-5 w-5" aria-hidden="true" />
                    Book Free Consultation
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleNewsletter}
                    className="flex-1 glass-card border-border/50 hover:border-primary/30 h-14 text-base"
                  >
                    <Mail className="mr-2 h-5 w-5" aria-hidden="true" />
                    Get Tech Tips Newsletter
                  </Button>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-center text-xs text-muted-foreground mt-6"
                >
                  No commitment required. Pause or cancel anytime.
                </motion.p>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
