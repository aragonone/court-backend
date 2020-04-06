import axios from 'axios'

const SERVER_URL = process.env.REACT_APP_SERVER_URL

const Server = {
  get(path) {
    return axios.get(`${SERVER_URL}/${path}`, {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      }
    })
  },

  post(path, body = {}) {
    return axios.post(`${SERVER_URL}/${path}`, body, {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      }
    })
  },
}

export default Server
