/**
 * Simple error handling - no complex error classes needed
 */

export const createCliError = (
  message: string,
  options?: { cause?: unknown },
) => {
  const error = new Error(message);
  if (options?.cause) {
    error.cause = options.cause;
  }
  error.name = "CliError";
  return error;
};
