const chalk = require('chalk')

const DEFAULTS = {
  verbose: false,
  silent: true
}

class Logger {
  constructor(actor, actorColor = 'white') {
    this.actor = actor
    this.actorColor = actorColor
  }

  info(msg) {
    if (!DEFAULTS.verbose) return
    this.log(msg, '️  ', 'white')
  }

  success(msg) {
    this.log(msg, '✅', 'green')
  }

  warn(msg) {
    this.log(msg, '⚠️ ', 'yellow')
  }

  error(msg) {
    this.log(msg, '🚨', 'red')
  }

  log(msg, emoji, color = 'white') {
    if (DEFAULTS.silent) return
    const padding = 15 - this.actor.length
    let formattedMessage = chalk.keyword(color)(`${emoji}  ${this._stringify(msg)}`)
    if (DEFAULTS.verbose) {
      const formatedPrefix = chalk.keyword(this.actorColor)(`[${this.actor}]`)
      formattedMessage = `${formatedPrefix}${' '.repeat(padding)}${formattedMessage}`
    }
    console.error(formattedMessage)
  }

  _stringify(obj) {
    return (typeof obj === 'object') ? JSON.stringify(obj) : obj.toString()
  }
}

module.exports = (actor, actorColor) => new Logger(actor, actorColor)

module.exports.setDefaults = (silent, verbose) => {
  DEFAULTS.silent = silent
  DEFAULTS.verbose = verbose
}
