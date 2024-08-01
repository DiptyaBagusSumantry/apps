import Vue from 'vue'

// axios
import axios from 'axios'

const headers = {
  accept: 'application/json',
  'accept-language': 'en_US,id',
}

const { timeZone } = Intl.DateTimeFormat().resolvedOptions()

if (timeZone) {
  headers['X-Time-Zone'] = timeZone
}

const axiosIns = axios.create({
  // You can add your headers here
  // ================================
  // baseURL: 'https://some-domain.com/api/',
  // timeout: 1000,
  headers,

  // Make Axios play nice with Django CSRF
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
  xhrFields: {
    withCredentials: true,
  },
})

Vue.prototype.$http = axiosIns

export default axiosIns
