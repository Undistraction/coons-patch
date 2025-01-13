export class ValidationError extends Error {
  constructor(message = `A validation error occurred`) {
    super(message)
    this.message = message
  }
}
