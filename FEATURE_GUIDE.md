# Quick Feature Reference Guide

## New Components

### 1. Cookie Consent Banner
**File**: `/src/components/CookieConsent.tsx`

**Usage**: Automatically loads in App.tsx
```tsx
<CookieConsent />
```

**Features**:
- GDPR-compliant consent management
- Three cookie categories: Essential, Analytics, Marketing
- User preference storage (365 days)
- Analytics integration with consent mode

**User Actions**:
- Accept All - Grants all cookie permissions
- Reject All - Only essential cookies
- Customize - Opens preference modal

---

### 2. Welcome Lightbox
**File**: `/src/components/WelcomeLightbox.tsx`

**Usage**: Automatically loads in App.tsx
```tsx
<WelcomeLightbox />
```

**Features**:
- Shows once per visitor (localStorage tracking)
- 2-second delay after page load
- Dual CTAs (Book Consultation / Newsletter)
- Auto-closes on interaction or backdrop click

**Customization**:
- Modify delay: Change `setTimeout` value (line 13)
- Change CTAs: Update button onClick handlers
- Reset: Clear localStorage key 'welcome-lightbox-shown'

---

### 3. Enhanced PWA Install Prompt
**File**: `/src/components/PWAInstallPrompt.tsx`

**Features**:
- Shows on first login only
- 15-second auto-dismiss timer
- 30-day dismissal tracking
- Mobile and desktop optimized

**Configuration**:
```tsx
const DISMISS_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const AUTO_DISMISS_TIME_MS = 15000; // 15 seconds
```

**Testing**:
- Clear localStorage key 'pwa-install-dismissed'
- Login to trigger prompt
- Wait 15 seconds to test auto-dismiss

---

### 4. Intercom Manager
**File**: `/src/components/IntercomManager.tsx`

**Features**:
- Conditional setup based on authentication
- Pre-login: Guest/sales configuration
- Post-login: Authenticated user with metadata

**Configuration**:
```tsx
const SALES_APP_ID = 'xu0gfiqb'; // Replace with your Intercom app ID
```

**Dual Workspace Setup**:
To implement separate sales/support workspaces:
1. Create second Intercom workspace
2. Add second app ID constant
3. Use user state to determine which workspace to load

---

### 5. Fixed Navigation Header
**File**: `/src/components/layout/Header.tsx`

**Features**:
- Fixed positioning at top
- Scroll detection (threshold: 20px)
- Dynamic background transition
- Active section highlighting
- Mobile menu with full overlay

**Behavior**:
- **Not scrolled**: Transparent background
- **Scrolled**: Glass-strong effect with shadow
- **Mobile**: Full-height overlay menu

---

### 6. Enhanced Footer
**File**: `/src/components/layout/Footer.tsx`

**Features**:
- Legal page links (Privacy Policy, Terms of Service)
- Responsive grid layout
- Social media links
- Contact information with clickable links
- Back to top button

**Legal Links**:
```tsx
const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/tos", label: "Terms of Service" }
];
```

---

## Google Analytics & GTM

### Implementation
**File**: `/index.html`

**Google Tag Manager**:
- Container ID: GTM-M97GN5T7
- Loads in `<head>` and `<body>`

**Google Analytics 4**:
- Measurement ID: G-6MX5G49Z0R
- gtag.js implementation

### Custom Event Tracking
Use existing analytics hook:
```tsx
import { useAnalytics } from "@/hooks/useAnalytics";

const { trackEvent } = useAnalytics(user);

// Track custom event
trackEvent('button_click', {
  button_name: 'Contact Form Submit',
  page: 'contact'
});
```

### Cookie Consent Integration
Analytics only loads after user consent is granted via CookieConsent component.

---

## Routing Updates

### New Routes
**File**: `/src/App.tsx`

Added routes:
- `/privacy` - Privacy Policy page
- `/tos` - Terms of Service (lowercase)
- `/TOS` - Terms of Service (uppercase redirect)

### Legal Page Files
- `/src/pages/PrivacyPolicy.tsx`
- `/src/pages/TermsOfService.tsx`

---

## Accessibility Features

### ARIA Labels
All interactive elements have proper aria-labels:
```tsx
<button aria-label="Close modal">
  <X aria-hidden="true" />
</button>
```

### Keyboard Navigation
- Tab through all interactive elements
- Escape key closes modals
- Enter/Space activates buttons
- Focus indicators visible

### Screen Reader Support
- Semantic HTML (header, nav, main, footer)
- Role attributes (banner, navigation, contentinfo)
- Alt text on all images
- ARIA live regions for dynamic content

