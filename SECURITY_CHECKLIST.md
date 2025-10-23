# Production Security Checklist

Comprehensive security checklist for deploying React + Vite + Supabase PWA to production.

---

## Critical Security Requirements (Must Complete)

### Environment Variables & Secrets

- [ ] **Never commit `.env` files to Git**
  - Verify `.env` is in `.gitignore`
  - Check git history for accidentally committed secrets
  - Use `git log --all --full-history -- .env` to search

- [ ] **Use correct Supabase keys**
  - ✅ Use `anon/public` key in frontend (safe for client-side)
  - ❌ NEVER use `service_role` key in frontend code
  - Verify keys in `.env.production` match Supabase dashboard

- [ ] **Prefix all client-side env vars with `VITE_`**
  - Only `VITE_*` variables are exposed to browser
  - Secrets without `VITE_` prefix won't work (intentional protection)

- [ ] **Use platform environment variables for production**
  - Set on Vercel/Netlify, not in code or `.env.production` file
  - Rotate keys immediately if `.env.production` was committed

- [ ] **Document required variables**
  - Keep `.env.example` updated with all required variables
  - Include comments explaining each variable's purpose

### Supabase Security

- [ ] **Enable Row Level Security (RLS) on ALL tables**
  ```sql
  ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;
  ```
  - Go to Database > Tables
  - Check "RLS enabled" column
  - Any table without RLS is publicly accessible!

- [ ] **Create appropriate RLS policies**
  ```sql
  -- Example: Users can only read their own data
  CREATE POLICY "Users can view own data" ON profiles
    FOR SELECT
    USING (auth.uid() = user_id);

  -- Example: Users can only update their own data
  CREATE POLICY "Users can update own data" ON profiles
    FOR UPDATE
    USING (auth.uid() = user_id);
  ```

- [ ] **Test RLS policies work correctly**
  - Create test user
  - Try accessing other users' data
  - Should be blocked by RLS policies

- [ ] **Configure Supabase authentication settings**
  - Set Site URL to production domain (`https://dobeu.net`)
  - Add redirect URLs: `https://dobeu.net/**`
  - Enable email confirmations
  - Set password requirements (min 6 characters)
  - Enable rate limiting on auth endpoints

- [ ] **Disable public schema access if not needed**
  ```sql
  REVOKE ALL ON SCHEMA public FROM anon;
  REVOKE ALL ON SCHEMA public FROM authenticated;
  ```

- [ ] **Review database permissions**
  - Audit which roles have access to which tables
  - Remove unnecessary permissions
  - Use least privilege principle

### Authentication & Authorization

- [ ] **Validate user sessions on protected routes**
  ```typescript
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/auth" />;
  ```

- [ ] **Implement proper logout functionality**
  - Clear all local storage
  - Invalidate Supabase session
  - Redirect to public page

- [ ] **Set secure session timeouts**
  - Supabase default: 1 hour active, 7 days idle
  - Adjust in Supabase dashboard if needed

- [ ] **Handle expired sessions gracefully**
  - Auto-refresh tokens (Supabase does this)
  - Show login prompt if refresh fails
  - Don't show cryptic errors to users

- [ ] **Validate email addresses on signup**
  - Enable email confirmation in Supabase
  - Don't allow login until email confirmed

- [ ] **Implement CSRF protection**
  - Supabase handles this automatically
  - Don't disable CSRF protection

### Input Validation & Sanitization

- [ ] **Validate all user inputs**
  - Use Zod schemas for form validation
  - Validate on both client and server (Supabase functions)
  ```typescript
  const schema = z.object({
    email: z.string().email(),
    name: z.string().min(1).max(100),
  });
  ```

- [ ] **Sanitize HTML inputs**
  - Never use `dangerouslySetInnerHTML` with user content
  - Use libraries like `DOMPurify` if rendering user HTML

- [ ] **Prevent SQL injection**
  - Supabase uses parameterized queries automatically
  - Never concatenate user input into SQL strings

