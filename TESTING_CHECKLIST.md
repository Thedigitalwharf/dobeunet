# Website Optimization Testing Checklist

## Pre-Testing Setup

- [ ] Build completed successfully (`npm run build`)
- [ ] No TypeScript errors
- [ ] All new files committed to repository
- [ ] Environment variables configured
- [ ] Testing in multiple browsers available

---

## 1. Accessibility Testing (WCAG AA Compliance)

### Screen Reader Testing
- [ ] Test with NVDA (Windows) or VoiceOver (Mac)
- [ ] All navigation items announced correctly
- [ ] Form labels properly associated
- [ ] Button purposes clear
- [ ] Modal dialogs announced with role
- [ ] Dynamic content changes announced
- [ ] Skip navigation links work

### Keyboard Navigation
- [ ] Tab through entire page in logical order
- [ ] All interactive elements focusable
- [ ] Focus indicators visible and styled
- [ ] Escape closes modals and menus
- [ ] Enter/Space activates buttons
- [ ] Arrow keys work in menus (if applicable)
- [ ] No keyboard traps

### Color Contrast
- [ ] Run automated contrast checker (WCAG AA: 4.5:1 normal, 3:1 large text)
- [ ] Test in light mode
- [ ] Test in dark mode
- [ ] Check muted text readability
- [ ] Verify button text contrast
- [ ] Check link visibility

### ARIA Implementation
- [ ] All interactive elements have aria-labels
- [ ] Icons marked with aria-hidden="true"
- [ ] Modals have aria-modal="true"
- [ ] Landmarks properly defined (banner, navigation, contentinfo)
- [ ] Live regions for dynamic content
- [ ] aria-current for active navigation items

### Tools
- [ ] Lighthouse accessibility audit (score >90)
- [ ] axe DevTools extension
- [ ] WAVE accessibility checker
- [ ] Screen reader (NVDA/VoiceOver)

---

## 2. Responsive Design Testing

### Mobile (320px-768px)
- [ ] Layout adapts correctly
- [ ] Text remains readable (no overflow)
- [ ] Touch targets ≥44px
- [ ] Mobile menu opens/closes smoothly
- [ ] Images scale properly
- [ ] Forms usable on mobile
- [ ] No horizontal scrolling
- [ ] Fixed header doesn't overlap content

**Test Devices:**
- [ ] iPhone SE (375px)
- [ ] iPhone 12/13/14 (390px)
- [ ] Samsung Galaxy S21 (360px)
- [ ] Generic 320px viewport

### Tablet (768px-1024px)
- [ ] Grid layouts adapt
- [ ] Navigation transitions properly
- [ ] Content spacing appropriate
- [ ] Images scale correctly
- [ ] Touch interactions work
- [ ] Modal sizes appropriate

**Test Devices:**
- [ ] iPad (768px)
- [ ] iPad Pro (1024px)
- [ ] Surface tablet

### Desktop (1024px+)
- [ ] Full layout displays correctly
- [ ] Hover states work
- [ ] Desktop navigation visible
- [ ] Wide screens handled (1920px+)
- [ ] Ultra-wide displays (2560px+)
- [ ] Content max-width enforced

### Orientation Changes
- [ ] Portrait to landscape transitions smoothly
- [ ] Layout adjusts appropriately
- [ ] No content loss during rotation
- [ ] Fixed elements remain positioned

### Testing Tools
- [ ] Chrome DevTools device emulation
- [ ] Firefox Responsive Design Mode
- [ ] BrowserStack for real devices
- [ ] Physical device testing

---

## 3. PWA Installation Testing

### Chrome/Edge Desktop
- [ ] Login to application
- [ ] Installation prompt appears
- [ ] Prompt displays for 15 seconds
- [ ] Auto-dismiss works after 15s
- [ ] Manual dismiss works (X button)
- [ ] "Not now" button works
- [ ] Install button triggers browser prompt
- [ ] App installs successfully
- [ ] Installed app opens standalone
- [ ] Prompt doesn't reappear for 30 days

