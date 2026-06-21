import { useEffect, useRef, useCallback } from 'react';

interface UseModalCloseOptions {
  isOpen: boolean;
  onClose: () => void;
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
  closeOnScroll?: boolean;
  lockScroll?: boolean;
  trapFocus?: boolean;
}

export function useModalClose<T extends HTMLElement>({
  isOpen,
  onClose,
  closeOnOutsideClick = true,
  closeOnEscape = true,
  closeOnScroll = false,
  lockScroll = true,
  trapFocus = true,
}: UseModalCloseOptions) {
  const containerRef = useRef<T>(null);

  // Memoize onClose to prevent effect re-runs
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    // 1. Handle Escape Key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') {
        handleClose();
      }
    };

    // 2. Handle Click Outside
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (
        closeOnOutsideClick &&
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        handleClose();
      }
    };

    // 3. Handle Scroll (Optional)
    const handleScroll = () => {
      if (closeOnScroll) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    const mainEl = document.getElementById('main-scroll-container');
    if (mainEl && closeOnScroll) {
      mainEl.addEventListener('scroll', handleScroll, { passive: true });
    }

    // 4. Body Scroll Lock
    const originalOverflow = document.body.style.overflow;
    if (lockScroll) {
      document.body.style.overflow = 'hidden';
    }

    // 5. Focus Trap
    const element = containerRef.current;
    let originalActiveElement: HTMLElement | null = document.activeElement as HTMLElement;

    // Focus on the modal container or its first focusable element
    if (element && trapFocus) {
      const focusableSelector =
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const focusables = element.querySelectorAll<HTMLElement>(focusableSelector);

      if (focusables.length > 0) {
        focusables[0].focus();
      } else {
        element.focus();
      }
    }

    const handleFocusTrap = (e: KeyboardEvent) => {
      if (!trapFocus || !element || e.key !== 'Tab') return;

      const focusableSelector =
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const focusables = Array.from(
        element.querySelectorAll<HTMLElement>(focusableSelector)
      );

      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }

      const firstFocusable = focusables[0];
      const lastFocusable = focusables[focusableSelector.length - 1] || focusables[focusables.length - 1];
      const activeEl = document.activeElement;

      if (e.shiftKey) {
        // Shift + Tab: wrapping around to last element
        if (activeEl === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        // Tab: wrapping around to first element
        if (activeEl === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    };

    if (trapFocus) {
      document.addEventListener('keydown', handleFocusTrap);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      if (mainEl) {
        mainEl.removeEventListener('scroll', handleScroll);
      }
      if (lockScroll) {
        document.body.style.overflow = originalOverflow;
      }
      if (trapFocus) {
        document.removeEventListener('keydown', handleFocusTrap);
        if (originalActiveElement) {
          originalActiveElement.focus();
        }
      }
    };
  }, [
    isOpen,
    handleClose,
    closeOnOutsideClick,
    closeOnEscape,
    closeOnScroll,
    lockScroll,
    trapFocus,
  ]);

  return containerRef;
}
