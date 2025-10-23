# WCAG 2.1 AA Accessibility Implementation Guide

This document provides comprehensive implementation details for the accessibility enhancements made to achieve WCAG 2.1 AA compliance.

## Table of Contents

1. [Skip-to-Main-Content Link](#1-skip-to-main-content-link)
2. [Live Regions](#2-live-regions)
3. [Modal Focus Management](#3-modal-focus-management)
4. [Enhanced Error Messaging](#4-enhanced-error-messaging)
5. [Search Functionality](#5-search-functionality)
6. [Testing Recommendations](#6-testing-recommendations)

---

## 1. Skip-to-Main-Content Link

### Implementation

**Component:** `src/components/SkipLink.tsx`

The skip link appears at the very top of the page and allows keyboard users to bypass navigation and jump directly to the main content.

### HTML Code Example

```tsx
<SkipLink href="#main-content" />
```

### CSS Styling

The skip link is visually hidden by default but becomes visible when focused:

```css
/* Applied via Tailwind classes */
.sr-only /* Screen reader only */
.focus:not-sr-only /* Visible on focus */
.fixed.top-4.left-4.z-[9999] /* Positioning */
.bg-primary.text-primary-foreground /* High contrast colors */
.focus:ring-4.focus:ring-primary/50 /* Clear focus indicator */
```

### Accessibility Benefits

- **WCAG 2.4.1 (Bypass Blocks):** Allows keyboard users to skip repetitive navigation
- **Keyboard Navigation:** First focusable element when pressing Tab
- **High Contrast:** Uses primary colors for visibility
- **Focus Indicator:** 4px ring with sufficient contrast ratio (>3:1)

### Testing Recommendations

1. **Keyboard Test:** Press Tab - skip link should be the first visible element
2. **Navigation Test:** Press Enter on skip link - focus moves to main content
3. **Visual Test:** Verify skip link has high contrast colors (ratio ≥ 4.5:1)
4. **Screen Reader Test:** Verify link is announced with appropriate label

### Common Pitfalls to Avoid

- ❌ Using `display: none` instead of `.sr-only` (prevents keyboard access)
- ❌ Setting z-index too low (link appears behind other elements)
- ❌ Missing focus indicator (users can't see where focus is)
- ❌ Linking to non-existent ID (navigation fails silently)

---

## 2. Live Regions

### Implementation

**Context:** `src/contexts/LiveRegionContext.tsx`
**Hook:** `src/hooks/useAnnouncement.ts`

Live regions announce dynamic content changes to screen readers without moving focus.

### HTML Code Example

```tsx
// Provider setup
<LiveRegionProvider>
  <App />
</LiveRegionProvider>

// Usage in components
const { announce } = useAnnouncement();
announce("Message sent successfully!", "polite");
```

### ARIA Attributes

```html
<!-- Polite announcements (non-urgent) -->
<div role="status" aria-live="polite" aria-atomic="true" class="sr-only">
  {politeMessage}
</div>

<!-- Assertive announcements (urgent) -->
<div role="alert" aria-live="assertive" aria-atomic="true" class="sr-only">
  {assertiveMessage}
</div>
```

### JavaScript Implementation

```typescript
const announce = useCallback((message: string, priority: AnnouncementPriority = 'polite') => {
  if (priority === 'assertive') {
    setAssertiveMessage('');
    setTimeout(() => setAssertiveMessage(message), 100);
  } else {
    setPoliteMessage('');
    setTimeout(() => setPoliteMessage(message), 100);
  }

  // Auto-clear after 3 seconds
  setTimeout(() => {
    if (priority === 'assertive') {
      setAssertiveMessage('');
    } else {
      setPoliteMessage('');
    }
  }, 3000);
}, []);
```

### Accessibility Benefits

- **WCAG 4.1.3 (Status Messages):** Dynamic content changes are announced
- **Non-Intrusive:** Doesn't interrupt current screen reader activity (polite mode)
- **Urgent Alerts:** Interrupts for critical messages (assertive mode)
- **Automatic Cleanup:** Prevents announcement queue buildup

### Testing Recommendations

1. **Screen Reader Test:** Enable NVDA/JAWS and verify announcements
2. **Timing Test:** Verify messages clear after 3 seconds
3. **Priority Test:** Assertive messages should interrupt current reading
4. **Multiple Announcements:** Test rapid successive announcements

### Common Pitfalls to Avoid

- ❌ Not clearing previous message before setting new one (may not announce)
- ❌ Using both `role` and `aria-live` on same element (redundant)
- ❌ Overusing assertive mode (interrupts too frequently)
- ❌ Making live region visible (should be screen reader only)

---

## 3. Modal Focus Management

### Implementation

**Component:** `src/components/ui/dialog.tsx`
**Hooks:** `src/hooks/useFocusTrap.ts`, `src/hooks/useFocusReturn.ts`

Ensures proper focus handling when modals open and close.

### HTML Code Example

```tsx
<DialogContent aria-modal="true" role="dialog" aria-labelledby="dialog-title">
  <DialogTitle id="dialog-title">Dialog Title</DialogTitle>
  <DialogDescription>Dialog content here</DialogDescription>
  <DialogClose aria-label="Close dialog">
    <X aria-hidden="true" />
    <span className="sr-only">Close</span>
  </DialogClose>
</DialogContent>
```

### Focus Management JavaScript

```typescript
// Focus trap implementation
export function useFocusTrap(isActive: boolean = true) {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isActive || !elementRef.current) return;

    const element = elementRef.current;
    const handleKeyDown = (event: KeyboardEvent) => {
      trapFocusInElement(element, event);
    };

    element.addEventListener('keydown', handleKeyDown);
    return () => element.removeEventListener('keydown', handleKeyDown);
  }, [isActive]);

  return elementRef;
}

// Focus restoration
export function useFocusReturn(isOpen: boolean) {
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
    } else if (previousActiveElement.current) {
      previousActiveElement.current.focus();
      previousActiveElement.current = null;
    }
  }, [isOpen]);
}
```

### Accessibility Benefits

- **WCAG 2.4.3 (Focus Order):** Logical tab order maintained
- **Focus Trapping:** Tab cycles through modal elements only
- **Focus Restoration:** Returns to trigger element on close
- **Escape Key:** Closes modal and restores focus

### Testing Recommendations

1. **Tab Navigation:** Verify Tab cycles through modal elements only
2. **Shift+Tab:** Verify reverse tab order works correctly
3. **Escape Key:** Verify modal closes and focus returns
4. **Initial Focus:** First interactive element receives focus on open
5. **Close Button:** Focus moves to trigger element after closing

### Common Pitfalls to Avoid

- ❌ Not setting initial focus (keyboard users lost)
- ❌ Allowing Tab to escape modal (breaks focus trap)
- ❌ Not restoring focus on close (disorienting for keyboard users)
- ❌ Missing Escape key handler (standard modal behavior)

---

## 4. Enhanced Error Messaging

### Implementation

**Component:** `src/components/ErrorMessage.tsx`

Provides comprehensive error messages with live region announcements and proper ARIA attributes.

### HTML Code Example

```tsx
{/* Individual field error */}
<Input
  id="email"
  type="email"
  aria-required="true"
  aria-invalid={!!errors.email}
  aria-describedby={errors.email ? "email-error" : undefined}
/>
<ErrorMessage id="email-error" error={errors.email} />

{/* Form error summary */}
<FormErrorSummary
  errors={errors}
  title="Please correct the following errors:"
/>
```

### ARIA Attributes

```html
<!-- Field with error -->
<input
  aria-required="true"
  aria-invalid="true"
  aria-describedby="field-error"
/>

<!-- Error message -->
<p id="field-error" role="alert" aria-live="assertive">
  <AlertCircle aria-hidden="true" />
  <span>Email is required</span>
</p>
```

### JavaScript Implementation

```typescript
export function ErrorMessage({ id, error, announce = true, icon = true }: ErrorMessageProps) {
  const { announce: announceToSR } = useAnnouncement();
  const previousError = useRef<string>();

  useEffect(() => {
    if (error && announce && error !== previousError.current) {
      announceToSR(`Error: ${error}`, 'assertive');
      previousError.current = error;
    }
  }, [error, announce, announceToSR]);

  if (!error) return null;

  return (
    <p id={id} role="alert" aria-live="assertive">
      {icon && <AlertCircle aria-hidden="true" />}
      <span>{error}</span>
    </p>
  );
}
```

### Accessibility Benefits

- **WCAG 3.3.1 (Error Identification):** Errors clearly identified
- **WCAG 3.3.3 (Error Suggestion):** Descriptive error messages
- **WCAG 4.1.3 (Status Messages):** Errors announced to screen readers
- **Visual + Audio:** Multiple modalities for error communication

### Testing Recommendations

1. **Screen Reader:** Verify errors are announced immediately
2. **Visual Contrast:** Error text meets 4.5:1 contrast ratio
3. **Icon Test:** Verify icon is decorative (aria-hidden)
4. **Clear Errors:** Test that errors clear when corrected
5. **Error Summary:** Verify summary appears at top of form

### Common Pitfalls to Avoid

- ❌ Generic error messages ("Error occurred")
- ❌ Not linking error to field (missing aria-describedby)
- ❌ Not setting aria-invalid (screen readers miss error state)
- ❌ Icons without aria-hidden (redundant announcements)

---

## 5. Search Functionality

### Implementation

**Component:** `src/components/SearchBar.tsx`

Provides accessible search with proper semantic markup and keyboard shortcuts.

### HTML Code Example

```tsx
<div role="search">
  <form onSubmit={handleSubmit}>
    <Input
      type="search"
      aria-label="Search"
      aria-describedby="search-shortcut"
    />
    <kbd id="search-shortcut" aria-label="Keyboard shortcut: Command K">
      ⌘K
    </kbd>
  </form>
</div>

<SearchResults
  results={results}
  query={query}
  isLoading={isLoading}
  role="region"
  aria-live="polite"
  aria-label="Search results"
/>
```

### JavaScript Implementation

```typescript
export function SearchBar({ onSearch, placeholder, showShortcut }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const { announce } = useAnnouncement();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch?.(query);
      announce(`Searching for ${query}`, 'polite');
    }
  };

  return (
    <div role="search">
      {/* Search input */}
    </div>
  );
}
```

### Accessibility Benefits

- **WCAG 1.3.1 (Info and Relationships):** Semantic `role="search"`
- **Keyboard Shortcuts:** ⌘K/Ctrl+K for power users
- **Result Announcements:** Screen readers announce result count
- **Loading States:** Users informed of async operations

### Testing Recommendations

1. **Semantic Test:** Verify `role="search"` is present
2. **Keyboard Shortcut:** Test ⌘K/Ctrl+K focuses search
3. **Screen Reader:** Verify result count is announced
4. **Clear Button:** Test accessible clear functionality
5. **Loading State:** Verify "Searching..." is announced

### Common Pitfalls to Avoid

- ❌ Missing `role="search"` landmark
- ❌ Not announcing result count
- ❌ Keyboard shortcut conflicts with browser
- ❌ Clear button without accessible label

---

## 6. Testing Recommendations

### Automated Testing Tools

1. **axe DevTools:** Browser extension for automated testing
2. **WAVE:** Web accessibility evaluation tool
3. **Lighthouse:** Built into Chrome DevTools
4. **Pa11y:** Command-line accessibility testing

### Manual Testing Checklist

#### Keyboard Navigation
- [ ] All interactive elements reachable via Tab
- [ ] Skip link is first focusable element
- [ ] Tab order is logical and intuitive
- [ ] Focus indicators visible (4px outline, 3:1 contrast)
- [ ] No keyboard traps
- [ ] Escape closes modals

#### Screen Reader Testing

**NVDA (Windows - Free)**
- [ ] Live regions announce changes
- [ ] Form errors announced
- [ ] Modal dialogs announced properly
- [ ] Landmarks identified (search, main, etc.)

**JAWS (Windows - Commercial)**
- [ ] All NVDA tests
- [ ] Virtual cursor mode works correctly

**VoiceOver (macOS - Built-in)**
- [ ] Rotor navigation works (⌘+U)
- [ ] All interactive elements announced

#### Color Contrast
- [ ] All text meets 4.5:1 contrast ratio
- [ ] Large text (18pt+) meets 3:1 contrast ratio
- [ ] Focus indicators meet 3:1 contrast ratio
- [ ] Error messages highly visible

#### Form Validation
- [ ] Required fields marked with aria-required
- [ ] Errors linked to fields via aria-describedby
- [ ] Error summary at top of form
- [ ] Success messages announced

### Browser Testing Matrix

| Browser | Version | Screen Reader |
|---------|---------|---------------|
| Chrome  | Latest  | NVDA         |
| Firefox | Latest  | NVDA         |
| Safari  | Latest  | VoiceOver    |
| Edge    | Latest  | JAWS         |

### Common Issues and Solutions

#### Issue: Skip link not working
**Solution:** Verify target ID exists: `<main id="main-content">`

#### Issue: Live regions not announcing
**Solution:** Clear message before setting new one (triggers change detection)

#### Issue: Focus trap escaping
**Solution:** Query all focusable elements including `[tabindex]:not([tabindex="-1"])`

#### Issue: Errors not announced
**Solution:** Use `role="alert"` AND `aria-live="assertive"`

---

## Compliance Checklist

### WCAG 2.1 Level AA Success Criteria

- [x] **1.3.1 Info and Relationships:** Semantic HTML, ARIA roles
- [x] **1.4.3 Contrast (Minimum):** 4.5:1 text, 3:1 UI components
- [x] **2.1.1 Keyboard:** All functionality via keyboard
- [x] **2.1.2 No Keyboard Trap:** Users can navigate away
- [x] **2.4.1 Bypass Blocks:** Skip link implemented
- [x] **2.4.3 Focus Order:** Logical tab order
- [x] **2.4.7 Focus Visible:** Clear focus indicators
- [x] **3.3.1 Error Identification:** Errors clearly marked
- [x] **3.3.2 Labels or Instructions:** All inputs labeled
- [x] **3.3.3 Error Suggestion:** Descriptive error messages
- [x] **4.1.2 Name, Role, Value:** All interactive elements identified
- [x] **4.1.3 Status Messages:** Live regions for dynamic content

---

## Resources

### Documentation
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

### Testing Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [NVDA Screen Reader](https://www.nvaccess.org/)

### Further Reading
- [Inclusive Components](https://inclusive-components.design/)
- [A11y Project](https://www.a11yproject.com/)
- [WebAIM](https://webaim.org/)

---

## Maintenance

### Ongoing Responsibilities

1. **Code Reviews:** Check accessibility in all new features
2. **Testing:** Run automated tests in CI/CD pipeline
3. **Updates:** Keep ARIA patterns current with spec changes
4. **Training:** Educate team on accessibility best practices
5. **Audits:** Quarterly manual accessibility audits

### Version History

- **v1.0.0** (2025-10-23): Initial WCAG 2.1 AA implementation
  - Skip-to-main-content link
  - Live region context
  - Enhanced modal focus management
  - Form error handling with announcements
  - Search component with semantic markup