### Chrome Android
- [ ] Login on mobile
- [ ] Installation banner appears
- [ ] Install button works
- [ ] App installs to home screen
- [ ] Icon displays correctly
- [ ] Splash screen shows
- [ ] Standalone mode works
- [ ] Orientation locks correctly

### iOS Safari
- [ ] Login on iOS
- [ ] Manual installation instructions clear
- [ ] Add to Home Screen works
- [ ] Icon displays correctly
- [ ] App opens in standalone mode

### Edge Cases
- [ ] Already installed: no prompt
- [ ] Dismissed recently: no prompt (check 30 days)
- [ ] Not logged in: no prompt
- [ ] Service worker registers correctly
- [ ] Offline functionality (if implemented)

### Storage Testing
- [ ] Clear localStorage: `localStorage.removeItem('pwa-install-dismissed')`
- [ ] Verify prompt reappears
- [ ] Check timestamp stored correctly
- [ ] Verify 30-day calculation

---

## 4. Fixed Navigation Testing

### Scroll Behavior
- [ ] Header starts transparent/minimal
- [ ] Transitions to solid at 20px scroll
- [ ] Smooth animation (300ms)
- [ ] Active section highlighted correctly
- [ ] Scroll to section with proper offset
- [ ] Mobile menu scrolls with page (fixed)

### Mobile Menu
- [ ] Toggle opens menu
- [ ] Full-height overlay displays
- [ ] Backdrop blur effect works
- [ ] Click outside closes menu
- [ ] Escape key closes menu
- [ ] Menu items clickable
- [ ] Scrolls to sections correctly
- [ ] Body scroll locked when open

### Accessibility
- [ ] Keyboard navigation works
- [ ] aria-expanded updates correctly
- [ ] Focus trapped in open mobile menu
- [ ] Screen reader announces menu state
- [ ] Skip navigation links work

### Edge Cases
- [ ] Very short pages (no scroll)
- [ ] Long pages with many sections
- [ ] Fast scrolling
- [ ] Browser zoom (125%, 150%)
- [ ] Multiple rapid menu toggles

---

## 5. Welcome Lightbox Testing

### Display Logic
- [ ] Shows 2 seconds after page load
- [ ] Only shows on first visit
- [ ] localStorage key created
- [ ] Doesn't reappear on reload
- [ ] Clear key: reappears next visit

### User Interactions
- [ ] X button closes lightbox
- [ ] Click backdrop closes lightbox
- [ ] "Book Consultation" scrolls to booking section
- [ ] "Newsletter" scrolls to newsletter section
- [ ] Escape key closes lightbox
- [ ] Focus trapped in open lightbox

### Visual Design
- [ ] Animations smooth (Framer Motion)
- [ ] Gradient bar displays
- [ ] Stats grid shows correctly
- [ ] Buttons hover effects work
- [ ] Mobile responsive layout
- [ ] Dark/light mode compatible

### Edge Cases
- [ ] Multiple tabs opened simultaneously
- [ ] Rapid page navigation
- [ ] Browser back button during display
- [ ] Slow internet connection
- [ ] High contrast mode

---

## 6. Intercom Integration Testing

### Pre-Login (Guest)
- [ ] Intercom widget loads
- [ ] Positioned correctly (bottom right)
- [ ] Opens on click
- [ ] Guest configuration active
- [ ] Sales-focused messaging
- [ ] No user identification

### Post-Login (Authenticated)
- [ ] Widget reloads with user data
- [ ] User ID passed correctly
- [ ] User name displays
- [ ] User email passed
- [ ] Created_at timestamp correct
- [ ] Support-focused messaging

### Functionality
- [ ] Widget doesn't block other elements
- [ ] Mobile positioning appropriate
- [ ] Z-index correct (not covering fixed nav)
- [ ] Opens/closes smoothly
- [ ] Messages send successfully
- [ ] Notifications work

### Edge Cases
- [ ] Login/logout transitions
- [ ] Multiple rapid auth changes
- [ ] Network errors
- [ ] Widget fails to load gracefully