---

## Responsive Design

### Breakpoints
```css
Mobile: 320px-768px
Tablet: 768px-1024px
Desktop: 1024px+
```

### Utility Classes
```css
.mobile-padding    /* Responsive padding */
.mobile-text       /* Scalable text */
.mobile-heading    /* Responsive headings */
.mobile-grid       /* Adaptive grids */
.mobile-flex       /* Flexible layouts */
.mobile-hidden     /* Hide on mobile */
.mobile-only       /* Show only on mobile */
```

### Touch Targets
All buttons and interactive elements meet minimum 44px touch target requirement on mobile.

---

## Testing Commands

### Build
```bash
npm run build
```

### Type Check
```bash
npm run typecheck
```

### Development
```bash
npm run dev
```

### Linting
```bash
npm run lint
```

---

## Common Customizations

### Change Cookie Consent Duration
**File**: `/src/components/CookieConsent.tsx`
```tsx
const CONSENT_EXPIRY_DAYS = 365; // Change to desired days
```

### Modify PWA Auto-Dismiss Time
**File**: `/src/components/PWAInstallPrompt.tsx`
```tsx
const AUTO_DISMISS_TIME_MS = 15000; // Change milliseconds
```

### Update Welcome Lightbox Delay
**File**: `/src/components/WelcomeLightbox.tsx`
```tsx
setTimeout(() => {
  setIsOpen(true);
}, 2000); // Change delay in milliseconds
```

### Change Scroll Threshold for Fixed Header
**File**: `/src/components/layout/Header.tsx`
```tsx
setScrolled(window.scrollY > 20); // Change pixel threshold
```

---

## Browser DevTools Testing

### Cookie Consent
1. Open DevTools > Application > Storage
2. Clear localStorage
3. Reload page
4. Test consent banner appears

### PWA Install
1. Open DevTools > Application > Manifest
2. Check manifest loads correctly
3. Test "Add to home screen" simulation

### Analytics
1. Open DevTools > Network
2. Filter by "gtm" or "analytics"
3. Verify requests after cookie consent
4. Check dataLayer in Console: `window.dataLayer`

### Accessibility
1. Open DevTools > Lighthouse
2. Run accessibility audit
3. Check ARIA attributes in Elements panel
4. Test keyboard navigation (Tab, Shift+Tab, Enter, Escape)

---

## Troubleshooting

### Cookie Consent Not Appearing
- Clear localStorage: `localStorage.clear()`
- Check browser console for errors
- Verify component imported in App.tsx

### PWA Prompt Not Showing
- Must be on HTTPS (not localhost)
- User must be logged in
- Check if already dismissed within 30 days
- Clear localStorage: `localStorage.removeItem('pwa-install-dismissed')`

### Analytics Not Tracking
- Verify cookie consent granted
- Check GTM container published
- Validate measurement ID in index.html
- Test in Incognito mode (extensions may block)

### Fixed Header Overlap
- Ensure content has proper top padding
- Check z-index conflicts
- Verify scroll detection threshold

### Mobile Menu Not Closing
- Check mobile menu ref handling
- Verify click outside detection
- Test escape key handler

---

## Performance Optimization

### Current Bundle Sizes
- Total: 873.47 kB
- CSS: 49.26 kB
- Gzipped: 256.03 kB

### Recommended Optimizations
1. Implement code splitting for routes
2. Lazy load heavy components
3. Use dynamic imports for modals
4. Optimize images (WebP format)
5. Enable brotli compression on server

### Monitoring
- Use Lighthouse for performance audits
- Monitor Core Web Vitals
- Track bundle size changes
- Review loading times in different regions

---

## Environment Variables

**File**: `.env`

Required variables:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

GTM and GA IDs are hardcoded in index.html for reliability.

---

## Deployment Notes

### Pre-Deployment Checklist
- [ ] Run `npm run build` successfully
- [ ] Test all new features in production build
- [ ] Verify analytics tracking
- [ ] Check cookie consent functionality
- [ ] Test on multiple devices
- [ ] Validate legal pages content
- [ ] Review environment variables

### Post-Deployment
- Monitor error logs
- Check analytics data flow
- Test user flows
- Gather user feedback
- Monitor performance metrics

---

## Support

For issues or questions:
- Email: jswilliamstu@gmail.com
- Phone: (215) 370-5332

For code issues:
- Check browser console for errors
- Review Network tab for failed requests
- Test in Incognito mode
- Clear cache and localStorage
