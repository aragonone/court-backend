export default (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  console.error(err.stack)
  res.status(500).send('Something went wrong :(')
}
