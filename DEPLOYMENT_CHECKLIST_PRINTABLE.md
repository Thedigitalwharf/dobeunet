# Production Deployment Checklist - dobeu.net

**Print this page and check off items as you complete them.**

---

## Phase 1: Pre-Deployment Setup

### Supabase Configuration
- [ ] Production project created
- [ ] Database migrations pushed
- [ ] RLS enabled on ALL tables
- [ ] RLS policies tested
- [ ] Site URL set to `https://dobeu.net`
- [ ] Redirect URLs added: `https://dobeu.net/**`
- [ ] API keys copied (URL + Anon Key)
- [ ] Email templates configured
- [ ] Rate limiting enabled
- [ ] Backups enabled

### Environment Setup
- [ ] `.env.example` reviewed
- [ ] Production env vars documented
- [ ] `.env` added to `.gitignore`
- [ ] No secrets committed to Git
- [ ] All `VITE_` prefixes correct

### Build Preparation
- [ ] `npm run build` succeeds locally
- [ ] `npm run preview` works
- [ ] No TypeScript errors
- [ ] All tests passing
- [ ] Dependencies updated
- [ ] `npm audit` clean

---

## Phase 2: Platform Deployment

### Vercel Setup
- [ ] Account created/logged in
- [ ] Repository imported
- [ ] Framework preset: Vite (auto-detected)
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Environment variables added:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
  - [ ] Other variables as needed
- [ ] First deployment successful
- [ ] Preview URL works

### Domain Configuration
- [ ] Custom domain added: `dobeu.net`
- [ ] DNS records configured:
  - [ ] A record: `@` → Vercel IP
  - [ ] CNAME record: `www` → Vercel
- [ ] DNS propagation verified
- [ ] SSL certificate provisioned
- [ ] HTTPS working
- [ ] www redirect configured

---

## Phase 3: Verification Testing

### Basic Functionality
- [ ] Site loads at `https://dobeu.net`
- [ ] All pages accessible
- [ ] Navigation works
- [ ] Images load correctly
- [ ] Forms submit successfully
- [ ] No console errors

### Authentication
- [ ] Sign up works
- [ ] Email confirmation received
- [ ] Sign in works
- [ ] Sign out works
- [ ] Password reset works
- [ ] Protected routes secured
- [ ] Session persists after refresh

### PWA Features
- [ ] Manifest loads (DevTools > Application)
- [ ] Service worker registers
- [ ] Service worker activates
- [ ] Offline mode works
- [ ] Install prompt appears
- [ ] App installs successfully
- [ ] Icons display correctly
- [ ] Cache strategy working

### Cross-Browser Testing
- [ ] Chrome/Edge (desktop)
- [ ] Firefox (desktop)
- [ ] Safari (desktop)
- [ ] Chrome (mobile)
- [ ] Safari (iOS)
- [ ] Samsung Internet (Android)

### Performance Testing
- [ ] Lighthouse audit run
  - [ ] Performance: ≥90
  - [ ] Accessibility: ≥95
  - [ ] Best Practices: ≥95
  - [ ] SEO: ≥90
  - [ ] PWA: 100
- [ ] First load under 3 seconds
- [ ] Bundle size under 500KB
- [ ] No layout shift issues

---

## Phase 4: Security Hardening

### Critical Security
- [ ] HTTPS enforced (no HTTP)
- [ ] SSL certificate valid (A rating)
- [ ] No service role keys in frontend
- [ ] RLS working on all tables
- [ ] Environment variables secured
- [ ] CORS configured correctly
- [ ] Rate limiting active

### Security Headers
- [ ] Content-Security-Policy
- [ ] X-Frame-Options: DENY
- [ ] X-Content-Type-Options: nosniff
- [ ] X-XSS-Protection: 1; mode=block
- [ ] Referrer-Policy configured
- [ ] Permissions-Policy configured

### Validation & Sanitization
- [ ] All forms validated (Zod)
- [ ] User inputs sanitized
- [ ] SQL injection protected
- [ ] XSS protection in place
- [ ] File upload validation (if applicable)

---

## Phase 5: Monitoring Setup

