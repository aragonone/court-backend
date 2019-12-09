export function toDate(evmTimestamp) {
  const milliseconds = evmTimestamp.toString() * 1000
  const date = new Date(milliseconds)
  return date.toISOString().slice(0, 19).replace(/-/g, '/').replace('T', ' ') + ' UTC'
}
