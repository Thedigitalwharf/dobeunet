import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAnnouncement } from "@/hooks/useAnnouncement";
import { ErrorMessage, FormErrorSummary } from "@/components/ErrorMessage";
import { generateId } from "@/utils/a11y";
import { Mail, Send, MessageSquare } from "lucide-react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { announce } = useAnnouncement();

  const fieldIds = {
    name: generateId('contact-name'),
    email: generateId('contact-email'),
    subject: generateId('contact-subject'),
    message: generateId('contact-message'),
    nameError: generateId('contact-name-error'),
    emailError: generateId('contact-email-error'),
    messageError: generateId('contact-message-error'),
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Message Sent!",
        description: "Thank you for your message. Our team will respond within 24 hours.",
      });

      announce("Message sent successfully. Our team will respond within 24 hours.", "polite");

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      setErrors({});
    } catch (error: any) {
      console.error('Contact form error:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      announce("Failed to send message. Please try again.", "assertive");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-background">
      <div className="container-max section-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="mobile-heading font-bold mb-6">
            Get in <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Have a question or want to discuss a project? Send us a message and our team will
            respond within 24 hours.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="border-0 shadow-2xl bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Mail className="h-6 w-6 text-primary" />
                  Send a Message
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <FormErrorSummary errors={errors} />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor={fieldIds.name} className="text-sm font-medium mb-2 block">
                        Full Name *
                      </label>
                      <Input
                        id={fieldIds.name}
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, name: e.target.value }));
                          if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                        }}
                        aria-required="true"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? fieldIds.nameError : undefined}
                      />
                      <ErrorMessage id={fieldIds.nameError} error={errors.name} announce={false} />
                    </div>

                    <div>
                      <label htmlFor={fieldIds.email} className="text-sm font-medium mb-2 block">
                        Email Address *
                      </label>
                      <Input
                        id={fieldIds.email}
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, email: e.target.value }));
                          if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                        }}
                        aria-required="true"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? fieldIds.emailError : undefined}
                      />
                      <ErrorMessage id={fieldIds.emailError} error={errors.email} announce={false} />
                    </div>
                  </div>

                  <div>
                    <label htmlFor={fieldIds.subject} className="text-sm font-medium mb-2 block">
                      Subject
                    </label>
                    <Input
                      id={fieldIds.subject}
                      placeholder="Brief description of your inquiry"
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label htmlFor={fieldIds.message} className="text-sm font-medium mb-2 block">
                      Message *
                    </label>
                    <Textarea
                      id={fieldIds.message}
                      placeholder="Tell us about your project, questions, or how we can help..."
                      value={formData.message}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, message: e.target.value }));
                        if (errors.message) setErrors(prev => ({ ...prev, message: '' }));
                      }}
                      rows={6}
                      aria-required="true"
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? fieldIds.messageError : undefined}
                    />
                    <ErrorMessage id={fieldIds.messageError} error={errors.message} announce={false} />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full rounded-full"
                    disabled={isLoading}
                    aria-busy={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Message"}
                    <Send className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Button>

                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                      <MessageSquare className="inline h-3 w-3 mr-1" aria-hidden="true" />
                      Our team will respond to your message within 24 hours.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;