### Error Monitoring
- [ ] Sentry/error monitoring configured
- [ ] Error boundaries implemented
- [ ] Test errors captured correctly
- [ ] Source maps configured (if needed)
- [ ] Alert notifications set up

### Uptime Monitoring
- [ ] UptimeRobot/similar configured
- [ ] Monitor URL: `https://dobeu.net`
- [ ] Check interval: 5 minutes
- [ ] Email alerts enabled
- [ ] Status page created (optional)

### Analytics
- [ ] Analytics platform chosen
- [ ] Tracking code added
- [ ] Test events firing
- [ ] Goals/conversions configured
- [ ] Privacy policy updated

### Logging
- [ ] Supabase logs reviewed
- [ ] Browser console clean
- [ ] Network requests monitored
- [ ] No sensitive data logged

---

## Phase 6: Performance Optimization

### Code Optimization
- [ ] Code splitting implemented
- [ ] Routes lazy loaded
- [ ] Manual chunks configured
- [ ] Unused code removed
- [ ] Bundle analyzed

### Asset Optimization
- [ ] Images optimized/compressed
- [ ] Lazy loading enabled
- [ ] WebP format used (where supported)
- [ ] Fonts optimized
- [ ] Icons optimized

### Caching Strategy
- [ ] Static assets cached (1 year)
- [ ] HTML not cached
- [ ] Service worker not cached
- [ ] API responses cached (if appropriate)
- [ ] CDN configured

---

## Phase 7: Documentation & Handoff

### Documentation
- [ ] Deployment process documented
- [ ] Environment variables documented
- [ ] Architecture decisions documented
- [ ] Troubleshooting guide created
- [ ] Rollback procedure documented

### Team Knowledge Transfer
- [ ] Team trained on deployment
- [ ] Access credentials shared securely
- [ ] Emergency contacts listed
- [ ] Escalation procedures defined
- [ ] Maintenance schedule created

---

## Phase 8: Post-Launch

### Immediate (First 24 Hours)
- [ ] Monitor error rates
- [ ] Check uptime status
- [ ] Review analytics setup
- [ ] Watch for user feedback
- [ ] Be ready for quick fixes

### First Week
- [ ] Review error logs daily
- [ ] Monitor performance metrics
- [ ] Check security alerts
- [ ] Test on multiple devices
- [ ] Gather initial user feedback
- [ ] Review Supabase usage

### First Month
- [ ] Monthly security review
- [ ] Performance optimization review
- [ ] Update dependencies
- [ ] Review analytics insights
- [ ] Plan improvements

---

## Rollback Plan

### If Critical Issues Occur

**Option 1: Revert Deployment (Vercel)**
- [ ] Go to Deployments in Vercel dashboard
- [ ] Find last working deployment
- [ ] Click "..." menu → "Promote to Production"
- [ ] Verify rollback successful

**Option 2: Fix Forward**
- [ ] Identify issue in error logs
- [ ] Fix in codebase
- [ ] Test locally
- [ ] Deploy fix
- [ ] Verify fix works

**Emergency Contacts**
- Vercel Support: https://vercel.com/support
- Supabase Support: https://discord.supabase.com/
- Team Lead: [Add contact]
- DevOps: [Add contact]

---

## Success Criteria

### Deployment is successful when:
- [ ] Site loads without errors
- [ ] Authentication works end-to-end
- [ ] PWA installs and works offline
- [ ] All Lighthouse scores ≥90
- [ ] No security vulnerabilities
- [ ] Monitoring is active
- [ ] Team is trained
- [ ] Documentation is complete

---

## Sign-Off

**Deployed By**: _______________________  
**Date**: _______________________  
**Time**: _______________________  
**Deployment URL**: https://dobeu.net  
**Vercel URL**: https://dobeunet.vercel.app  

**Verified By**: _______________________  
**Date**: _______________________  

**Production Ready**: ☐ YES  ☐ NO (explain): _______________

---

## Notes & Issues

Use this space to document any issues encountered or notes for future reference:

_______________________________________________________________

_______________________________________________________________

_______________________________________________________________

_______________________________________________________________

_______________________________________________________________

_______________________________________________________________

---

**Version**: 1.0  
**Last Updated**: 2025-10-23  
**Project**: dobeunet  
**Domain**: https://dobeu.net
