import axios from 'axios'

const HTTP = axios.create({
  baseURL: 'https://api.simbachain.com/v1/house_records/',
  headers: {
    'APIKEY': '4843349ae62115203f97415679643d93e9c2eb7ed7d8c07103a9c4eb9a5e38ce'
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
