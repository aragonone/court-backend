import axios from 'axios'
import token from '../store/token'

const SERVER_URL = process.env.REACT_APP_SERVER_URL

const Server = {
  get(path) {
    return axios.get(`${SERVER_URL}/${path}`, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Authorization': token.get()
      }
    })
  },

  post(path, body = {}) {
    return axios.post(`${SERVER_URL}/${path}`, body, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Authorization': token.get()
      }
    })
  },
}

export default Server
