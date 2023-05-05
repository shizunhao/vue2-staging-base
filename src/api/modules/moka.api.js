export default ({ request }) => ({
  SYS_USER_LOGIN(data) {
    return request({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      url: '/oauth/token?client_id=' + data.client_id + '&client_secret=' + data.client_secret + '&grant_type=' + data.grant_type,
      method: 'post',
      data: `username=${data.username}&password=${encodeURIComponent(data.password)}`
    })
  },
  loginOtherSave(data) {
    return request({
      url: 'hr/core/base/open/mokaSign/save',
      method: 'post',
      data
    })
  },
  loginOtherToken(data) {
    return request({
      url: 'hr/core/base/open/mokaSign/token',
      method: 'post',
      data
    })
  }

})
