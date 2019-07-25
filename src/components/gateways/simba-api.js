import axios from 'axios'

const HTTP = axios.create({
  baseURL: 'https://api.simbachain.com/v1/house_records1/',
  headers: {
    'APIKEY': '3739a6bcd387713ce001e4c8737e53e7a2d3d7573e102711f8876c9cf82966e6'
  }
})

export default {
  getData (name) {
    HTTP.defaults.headers.common['Content-Type'] = 'multipart/form-data'
    return HTTP.get(name)
  },
  postData (name, data) {
    HTTP.defaults.headers.common['Content-Type'] = 'multipart/form-data'
    return HTTP.post(name, data)
  },
  signTxn (name, data) {
    HTTP.defaults.headers.common['Content-Type'] = 'application/json'
    return HTTP.post(name, data)
  }
}