- [ ] **Validate file uploads** (if applicable)
  - Check file types
  - Limit file sizes
  - Scan for malware (consider service like Cloudmersive)

### HTTPS & SSL/TLS

- [ ] **Force HTTPS on all pages**
  - Configure on hosting platform (Vercel/Netlify does this)
  - Add HSTS header: `Strict-Transport-Security: max-age=31536000`

- [ ] **Use secure cookies**
  ```typescript
  // Supabase does this automatically
  // If using custom cookies, set:
  // Secure: true (HTTPS only)
  // HttpOnly: true (no JavaScript access)
  // SameSite: 'Strict' or 'Lax'
  ```

- [ ] **Verify SSL certificate is valid**
  - Test at https://www.ssllabs.com/ssltest/
  - Should get A or A+ rating

- [ ] **Use HTTPS for all external resources**
  - Check fonts, images, scripts use HTTPS
  - Mixed content warnings are security issues

### Security Headers

- [ ] **Configure Content Security Policy (CSP)**
  ```
  Content-Security-Policy:
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    font-src 'self' data:;
    connect-src 'self' https://*.supabase.co;
  ```
  Note: Vite dev server requires `unsafe-eval`, remove in production if possible

- [ ] **Add X-Frame-Options header**
  ```
  X-Frame-Options: DENY
  ```
  Prevents clickjacking attacks

- [ ] **Add X-Content-Type-Options header**
  ```
  X-Content-Type-Options: nosniff
  ```
  Prevents MIME type sniffing

- [ ] **Add X-XSS-Protection header**
  ```
  X-XSS-Protection: 1; mode=block
  ```
  Enables browser XSS filter

- [ ] **Add Referrer-Policy header**
  ```
  Referrer-Policy: strict-origin-when-cross-origin
  ```
  Controls referrer information

- [ ] **Add Permissions-Policy header**
  ```
  Permissions-Policy: geolocation=(), microphone=(), camera=()
  ```
  Disables unnecessary browser features

### Cross-Origin Resource Sharing (CORS)

- [ ] **Configure CORS on Supabase**
  - Go to Settings > API > CORS allowed origins
  - Add production domains only: `https://dobeu.net`
  - Don't use `*` wildcard in production

- [ ] **Verify CORS headers in browser**
  ```bash
  curl -I https://dobeu.net
  # Check Access-Control-Allow-Origin header
  ```

### API Security

- [ ] **Implement rate limiting**
  - Supabase has built-in rate limiting
  - Enable in dashboard: Settings > API > Rate Limiting
  - Recommended: 100 requests per 15 minutes per IP

- [ ] **Use API keys securely**
  - Never expose service role key
  - Rotate anon key if exposed
  - Use environment variables, not hardcoded

- [ ] **Validate API responses**
  - Check response status codes
  - Handle errors gracefully
  - Don't expose error details to users

- [ ] **Implement request timeouts**
  ```typescript
  const { data, error } = await supabase
    .from('table')
    .select()
    .timeout(5000); // 5 second timeout
  ```

### Client-Side Security

- [ ] **Don't store sensitive data in localStorage**
  - Supabase session tokens are OK (encrypted)
  - Don't store passwords, credit cards, etc.
  - Consider sessionStorage for temporary data

- [ ] **Sanitize URLs and redirects**
  ```typescript
  // Validate redirect URLs
  const allowedDomains = ['dobeu.net', 'www.dobeu.net'];
  const isValidRedirect = (url: string) => {
    try {
      const parsed = new URL(url);
      return allowedDomains.includes(parsed.hostname);
    } catch {
      return false;
    }
  };
  ```

- [ ] **Use secure random numbers for tokens**
  ```typescript
  // Use crypto.randomUUID() for tokens
  const token = crypto.randomUUID();

  // Don't use Math.random() for security
  ```

