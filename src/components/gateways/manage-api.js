import axios from 'axios'

const HTTP = axios.create({
  baseURL: 'https://api.simbachain.com/v1-management/',
  headers: {
    'APIKEY': '9cc675b1dd3d51403975d547ba886273c9ab48a1e2297925dae9bf691570aaa3'
  }
})

export default {
  requestFund (name, data) {
    HTTP.defaults.headers.common['Content-Type'] = 'application/json'
    return HTTP.post(name, data)
  }
}
