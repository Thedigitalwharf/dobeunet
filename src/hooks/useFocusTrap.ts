import { useEffect, useRef } from 'react';
import { trapFocusInElement } from '@/utils/a11y';

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
