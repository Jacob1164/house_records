import axios from 'axios'

const HTTP = axios.create({
  baseURL: 'api.simbachain.com/v1/container_local',
  headers: {
    'APIKEY': 'aa3b9fb889811d93aff9850939c1cca151bb59b8a5e05fd5fe0e788d13c73046'
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
