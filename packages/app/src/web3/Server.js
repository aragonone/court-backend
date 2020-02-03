import axios from 'axios'

const SERVER_URL = process.env.REACT_APP_SERVER_URL

const Server = {
  get(path) {
    return axios.get(`${SERVER_URL}/${path}`, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      }
    })
  },

  post(path, body = {}) {
    return axios.post(`${SERVER_URL}/${path}`, body, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      }
    })
  },
}

export default Server
