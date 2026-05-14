
/**
 * Simple sanitization utility to prevent basic XSS and HTML injection.
 */
export const sanitizeInput = (val: string): string => {
  if (typeof val !== 'string') return val;
  return val.replace(/[<>]/g, '');
};
