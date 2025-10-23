import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center pt-20 pb-32">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-background via-accent/20 to-background">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full gradient-bg opacity-30 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-primary/30 to-accent/30 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-cyan-400/20 to-blue-500/20 blur-3xl"
        />
      </div>

      {/* Glass Grid Pattern Overlay */}
      <div className="absolute inset-0 -z-5 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="container-max section-padding w-full relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Main Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-left mb-16"
          >
            {/* Glass Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 glass-subtle px-6 py-3 rounded-full mb-8 group hover:glass transition-all duration-300"
            >
              <Sparkles className="h-4 w-4 text-primary group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-sm font-medium text-foreground">
                Trusted by Fortune 500 Companies
              </span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight mb-8 leading-[0.95]">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="block text-foreground"
              >
                Tech solutions
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="block"
              >
                <span className="text-foreground">for </span>
                <span className="italic font-normal gradient-text">everyone</span>
              </motion.span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="max-w-3xl"
          >
            <p className="text-xl sm:text-2xl md:text-3xl text-muted-foreground mb-6 leading-relaxed font-light">
              Enterprise-grade IT infrastructure, supply chain optimization, and strategic technology consulting.
            </p>

            <p className="text-base sm:text-lg text-muted-foreground/80 mb-10 leading-relaxed">
              Flexible engagement models. Pause or cancel anytime.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 mb-16"
            >
              <Button
                size="lg"
                className="group text-base sm:text-lg px-8 py-6 rounded-full glass-card border-primary/20 hover:border-primary/40 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/25"
                onClick={() =>
                  document
                    .getElementById("booking")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="glass-card text-base sm:text-lg px-8 py-6 rounded-full border-border/50 hover:border-primary/30 hover:bg-accent/50"
                onClick={() =>
                  document
                    .getElementById("pricing")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                See Pricing
              </Button>
            </motion.div>
          </motion.div>

          {/* Three Column Value Props with Glass Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-24"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-20 leading-tight">
              The way tech{" "}
              <span className="italic font-normal gradient-text">should've</span>
              <br />
              been done in the first place
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="glass-card rounded-3xl p-8 text-left group hover:scale-[1.02] transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">🚀</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">Consult</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Schedule a consultation with our expert team to discuss your technology,
                  supply chain, or digital transformation needs.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="glass-card rounded-3xl p-8 text-left group hover:scale-[1.02] transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">⚡</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">Request</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Request comprehensive solutions from supply chain optimization to custom
                  enterprise software development and IT infrastructure.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="glass-card rounded-3xl p-8 text-left group hover:scale-[1.02] transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">✨</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">Receive</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Receive enterprise-grade solutions delivered with precision,
                  expertise, and ongoing support from our dedicated team.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
