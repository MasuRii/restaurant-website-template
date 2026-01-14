export const trackPageView = (url: string) => {
  console.log(`[Analytics] Page View: ${url}`);
  // TODO: GA4 Integration
  // window.gtag('config', import.meta.env.PUBLIC_GA_ID, { page_path: url });
};

export const trackEvent = (category: string, action: string, label?: string) => {
  console.log(`[Analytics] Event: ${category} - ${action} ${label ? `(${label})` : ''}`);
  // TODO: GA4 Integration
  // window.gtag('event', action, { event_category: category, event_label: label });
};

export const trackReservation = () => {
  console.log('[Analytics] Conversion: Reservation Submitted');
  trackEvent('Conversion', 'Submit', 'Reservation');
};
