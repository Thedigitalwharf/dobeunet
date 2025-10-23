import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAnnouncement } from "@/hooks/useAnnouncement";
import { useFocusReturn } from "@/hooks/useFocusReturn";
import { ErrorMessage } from "@/components/ErrorMessage";
import { generateId } from "@/utils/a11y";
import { Eye, EyeOff, LogIn, UserPlus, Mail, Lock, User } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const AuthModal = ({ isOpen, onClose, onAuthSuccess }: {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: SupabaseUser) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    username: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const { announce } = useAnnouncement();
  const firstInputRef = useRef<HTMLInputElement>(null);
  useFocusReturn(isOpen);

  const fieldIds = {
    loginEmail: generateId('login-email'),
    loginPassword: generateId('login-password'),
    signupName: generateId('signup-name'),
    signupUsername: generateId('signup-username'),
    signupEmail: generateId('signup-email'),
    signupPassword: generateId('signup-password'),
  };

  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [isOpen, activeTab]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      if (data.user) {
        onAuthSuccess(data.user);
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        });
        announce("Successfully logged in. Welcome back!", "polite");
        onClose();
      }
    } catch (error: any) {
      const errorMessage = error.message || "Login failed. Please check your credentials.";
      setErrors({ general: errorMessage });
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
      announce(`Login failed: ${errorMessage}`, "assertive");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: formData.fullName,
            username: formData.username
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Account created!",
        description: "Please check your email to confirm your account.",
      });

      announce("Account created successfully! Please check your email to confirm your account.", "polite");

      setActiveTab("login");
    } catch (error: any) {
      const errorMessage = error.message || "Signup failed. Please try again.";
      setErrors({ general: errorMessage });
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive",
      });
      announce(`Signup failed: ${errorMessage}`, "assertive");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md mx-4"
      >
        <Card className="border-0 shadow-2xl bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle id="auth-modal-title" className="text-2xl">
              Access Premium Content
            </CardTitle>
            <p className="text-muted-foreground">
              Join The Digital Wharf community
            </p>
          </CardHeader>

          <CardContent>
            <ErrorMessage error={errors.general} />

            <Tabs value={activeTab} onValueChange={(value) => { setActiveTab(value); setErrors({}); }}>
              <TabsList className="grid w-full grid-cols-2" role="tablist">
                <TabsTrigger value="login" role="tab" aria-selected={activeTab === "login"}>
                  Login
                </TabsTrigger>
                <TabsTrigger value="signup" role="tab" aria-selected={activeTab === "signup"}>
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" role="tabpanel">
                <form onSubmit={handleLogin} className="space-y-4" noValidate>
                  <div>
                    <label htmlFor={fieldIds.loginEmail} className="text-sm font-medium mb-2 block">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      <Input
                        ref={firstInputRef}
                        id={fieldIds.loginEmail}
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-10"
                        required
                        aria-required="true"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor={fieldIds.loginPassword} className="text-sm font-medium mb-2 block">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      <Input
                        id={fieldIds.loginPassword}
                        type={showPassword ? "text" : "password"}
                        placeholder="Your password"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        className="pl-10 pr-10"
                        required
                        aria-required="true"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading} aria-busy={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                    <LogIn className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" role="tabpanel">
                <form onSubmit={handleSignup} className="space-y-4" noValidate>
                  <div>
                    <label htmlFor={fieldIds.signupName} className="text-sm font-medium mb-2 block">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      <Input
                        ref={firstInputRef}
                        id={fieldIds.signupName}
                        placeholder="Your full name"
                        value={formData.fullName}
                        onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                        className="pl-10"
                        required
                        aria-required="true"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor={fieldIds.signupUsername} className="text-sm font-medium mb-2 block">
                      Username
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      <Input
                        id={fieldIds.signupUsername}
                        placeholder="Choose a username"
                        value={formData.username}
                        onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                        className="pl-10"
                        required
                        aria-required="true"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor={fieldIds.signupEmail} className="text-sm font-medium mb-2 block">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      <Input
                        id={fieldIds.signupEmail}
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-10"
                        required
                        aria-required="true"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor={fieldIds.signupPassword} className="text-sm font-medium mb-2 block">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      <Input
                        id={fieldIds.signupPassword}
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        className="pl-10 pr-10"
                        required
                        minLength={6}
                        aria-required="true"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading} aria-busy={isLoading}>
                    {isLoading ? "Creating account..." : "Create Account"}
                    <UserPlus className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 text-center">
              <Button variant="ghost" onClick={onClose}>
                Continue as Guest
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AuthModal;