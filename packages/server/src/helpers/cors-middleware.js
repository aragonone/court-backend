import cors from 'cors'

const CORST_OPTIONS = {
  credentials: true,
  origin: function (origin, callback) {
    const whitelist = process.env.CORS_WHITELIST.split(',')
    console.log(origin)
    if (whitelist.indexOf(origin) !== -1 || whitelist[0] == '*') callback(null, true)
    else callback(new Error(`Origin '${origin}' not allowed by CORS`))
  }
}

export default cors(CORST_OPTIONS)
