import axios from 'axios'

const HTTP = axios.create({
  baseURL: 'https://api.simbachain.com/v1-management/',
  headers: {
    'APIKEY': '040edae827d7cc0ce1916c01b43c4e5991db3ac3fdfb474f20dadbd71387648f'
  }
})

export default {
  requestFund (name, data) {
    HTTP.defaults.headers.common['Content-Type'] = 'application/json'
    return HTTP.post(name, data)
  }
}
