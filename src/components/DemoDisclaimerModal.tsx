import React, { useState, useEffect } from 'react';

interface DemoDisclaimerModalProps {
  strings: {
    title: string;
    description: string;
    iUnderstand: string;
    dontShowAgain: string;
  };
}

export const DemoDisclaimerModal: React.FC<DemoDisclaimerModalProps> = ({ strings }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    // Check localStorage for global dismissal
    const isDismissed = localStorage.getItem('demo_disclaimer_dismissed') === 'true';
    if (isDismissed) return;

    const handleLinkClick = (e: MouseEvent) => {
      // Find the closest anchor tag
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href) return;

      // Logic to determine if we should intercept
      let shouldIntercept = false;

      // 1. External links (http/https and different hostname)
      if (href.startsWith('http')) {
        try {
          const url = new URL(href);
          if (url.hostname !== window.location.hostname) {
            shouldIntercept = true;
          }
        } catch (err) {
          // Invalid URL, ignore
        }
      }

      // 2. Protocol links (mailto:, tel:)
      if (href.startsWith('mailto:') || href.startsWith('tel:')) {
        shouldIntercept = true;
      }

      // 3. Explicit placeholders (href="#") - optional, but good for demo
      // if (href === '#') { shouldIntercept = true; } 
      // Note: internal anchors like #menu are fine, so be careful with #

      // Check if it's an internal anchor
      if (href.startsWith('#') || href.startsWith('/')) {
        shouldIntercept = false;
      }

      // Special case: Google Maps links might be external
      if (href.includes('maps.google.com') || href.includes('goo.gl')) {
        shouldIntercept = true;
      }

      // Check if user has dismissed (re-check in case it changed in another tab/session)
      if (localStorage.getItem('demo_disclaimer_dismissed') === 'true') {
        shouldIntercept = false;
      }

      if (shouldIntercept) {
        e.preventDefault();
        e.stopPropagation();
        setIsVisible(true);
      }
    };

    document.addEventListener('click', handleLinkClick, true); // Capture phase to ensure we intercept early

    return () => {
      document.removeEventListener('click', handleLinkClick, true);
    };
  }, []);

  const closeModal = () => {
    setIsVisible(false);
    if (dontShowAgain) {
      localStorage.setItem('demo_disclaimer_dismissed', 'true');
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        closeModal();
      }
      // Basic focus trap
      if (e.key === 'Tab' && isVisible) {
         const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
         const modal = document.querySelector('[role="dialog"][aria-modal="true"]');
         if (modal) {
            const firstElement = modal.querySelectorAll(focusableElements)[0] as HTMLElement;
            const focusableContent = modal.querySelectorAll(focusableElements);
            const lastElement = focusableContent[focusableContent.length - 1] as HTMLElement;

            if (e.shiftKey) { // if shift key pressed for shift + tab combination
              if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
              }
            } else { // if tab key is pressed
              if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
              }
            }
         }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-md bg-white dark:bg-charcoal p-8 rounded-lg shadow-xl animate-in zoom-in-95 duration-300 border border-gray-100 dark:border-gray-800"
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-modal-title"
      >
        <button 
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary rounded-sm"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          
          <h2 id="demo-modal-title" className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-3">
            {strings.title}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed text-sm">
            {strings.description}
          </p>

          <button
            onClick={closeModal}
            className="w-full btn-primary py-3 mb-4"
          >
            {strings.iUnderstand}
          </button>

          <div className="flex items-center justify-center">
            <input 
              type="checkbox" 
              id="dont-show-demo" 
              checked={dontShowAgain} 
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="mr-2 rounded text-primary focus:ring-primary w-4 h-4 border-gray-300 dark:border-gray-600 dark:bg-charcoal-dark"
            />
            <label htmlFor="dont-show-demo" className="text-xs text-gray-500 dark:text-gray-400 select-none cursor-pointer">
              {strings.dontShowAgain}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
