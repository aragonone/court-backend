import Network from '../web3/Network'

const Token = {
  id() {
    return `court-backend-${Network.getNetworkName()}-server-token`
  },

  exists() {
    return !!this.get()
  },

  get() {
    return localStorage.getItem(this.id())
  },

  set(value) {
    return localStorage.setItem(this.id(), value)
  },

  revoke() {
    return localStorage.removeItem(this.id())
  }
}

export default Token
