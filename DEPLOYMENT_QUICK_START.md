# Quick Start: Deploy to Production

This is a condensed guide for deploying your React + Vite + Supabase PWA to production at https://dobeu.net.

For comprehensive documentation, see [PRODUCTION_DEPLOYMENT_GUIDE.md](./PRODUCTION_DEPLOYMENT_GUIDE.md).

---

## Prerequisites Checklist

Before deploying, ensure you have:

- [ ] Supabase production project created
- [ ] Production API keys from Supabase dashboard
- [ ] Domain (dobeu.net) purchased and accessible
- [ ] GitHub repository set up with latest code
- [ ] Tested build locally (`npm run build && npm run preview`)

---

## Step 1: Set Up Supabase Production

1. **Create Production Project**
   - Go to https://app.supabase.com
   - Click "New Project"
   - Name: "dobeunet-production"
   - Choose region closest to your users
   - Save password securely

2. **Get API Keys**
   - Navigate to Project Settings > API
   - Copy **Project URL**: `https://xxxxx.supabase.co`
   - Copy **Anon/Public Key**: `eyJhbGci...`
   - NEVER use the Service Role Key in frontend

3. **Configure Authentication**
   - Go to Authentication > URL Configuration
   - Site URL: `https://dobeu.net`
   - Add Redirect URL: `https://dobeu.net/**`
   - Save changes

4. **Run Database Migrations**
   ```bash
   # Install Supabase CLI
   npm install -g supabase

   # Login
   supabase login

   # Link to production project
   supabase link --project-ref your-production-ref

   # Push migrations
   supabase db push
   ```

5. **Enable Row Level Security**
   - Go to Database > Tables
   - For each table, click "Enable RLS"
   - Add policies for read/write access

---

## Step 2: Deploy to Vercel (Recommended)

### Option A: Via Vercel Dashboard

1. **Sign Up & Import**
   - Go to https://vercel.com/signup
   - Sign up with GitHub
   - Click "Add New" > "Project"
   - Select your repository
   - Vercel auto-detects Vite configuration

