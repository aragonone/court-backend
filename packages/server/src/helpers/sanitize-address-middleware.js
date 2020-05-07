import { isAddress } from 'web3-utils'

const sanitizeAddresses = object => {
  Object.entries(object).forEach(([key, value]) => {
    if (typeof value === 'object') sanitizeAddresses(value)
    else if(isAddress(value)) object[key] = value.toLowerCase()
  })
}

export default req => {
  sanitizeAddresses(req.query)
  sanitizeAddresses(req.params)
  sanitizeAddresses(req.body)
}
