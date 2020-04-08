export default class HttpError extends Error {
  static _400(content) {
    return new this(400, content)
  }

  static _403(content) {
    return new this(403, content)
  }

  static _404(content) {
    return new this(404, content)
  }

  constructor(code, content) {
    super(`HTTP error ${code}`)
    this.code = code
    this.content = content
  }
}
