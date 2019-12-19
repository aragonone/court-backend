export default class BaseValidator {
  constructor() {
    this.errors = []
  }

  addError(message) {
    this.errors.push(message)
  }

  resetErrors() {
    const errors = this.errors
    this.errors = []
    return errors
  }
}