---

## 7. Cookie Consent Testing

### Initial Display
- [ ] Banner appears on first visit
- [ ] Positioned at bottom of screen
- [ ] Doesn't cover important content
- [ ] Mobile responsive layout
- [ ] All buttons visible and clickable

### Accept All
- [ ] Grants all cookie consents
- [ ] Banner dismisses
- [ ] Analytics scripts load
- [ ] Consent stored in localStorage
- [ ] Persists across page reloads
- [ ] Expiry set to 365 days

### Reject Non-Essential
- [ ] Only essential cookies allowed
- [ ] Analytics blocked
- [ ] Marketing blocked
- [ ] Banner dismisses
- [ ] Consent stored correctly

### Customize Preferences
- [ ] Modal opens
- [ ] Essential always enabled (disabled toggle)
- [ ] Analytics toggles work
- [ ] Marketing toggles work
- [ ] Save button stores preferences
- [ ] Cancel button closes without saving
- [ ] Modal dismisses on backdrop click
- [ ] Escape key closes modal

### Analytics Integration
- [ ] Google Analytics loads only after consent
- [ ] GTM respects consent
- [ ] Consent mode API called
- [ ] dataLayer updates correctly
- [ ] No analytics before consent

### Privacy Policy Link
- [ ] Links to /privacy page
- [ ] Opens in same tab
- [ ] Maintains consent banner state

### Edge Cases
- [ ] Consent expired (366+ days)
- [ ] Invalid localStorage data
- [ ] Cookies disabled in browser
- [ ] Private/Incognito mode
- [ ] Multiple simultaneous tabs

---

## 8. Legal Pages Testing

### Privacy Policy (/privacy)
- [ ] Page loads correctly
- [ ] Header displays
- [ ] Footer displays
- [ ] Content readable and formatted
- [ ] Links work (internal and external)
- [ ] Mobile responsive
- [ ] Print-friendly
- [ ] Last updated date shows

### Terms of Service
- [ ] /tos route works
- [ ] /TOS route works (case insensitive)
- [ ] Content displays correctly
- [ ] All sections visible
- [ ] Mobile responsive
- [ ] Links functional
- [ ] Contact information correct

### Footer Links
- [ ] Privacy Policy link in footer
- [ ] Terms of Service link in footer
- [ ] Links styled consistently
- [ ] Hover states work
- [ ] Mobile footer links accessible
- [ ] Links positioned correctly

### Content Verification
- [ ] Legal language appropriate
- [ ] No Lorem ipsum
- [ ] Contact details accurate
- [ ] Company information correct
- [ ] Governing law specified
- [ ] Cookie usage described

---

## 9. Google Analytics & GTM Testing

### GTM Container
- [ ] Container loads (check Network tab)
- [ ] gtm.js script present
- [ ] Noscript iframe present
- [ ] Container ID correct: GTM-M97GN5T7
- [ ] dataLayer initialized
- [ ] Tags fire correctly

### Google Analytics 4
- [ ] gtag.js loads
- [ ] Measurement ID correct: G-6MX5G49Z0R
- [ ] Page views tracked
- [ ] Real-time data appears in GA4
- [ ] Events fire correctly
- [ ] User properties set

### Cookie Consent Integration
- [ ] Scripts don't load before consent
- [ ] Load after "Accept All"
- [ ] Don't load after "Reject"
- [ ] Consent mode updates
- [ ] Respects user preferences

### Custom Events
- [ ] Button clicks tracked
- [ ] Form submissions tracked
- [ ] Scroll depth tracked
- [ ] Link clicks tracked
- [ ] Custom events in dataLayer

### Testing Tools
- [ ] Chrome DevTools Network tab
- [ ] GTM Preview Mode
- [ ] GA4 DebugView
- [ ] Tag Assistant (browser extension)
- [ ] Console: `window.dataLayer`

### Verification
- [ ] Visit GA4 Real-time reports
- [ ] See active users
- [ ] Page views incrementing
- [ ] Events appearing
- [ ] User properties set

