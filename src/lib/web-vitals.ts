import { onCLS, onFCP, onLCP, onINP, onTTFB } from 'web-vitals';
import type { Metric } from 'web-vitals';

/**
 * Logs the metric to the console in development
 * In production, this would send data to an analytics endpoint
 */
function logMetric(metric: Metric) {
  // Use a distinct group for visibility in DevTools
  console.groupCollapsed(`[Web Vitals] ${metric.name}`);
  console.log('Value:', metric.value);
  console.log('Delta:', metric.delta);
  console.log('ID:', metric.id);
  console.log('Rating:', metric.rating);
  console.log('Entries:', metric.entries);
  console.groupEnd();
}

/**
 * Initialize Web Vitals monitoring
 */
export function initWebVitals() {
  // In a real app, you might want to sample this or only run in prod
  // For this template, we log in dev and could send to analytics in prod

  const isDev = import.meta.env.DEV;

  if (isDev) {
    onCLS(logMetric);
    onFCP(logMetric);
    onLCP(logMetric);
    onINP(logMetric);
    onTTFB(logMetric);
  }
}