- [ ] **Implement Content Security Policy**
  - See headers section above
  - Test with browser console for violations

---

## Recommended Security Practices

### Monitoring & Logging

- [ ] **Set up error monitoring**
  - Use Sentry, LogRocket, or similar
  - Monitor for security-related errors
  - Set up alerts for suspicious activity

- [ ] **Log security events**
  - Failed login attempts
  - Unauthorized access attempts
  - Unusual API usage patterns

- [ ] **Monitor Supabase logs**
  - Check for SQL injection attempts
  - Review failed authentication attempts
  - Monitor for unusual query patterns

- [ ] **Set up uptime monitoring**
  - Use UptimeRobot, Pingdom, or similar
  - Get alerts if site goes down
  - Monitor from multiple locations

### Dependency Security

- [ ] **Audit npm dependencies for vulnerabilities**
  ```bash
  npm audit
  npm audit fix
  ```

- [ ] **Keep dependencies up to date**
  ```bash
  npm outdated
  npm update
  ```

- [ ] **Use dependabot or renovate bot**
  - Automatically creates PRs for updates
  - Helps catch security patches quickly

- [ ] **Review dependencies before installing**
  - Check npm download counts
  - Review GitHub stars and issues
  - Check for known vulnerabilities

- [ ] **Use package-lock.json**
  - Commit to Git
  - Ensures consistent installs
  - Prevents supply chain attacks

### Database Security

- [ ] **Enable database backups**
  - Supabase Pro plan has automatic backups
  - Test restore procedure
  - Store backups securely

- [ ] **Use database connection pooling**
  - Supabase does this automatically
  - Prevents connection exhaustion attacks

- [ ] **Encrypt sensitive database fields**
  ```sql
  -- Example: Encrypt credit card numbers
  CREATE EXTENSION IF NOT EXISTS pgcrypto;

  INSERT INTO payments (cc_number)
  VALUES (pgp_sym_encrypt('4111111111111111', 'encryption_key'));
  ```

- [ ] **Regularly review database access logs**
  - Check for unusual query patterns
  - Monitor for SQL injection attempts

### Code Security

- [ ] **Use TypeScript strict mode**
  ```json
  // tsconfig.json
  {
    "compilerOptions": {
      "strict": true,
      "noUncheckedIndexedAccess": true
    }
  }
  ```

- [ ] **Avoid using `any` type**
  - Use proper TypeScript types
  - Helps catch security issues at compile time

- [ ] **Use ESLint security plugins**
  ```bash
  npm install -D eslint-plugin-security
  ```
  ```json
  // .eslintrc
  {
    "plugins": ["security"],
    "extends": ["plugin:security/recommended"]
  }
  ```

- [ ] **Remove console.log in production**
  ```typescript
  // vite.config.ts
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : []
  }
  ```

- [ ] **Use code scanning tools**
  - GitHub CodeQL (free for public repos)
  - SonarCloud
  - Snyk

### User Privacy

- [ ] **Add privacy policy**
  - Explain data collection
  - GDPR/CCPA compliance if applicable
  - Link in footer

- [ ] **Implement cookie consent**
  - Required in EU/UK
  - Use component like `react-cookie-consent`

- [ ] **Allow users to delete their data**
  - GDPR "right to be forgotten"
  - Provide account deletion option

- [ ] **Anonymize analytics data**
  - Use privacy-friendly analytics (Plausible)
  - Don't collect PII in analytics

- [ ] **Implement data retention policies**
  - Delete old logs after 90 days
  - Archive inactive accounts after 1 year

---

## Testing Security

### Manual Security Testing

- [ ] **Test authentication flows**
  - Try accessing protected routes without login
  - Test password reset flow
  - Verify email confirmation works
  - Test OAuth providers if used

- [ ] **Test authorization**
  - Try accessing other users' data
  - Test admin-only features as regular user
  - Verify RLS policies work