---

## 10. Cross-Browser Testing

### Chrome/Chromium
- [ ] All features work
- [ ] No console errors
- [ ] Smooth animations
- [ ] PWA install works
- [ ] Service worker registers

### Firefox
- [ ] Layout correct
- [ ] Glassmorphism effects
- [ ] CSS Grid/Flexbox
- [ ] Animations smooth
- [ ] No compatibility issues

### Safari (macOS)
- [ ] Webkit-specific features
- [ ] Backdrop-filter works
- [ ] Smooth scrolling
- [ ] Fixed positioning
- [ ] No layout issues

### Safari (iOS)
- [ ] Touch interactions
- [ ] Mobile menu
- [ ] Fixed header
- [ ] PWA installation
- [ ] Viewport sizing

### Edge
- [ ] Chromium-based features
- [ ] PWA install
- [ ] All functionality
- [ ] No specific issues

### Legacy Browsers
- [ ] Graceful degradation
- [ ] Core functionality works
- [ ] No JavaScript errors
- [ ] Polyfills loaded if needed

---

## 11. Performance Testing

### Lighthouse Audit
- [ ] Performance score >85
- [ ] Accessibility score >90
- [ ] Best Practices score >90
- [ ] SEO score >90
- [ ] PWA installable

### Core Web Vitals
- [ ] LCP (Largest Contentful Paint) <2.5s
- [ ] FID (First Input Delay) <100ms
- [ ] CLS (Cumulative Layout Shift) <0.1

### Bundle Size
- [ ] Total JS: 873.47 kB (gzipped: 256.03 kB)
- [ ] CSS: 49.26 kB (gzipped: 8.76 kB)
- [ ] Monitor for increases

### Loading Speed
- [ ] First paint <1s
- [ ] Time to interactive <3s
- [ ] Smooth animations (60fps)
- [ ] No janky scrolling

### Network
- [ ] Works on 3G
- [ ] Works on slow connections
- [ ] Progressive loading
- [ ] No blocking resources

---

## 12. Security Testing

### Content Security Policy
- [ ] Scripts from trusted sources only
- [ ] No inline scripts (except GTM)
- [ ] HTTPS only
- [ ] No mixed content

### External Links
- [ ] rel="noopener noreferrer"
- [ ] Target="_blank" secure
- [ ] No XSS vulnerabilities

### Form Security
- [ ] Input validation
- [ ] Sanitization applied
- [ ] CSRF protection
- [ ] SQL injection prevention (Supabase handles)

### Privacy
- [ ] No sensitive data in URLs
- [ ] Secure cookie handling
- [ ] localStorage encryption if needed
- [ ] GDPR compliance

---

## Testing Tools Checklist

### Browser DevTools
- [ ] Chrome DevTools
- [ ] Firefox Developer Tools
- [ ] Safari Web Inspector
- [ ] Edge DevTools

### Accessibility
- [ ] Lighthouse
- [ ] axe DevTools
- [ ] WAVE
- [ ] Screen reader (NVDA/VoiceOver)

### Responsive Testing
- [ ] Chrome device emulation
- [ ] BrowserStack
- [ ] Physical devices
- [ ] Responsinator

### Analytics
- [ ] Google Tag Manager Preview
- [ ] GA4 DebugView
- [ ] Tag Assistant
- [ ] Network tab monitoring

### Performance
- [ ] Lighthouse
- [ ] WebPageTest
- [ ] GTmetrix
- [ ] Chrome UX Report

---

## Bug Reporting Template

When issues found:

```
**Component:** [Component name]
**Browser:** [Browser and version]
**Device:** [Device type and screen size]
**Steps to Reproduce:**
1.
2.
3.

**Expected Behavior:**

**Actual Behavior:**

**Screenshots:**

**Console Errors:**

**Priority:** [High/Medium/Low]
```

---

## Sign-Off

Testing completed by: ___________________

Date: ___________________

All critical issues resolved: [ ] Yes [ ] No

Ready for production: [ ] Yes [ ] No

Notes:
