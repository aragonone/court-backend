export function summarize(text, initial = 5, final = 3) {
  if (!text) return
  const start = text.slice(0, initial)
  const end = text.slice(text.length - final, text.length)
  return `${start}..${end}`
}
