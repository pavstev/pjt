/**
 * Validation utility functions
 */

/**
 * Validate an email address
 * @param email - The email to validate
 * @returns True if valid email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate a file path
 * @param path - The path to validate
 * @returns True if valid path
 */
export const validatePath = (path: string): boolean => {
  return typeof path === "string" && path.length > 0 && !path.includes("..");
};
