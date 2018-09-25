'use strict'

import Vue from 'vue'
import axios from 'axios'
import Qs from 'qs'
import auth from './../services/auth'
import store from './../store'
import router from './../router'
import { API_URL, CLIENT_ID, CLIENT_SECRET, TOKEN_URL } from '../config/constants'

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  baseURL: API_URL,
  paramsSerializer: function (params) {
    return Qs.stringify(params, { indices: false })
  }
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
}

export const HTTP = axios.create(config)
Vue.prototype.$http = HTTP
// Add a response interceptor
HTTP.interceptors.request.use(request => {
  let token
  if (localStorage.getItem('id_token')) {
    token = JSON.parse(localStorage.getItem('id_token')).access_token
    request.headers.Authorization = `Bearer ${token}`
    return request
  } else {
    return request
  }
})

HTTP.interceptors.response.use(null, (error) => {
  if (error.config && error.response && error.response.status === 401) {
    const token = (auth._getToken() || {}).refresh_token
    if (!token) {
      localStorage.removeItem('id_token')
      router.push({ name: 'login' })

      // store.dispatch('LOGOUT')
      return Promise.reject(error)
    }
    const params = {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: token
    }
    return HTTP.post(TOKEN_URL, params)
      .then(result => {
        auth._setToken(result.data)
        return HTTP.request(error.config)
      })
      .catch(errorResponse => {
        if (auth._isInvalidToken(errorResponse) || errorResponse.response.status === 400) {
          // store.dispatch('LOGOUT')
          localStorage.removeItem('id_token')
          router.push({ name: 'login' })
        }
        return errorResponse
      })
  } else if (error.response && error.response.status === 403) {
    store.dispatch('ERROR_NO_ACCESS', error.response)
  }
  // } else {
  //   if (error.response === undefined && (error.message === 'Network Error') && servers.length > 1) {
  //     if (!error.config['_retry']) {
  //       error.config['_retry'] = true
  //       let server = parseInt(localStorage.getItem('server') || 0)
  //       let nextServer = (server + 1) % servers.length
  //       error.config.baseURL = servers[nextServer]
  //       if (error.config.url.substr(0, HTTP.defaults.baseURL.length) === HTTP.defaults.baseURL) {
  //         error.config.url = error.config.baseURL + error.config.url.substr(HTTP.defaults.baseURL.length)
  //       }
  //       HTTP.defaults.baseURL = error.config.baseURL
  //       localStorage.setItem('server', nextServer)
  //       return HTTP.request(error.config)
  //     }
  //   }
  // }

  return Promise.reject(error)
})

export default HTTP
