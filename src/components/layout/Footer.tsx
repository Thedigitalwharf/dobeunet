import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import {
  Linkedin,
  Github,
  Mail,
  MapPin,
  Phone,
  ExternalLink,
  ArrowUp
} from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { href: "#about", label: "About" },
    { href: "#expertise", label: "Services" },
    { href: "#pricing", label: "Pricing" },
    { href: "#newsletter", label: "Newsletter" },
    { href: "#booking", label: "Book Consultation" }
  ];

  const legalLinks = [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/tos", label: "Terms of Service" }
  ];

  const consultationTypes = [
    { href: "#booking", label: "Custom Software Development" },
    { href: "#booking", label: "IT Infrastructure & Support" },
    { href: "#booking", label: "Workflow Automation & AI" },
    { href: "#booking", label: "Free Consultation" }
  ];

  const socialLinks = [
    {
      href: "https://linkedin.com/company/dobeu-tech-solutions",
      icon: Linkedin,
      label: "LinkedIn",
      description: "Connect with our team"
    },
    {
      href: "https://github.com/dobeu-tech",
      icon: Github,
      label: "GitHub",
      description: "Open source projects"
    },
    {
      href: "https://behance.net/dobeudesigns",
      icon: ExternalLink,
      label: "Behance",
      description: "Design showcase"
    },
    {
      href: "https://digitalwharf.dobeu.net/subscribe",
      icon: ExternalLink,
      label: "The Digital Wharf",
      description: "Industry insights"
    }
  ];

  return (
    <footer className="bg-muted/30 border-t border-border" role="contentinfo">
      <div className="container-max section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="flex items-center space-x-3 mb-6">
              <img
                src="/images/logos/2025-10-11- Dobeu Logo Icon transpbck.svg"
                alt="Dobeu Tech Solutions"
                className="h-12 w-12"
              />
              <div>
                <h3 className="font-bold text-lg gradient-text">Dobeu Tech Solutions</h3>
                <p className="text-sm text-muted-foreground">Enterprise IT Solutions & Strategic Consulting</p>
              </div>
            </div>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              Dobeu Tech Solutions delivers comprehensive IT infrastructure, supply chain optimization,
              and technology consulting services. We partner with businesses to drive digital transformation
              with flexible engagement models and a 100% satisfaction guarantee.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                <span className="text-muted-foreground">Neptune, NJ 07753</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-primary" aria-hidden="true" />
                <a href="tel:+12153705332" className="text-muted-foreground hover:text-primary transition-colors">
                  (215) 370-5332
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
                <a href="mailto:contact@dobeutech.com" className="text-muted-foreground hover:text-primary transition-colors">
                  contact@dobeutech.com
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold mb-6">Services</h4>
            <ul className="space-y-3">
              {consultationTypes.map((service, index) => (
                <li key={index}>
                  <a
                    href={service.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {service.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <Separator className="my-8" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="py-6"
        >
          <h4 className="font-semibold mb-6 text-center">Connect With Us</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {socialLinks.map((social, index) => {
              const IconComponent = social.icon;
              return (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 transition-all duration-300"
                  aria-label={`Visit ${social.label} profile`}
                >
                  <IconComponent className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" aria-hidden="true" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm group-hover:text-primary transition-colors">
                      {social.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {social.description}
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
                </a>
              );
            })}
          </div>
        </motion.div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center py-6 gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Dobeu Tech Solutions. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Powered by cutting-edge technology and innovative solutions
            </p>
            <div className="flex gap-4 mt-2 justify-center md:justify-start">
              {legalLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={scrollToTop}
              className="group"
              aria-label="Scroll back to top of page"
            >
              Back to Top
              <ArrowUp className="ml-2 h-4 w-4 group-hover:-translate-y-1 transition-transform" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