- [ ] **Test input validation**
  - Try SQL injection payloads
  - Test XSS attacks (script tags)
  - Test file upload vulnerabilities
  - Try buffer overflow attacks

- [ ] **Test session management**
  - Test logout functionality
  - Verify sessions expire
  - Test concurrent logins
  - Test session hijacking protection

### Automated Security Testing

- [ ] **Run Lighthouse security audit**
  ```bash
  # Chrome DevTools > Lighthouse > Security
  ```

- [ ] **Scan with OWASP ZAP**
  - https://www.zaproxy.org/
  - Automated security scanner
  - Free and open source

- [ ] **Use Mozilla Observatory**
  - https://observatory.mozilla.org/
  - Checks headers and SSL configuration
  - Provides security score and recommendations

- [ ] **Test SSL configuration**
  - https://www.ssllabs.com/ssltest/
  - Should get A or A+ rating

---

## Incident Response Plan

### If Security Breach Detected

1. **Immediately revoke compromised credentials**
   - Rotate all API keys
   - Force logout all users
   - Disable affected accounts

2. **Assess the damage**
   - Check Supabase logs for unauthorized access
   - Review error monitoring for suspicious activity
   - Identify affected users

3. **Contain the breach**
   - Take affected systems offline if needed
   - Block malicious IPs
   - Disable vulnerable features temporarily

4. **Notify affected users**
   - Email affected users
   - Explain what happened
   - Recommend actions (change password, etc.)

5. **Fix the vulnerability**
   - Patch the security hole
   - Update dependencies
   - Review code for similar issues

6. **Document and learn**
   - Write post-mortem
   - Update security procedures
   - Implement additional monitoring

---

## Security Audit Schedule

### Daily
- Review error logs for security issues
- Check uptime monitoring alerts

### Weekly
- Review Supabase auth logs
- Check npm audit results
- Monitor for unusual traffic patterns

### Monthly
- Update dependencies
- Review access logs
- Test backup restoration

### Quarterly
- Full security audit
- Penetration testing (if resources allow)
- Review and update security policies

### Annually
- Rotate all API keys
- Review all user permissions
- Update security documentation
- External security audit (if budget allows)

---

## Security Resources

### Tools
- **OWASP ZAP**: https://www.zaproxy.org/
- **Mozilla Observatory**: https://observatory.mozilla.org/
- **SSL Labs**: https://www.ssllabs.com/ssltest/
- **Snyk**: https://snyk.io/
- **npm audit**: Built into npm

### Documentation
- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
- **Supabase Security**: https://supabase.com/docs/guides/platform/going-into-prod
- **MDN Web Security**: https://developer.mozilla.org/en-US/docs/Web/Security
- **React Security**: https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml

### Communities
- **OWASP Community**: https://owasp.org/
- **Supabase Discord**: https://discord.supabase.com/
- **r/netsec**: https://reddit.com/r/netsec

---

## Compliance Checklist (If Applicable)

### GDPR (EU Users)
- [ ] Privacy policy explaining data collection
- [ ] Cookie consent banner
- [ ] User data export functionality
- [ ] User data deletion functionality
- [ ] Data breach notification procedure (72 hours)

### CCPA (California Users)
- [ ] Privacy policy with CCPA disclosures
- [ ] "Do Not Sell My Data" option
- [ ] Data access requests honored

### SOC 2 (Enterprise Customers)
- [ ] Access controls documented
- [ ] Change management procedures
- [ ] Incident response plan
- [ ] Regular security audits

### PCI DSS (If Handling Payments)
- [ ] Never store credit card numbers
- [ ] Use PCI-compliant payment processor (Stripe, etc.)
- [ ] Encrypt cardholder data in transit
- [ ] Regularly test security systems

---

**Security Checklist Version**: 1.0
**Last Updated**: 2025-10-23
**Next Review**: After first production deployment

**Remember**: Security is not a one-time task. It's an ongoing process that requires constant vigilance and updates.
