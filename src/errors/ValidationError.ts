/**
 * Custom error class for validation-related errors.
 * Extends the built-in Error class.
 * @class
 * @extends {Error}
 */
export class ValidationError extends Error {
  constructor(message = `A validation error occurred`) {
    super(message)
    this.message = message
  }
}
