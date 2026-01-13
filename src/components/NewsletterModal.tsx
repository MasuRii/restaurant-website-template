import React, { useState, useEffect } from 'react';

interface NewsletterModalProps {
  strings: {
    title: string;
    description: string;
    emailPlaceholder: string;
    submit: string;
    noThanks: string;
    dontShowAgain: string;
    success: string;
  };
}

export const NewsletterModal: React.FC<NewsletterModalProps> = ({ strings }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    // Check localStorage
    if (localStorage.getItem('newsletter_dismissed')) {
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setIsVisible(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const closeModal = () => {
    setIsVisible(false);
    if (dontShowAgain) {
      localStorage.setItem('newsletter_dismissed', 'true');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      // Auto close after success
      setTimeout(() => {
        closeModal();
        localStorage.setItem('newsletter_dismissed', 'true');
      }, 3000);
    }, 1000);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-white dark:bg-charcoal p-8 rounded-lg shadow-xl animate-in zoom-in-95 duration-300 border border-gray-100 dark:border-gray-800">
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

        {submitted ? (
          <div className="text-center py-8">
             <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4 dark:bg-green-900/30">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
             </div>
             <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-2">Success!</h3>
             <p className="text-gray-600 dark:text-gray-300">{strings.success}</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2">{strings.title}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{strings.description}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="newsletter-email" className="sr-only">Email</label>
                <input
                  type="email"
                  id="newsletter-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={strings.emailPlaceholder}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-charcoal-dark dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full btn-primary"
              >
                {strings.submit}
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
               <button onClick={closeModal} className="w-full text-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-sm underline decoration-dotted mb-4">
                 {strings.noThanks}
               </button>
               
               <div className="flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    id="dont-show" 
                    checked={dontShowAgain} 
                    onChange={(e) => setDontShowAgain(e.target.checked)}
                    className="mr-2 rounded text-primary focus:ring-primary w-4 h-4 border-gray-300 dark:border-gray-600 dark:bg-charcoal-dark"
                  />
                  <label htmlFor="dont-show" className="text-xs text-gray-500 dark:text-gray-400 select-none cursor-pointer">
                    {strings.dontShowAgain}
                  </label>
               </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
