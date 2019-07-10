import axios from 'axios'

const HTTP = axios.create({
  baseURL: 'https://api.simbachain.com/v1-management/',
  headers: {
    'APIKEY': '939d14c858c238a15dca900ceed08b6b7be8e1e621fe17bfdee86d54389510c0'
  }
})

export default {
  requestFund (name, data) {
    HTTP.defaults.headers.common['Content-Type'] = 'application/json'
    return HTTP.post(name, data)
  }
}
