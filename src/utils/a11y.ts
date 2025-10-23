let idCounter = 0;

export function generateId(prefix: string = 'a11y'): string {
  return `${prefix}-${++idCounter}-${Date.now()}`;
}

export function createAriaDescribedBy(...ids: (string | undefined)[]): string | undefined {
  const validIds = ids.filter(Boolean);
  return validIds.length > 0 ? validIds.join(' ') : undefined;
}

export function getAriaInvalid(hasError: boolean): boolean | undefined {
  return hasError ? true : undefined;
}

export function createAriaLabelledBy(...ids: (string | undefined)[]): string | undefined {
  const validIds = ids.filter(Boolean);
  return validIds.length > 0 ? validIds.join(' ') : undefined;
}

export function handleEscapeKey(callback: () => void) {
  return (event: KeyboardEvent | React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      callback();
    }
  };
}

export function handleEnterKey(callback: () => void) {
  return (event: KeyboardEvent | React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      callback();
    }
  };
}

export function trapFocusInElement(element: HTMLElement, event: KeyboardEvent) {
  if (event.key !== 'Tab') return;

  const focusableElements = element.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement?.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement?.focus();
  }
}

export const FOCUS_VISIBLE_CLASSES = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2';

export const SR_ONLY_CLASSES = 'sr-only';
