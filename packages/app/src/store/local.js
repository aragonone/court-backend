import Network from '../web3/Network'

const Local = {
  existsAdmin() {
    return !!this.getAdmin()
  },

  getAdmin() {
    return this._get('admin')
  },

  setAdmin(value) {
    return this._set('admin', value)
  },

  unsetAdmin() {
    return this._remove('admin')
  },

  _get(key) {
    return localStorage.getItem(this._id(key))
  },

  _set(key, value) {
    return localStorage.setItem(this._id(key), value)
  },

  _remove(key) {
    return localStorage.removeItem(this._id(key))
  },

  _id(key) {
    return `court-backend-${Network.getNetworkName()}-server-${key}`
  },
}

export default Local
