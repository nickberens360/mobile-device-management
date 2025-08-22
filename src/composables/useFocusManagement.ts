import { ref, nextTick } from 'vue';

export function useFocusManagement() {
  const previousFocus = ref<HTMLElement | null>(null);

  const trapFocus = (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], input[type="submit"], select, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      } else if (e.key === 'Escape') {
        // Allow escape to be handled by parent components
        return;
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  };

  const saveFocus = () => {
    previousFocus.value = document.activeElement as HTMLElement;
  };

  const restoreFocus = () => {
    nextTick(() => {
      if (previousFocus.value) {
        previousFocus.value.focus();
        previousFocus.value = null;
      }
    });
  };

  const focusFirstElement = (container: HTMLElement) => {
    nextTick(() => {
      const firstFocusable = container.querySelector(
        'input:not([disabled]), button:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
      ) as HTMLElement;
      
      if (firstFocusable) {
        firstFocusable.focus();
      }
    });
  };

  const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.getElementById('announcements');
    if (announcement) {
      announcement.setAttribute('aria-live', priority);
      announcement.textContent = message;
      
      // Clear after a delay
      setTimeout(() => {
        announcement.textContent = '';
      }, 1000);
    }
  };

  return {
    trapFocus,
    saveFocus,
    restoreFocus,
    focusFirstElement,
    announceToScreenReader
  };
}