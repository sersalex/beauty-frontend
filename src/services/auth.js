let checkAuth = () => {
  if (localStorage.getItem('id_token')) {
    return true
  } else {
    return false
  }
}

let _setToken = data => {
  if (data['expires_in']) {
    data['expires_at'] = +new Date() + data['expires_in'] * 1000
  }
  localStorage.setItem('id_token', JSON.stringify(data))
}

let _getToken = () => {
  return JSON.parse(localStorage.getItem('id_token'))
}

let _isInvalidToken = err => {
  let status = err.response.status
  let error = err.response.data.error
  return status === 401 && error === 'Access token has expired'
}

let _isInvalidGrant = response => {
  const status = response.status
  const error = response.data.error
  return (status === 400 || status === 401) && error.type === 'invalid_grant'
}

let _getLoadOptions = (query, limit) => {
  let result = { headers: {}, params: {} }
  if (query) {
    result['params'] = Object.assign({}, query)
  }
  if (!query.status) {
    result['params']['status'] = '1'
  }
  result['params']['limit'] = limit
  return result
}
export default {
  _setToken,
  checkAuth,
  _isInvalidGrant,
  _isInvalidToken,
  _getLoadOptions,
  _getToken
}
