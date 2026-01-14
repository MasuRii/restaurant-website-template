// Placeholder for Sentry or other error tracking service
// Integration instructions:
// 1. Install Sentry: bun add @sentry/react @sentry/browser
// 2. Initialize in a new file or entry point
// 3. Replace console.error calls with Sentry.captureException

type ErrorLevel = 'info' | 'warning' | 'error';

/**
 * Captures an error and logs it to the console (and tracking service in future)
 * @param error The error object to capture
 * @param context Optional context object with additional details
 */
export function captureError(error: Error, context?: Record<string, unknown>): void {
  // In a real implementation, this would send to Sentry/LogRocket/etc.
  if (import.meta.env.DEV) {
    console.group('🚨 Error Captured');
    console.error(error);
    if (context) {
      console.log('Context:', context);
    }
    console.groupEnd();
  } else {
    // Production logging (placeholder)
    // Sentry.captureException(error, { extra: context });
    console.error('Error captured:', error.message);
  }
}

/**
 * Captures a log message
 * @param message The message string
 * @param level Log level (default: info)
 */
export function captureMessage(message: string, level: ErrorLevel = 'info'): void {
  if (import.meta.env.DEV) {
    const styles = {
      info: 'color: blue',
      warning: 'color: orange',
      error: 'color: red',
    };
    console.log(`%c[${level.toUpperCase()}] ${message}`, styles[level]);
  } else {
    // Sentry.captureMessage(message, level);
    if (level === 'error') console.error(message);
    else if (level === 'warning') console.warn(message);
    else console.log(message);
  }
}

/**
 * Initialize global error handlers
 */
export function initErrorTracking(): void {
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      captureError(event.error || new Error(event.message), {
        source: 'window.onerror',
        filename: event.filename,
        lineno: event.lineno,
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      captureError(event.reason instanceof Error ? event.reason : new Error(String(event.reason)), {
        source: 'unhandledrejection',
      });
    });
  }
}
