import { isAddress } from 'web3-utils'

const sanitizeAddresses = object => {
  Object.keys(object).forEach(key => {
    if (!!object[key] && typeof object[key] === 'object') sanitizeAddresses(object[key])
    else if(isAddress(object[key])) object[key] = object[key].toLowerCase()
  })
}

export default () => (req, res, next) => {
  sanitizeAddresses(req.query)
  sanitizeAddresses(req.body)
  next()
}
