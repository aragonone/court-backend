import HttpError from '../errors/http-error'

export default () => (req, res, next) => {
  throw HttpError._404({ error: 'Not found' })
}
