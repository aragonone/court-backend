import sanitizeAddressMiddleware from './sanitize-address-middleware'

export default fn => (req, res, next) => {
  sanitizeAddressMiddleware(req)
  Promise.resolve(fn(req, res, next)).catch(next)
}