2. **Configure Build**
   - Framework Preset: **Vite** (auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Add Environment Variables**
   - Click "Environment Variables"
   - Add the following:
     ```
     VITE_SUPABASE_URL = https://xxxxx.supabase.co
     VITE_SUPABASE_ANON_KEY = your_production_anon_key
     ```
   - Set environment: **Production**

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - You'll get a URL: `https://dobeunet.vercel.app`

5. **Add Custom Domain**
   - Go to Project Settings > Domains
   - Enter `dobeu.net`
   - Follow DNS instructions provided by Vercel
   - Add these records at your domain registrar:
     ```
     Type: A
     Name: @
     Value: 76.76.21.21

     Type: CNAME
     Name: www
     Value: cname.vercel-dns.com
     ```
   - Wait for DNS propagation (5-60 minutes)
   - Vercel automatically provisions SSL certificate

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from project directory
cd /home/jeremyw/dobeunet/dobeunet
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - What's your project's name? dobeunet
# - In which directory is your code located? ./
# - Want to override settings? N

# Add environment variables
vercel env add VITE_SUPABASE_URL
# Paste your Supabase URL

vercel env add VITE_SUPABASE_ANON_KEY
# Paste your Supabase anon key

# Deploy to production
vercel --prod

# Add custom domain
vercel domains add dobeu.net
```

---

## Step 3: Alternative - Deploy to Netlify

1. **Sign Up & Import**
   - Go to https://app.netlify.com/start
   - Connect GitHub account
   - Select your repository

2. **Configure Build**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click "Advanced" > "New variable"
   - Add environment variables:
     ```
     VITE_SUPABASE_URL = https://xxxxx.supabase.co
     VITE_SUPABASE_ANON_KEY = your_anon_key
     ```

3. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete
   - You'll get URL: `https://random-name.netlify.app`

4. **Add Custom Domain**
   - Go to Site Settings > Domain Management
   - Click "Add custom domain"
   - Enter `dobeu.net`
   - Add DNS records at your registrar:
     ```
     Type: A
     Name: @
     Value: 75.2.60.5

     Type: CNAME
     Name: www
     Value: random-name.netlify.app
     ```
   - Enable HTTPS (automatic with Let's Encrypt)

---

## Step 4: Verify Deployment

### Test Basic Functionality

```bash
# Check site is accessible
curl -I https://dobeu.net

# Should return: HTTP/2 200
```

### Test PWA Features

1. **Open in Browser**
   - Navigate to https://dobeu.net
   - Open DevTools (F12)

2. **Check Manifest**
   - Application tab > Manifest
   - Verify all fields load correctly
   - Check icon URLs work

3. **Check Service Worker**
   - Application tab > Service Workers
   - Verify service worker registers
   - Status should be "activated and running"

4. **Test Offline**
   - Network tab > Set throttling to "Offline"
   - Refresh page
   - Should still load from cache
   - Re-enable network

5. **Test Installation**
   - Look for install prompt (mobile/desktop)
   - Click install
   - App should appear on home screen/desktop

### Run Lighthouse Audit

1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Select all categories
4. Click "Generate report"
5. Target scores:
   - Performance: >90
   - Accessibility: >95
   - Best Practices: >95
   - SEO: >90
   - PWA: 100

### Test Authentication

1. Go to https://dobeu.net/auth
2. Try signing up with email
3. Check email for confirmation
4. Try signing in
5. Verify dashboard access
6. Try signing out

---

## Step 5: Configure Continuous Deployment

### Automatic Deployments (Vercel/Netlify)

Both platforms automatically deploy when you push to your repository:

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main

# Vercel/Netlify automatically:
# 1. Detects push
# 2. Runs build
# 3. Deploys to production
# 4. Sends notification
```

### Deploy Previews

Every pull request gets a unique preview URL:

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and push
git push origin feature/new-feature

# Open PR on GitHub
# Vercel/Netlify comments with preview URL
# Test changes before merging
```

---

## Step 6: Monitor Your Deployment

### Set Up Error Monitoring (Optional but Recommended)

**Using Sentry**:

1. Sign up at https://sentry.io
2. Create new project > React
3. Get your DSN
4. Add to Vercel/Netlify environment variables:
   ```
   VITE_SENTRY_DSN = https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
   VITE_SENTRY_ENVIRONMENT = production
   ```
5. Install Sentry SDK:
   ```bash
   npm install @sentry/react
   ```
6. Initialize in your app (see main deployment guide)

### Set Up Uptime Monitoring (Free)

**Using UptimeRobot**:

1. Sign up at https://uptimerobot.com
2. Add new monitor
3. Monitor Type: HTTPS
4. URL: https://dobeu.net
5. Monitoring Interval: 5 minutes
6. Set up email alerts

### Enable Analytics (Optional)

**Using Vercel Analytics**:
- Automatically enabled for Vercel deployments
- View in Vercel dashboard

**Using Plausible** (privacy-friendly):
1. Sign up at https://plausible.io
2. Add your domain
3. Add script to `index.html`:
   ```html
   <script defer data-domain="dobeu.net" src="https://plausible.io/js/script.js"></script>
   ```

---

## Common Issues & Quick Fixes

### Issue: Build fails with "Missing environment variables"

**Fix**:
- Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Check they're prefixed with `VITE_`
- Verify they're set for "Production" environment

### Issue: 404 on route refresh

**Fix**:
- Ensure `vercel.json` or `netlify.toml` is present
- Check SPA redirect rules are configured
- For Netlify, ensure `_redirects` file is in `/public`

### Issue: Service worker not updating

**Fix**:
- Increment cache version in `service-worker.js`
- Clear browser cache and hard refresh (Ctrl+Shift+R)
- Unregister old service worker in DevTools

### Issue: Authentication redirects to localhost

**Fix**:
- Update Supabase Site URL to `https://dobeu.net`
- Add redirect URL: `https://dobeu.net/**`
- Clear browser cookies and test in incognito

### Issue: CORS errors

**Fix**:
- Add `https://dobeu.net` to Supabase allowed origins
- Settings > API > CORS allowed origins
- Include trailing slash if needed

### Issue: Icons not showing in PWA

**Fix**:
- Generate PNG versions of icons (SVG support limited)
- Provide all required sizes: 192x192, 512x512
- Clear browser cache and reinstall PWA
- Use https://realfavicongenerator.net/

---

## Performance Optimization Quick Wins

After initial deployment, optimize with these quick wins:

1. **Enable Code Splitting**
   ```typescript
   // Use lazy loading for routes
   const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
   ```

2. **Optimize Images**
   ```html
   <img src="/image.jpg" loading="lazy" alt="Description" />
   ```

3. **Add Preconnect Headers**
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="dns-prefetch" href="https://xxxxx.supabase.co">
   ```

4. **Review Bundle Size**
   ```bash
   npm install -D rollup-plugin-visualizer
   npm run build
   # Opens bundle analysis
   ```

---

## Next Steps After Deployment

- [ ] Set up error monitoring (Sentry)
- [ ] Configure uptime monitoring (UptimeRobot)
- [ ] Enable analytics (Plausible or Vercel Analytics)
- [ ] Test on multiple devices and browsers
- [ ] Submit sitemap to Google Search Console
- [ ] Set up database backups in Supabase
- [ ] Document deployment process for team
- [ ] Create staging environment (optional)
- [ ] Set up CI/CD tests (optional)
- [ ] Plan regular maintenance schedule

---

## Resources

- **Full Deployment Guide**: [PRODUCTION_DEPLOYMENT_GUIDE.md](./PRODUCTION_DEPLOYMENT_GUIDE.md)
- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Supabase Docs**: https://supabase.com/docs
- **Vite PWA Plugin**: https://vite-pwa-org.netlify.app/

---

## Support

If you encounter issues:

1. Check browser console for errors
2. Review build logs in Vercel/Netlify dashboard
3. Check Supabase logs in Supabase dashboard
4. Consult the full deployment guide
5. Ask in relevant Discord communities:
   - Vite: https://chat.vitejs.dev/
   - Supabase: https://discord.supabase.com/
   - Vercel: https://vercel.com/support

---

**Quick Start Version**: 1.0
**Last Updated**: 2025-10-23
