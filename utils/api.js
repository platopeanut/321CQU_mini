const util = require("./util")
/**
 *  321CQU API 接口
 */

const url = 'https://www.zhulegend.com/321CQU'
const Password = 'CQUz5321'

function request(header, resolve, reject, loading = true) {
  if (loading) {wx.showLoading()}
  header['data']['Key'] = Password
  wx.request({
    url: url + header['url'],
    method: 'POST',
    data: header['data'],
    success: res => {
      if (loading) {wx.hideLoading()}
      if (res.statusCode === 200) {
        if (res.data.Statue === 1) {
          resolve(res.data)
        } else {
          util.showError(res)
          reject(new Error())
        }
      } else {
        wx.showToast({
          title: '网络错误' + res.statusCode,
          icon: 'none'
        })
      }
    },
    fail: () => {
      wx.hideLoading()
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      })
    }
  })
}



/**
 * 测试接口
 */
function TEST(data) {
    let header = {
        url: '/test_data',
        data: {
            'Data': data
        }
    }
    return new Promise((resolve,reject) => {
        request(header, resolve, reject)
    })
}


/**
 *  支持我们广告
 */

// 增加一次广告观看次数
function adLook(code) {
    let header = {
        url: '/user/advertise/look',
        data: {
            'Code': code
        }
    }
    return new Promise((resolve,reject) => {
        request(header, resolve, reject)
    })
}

function adTimes(code) {
    let header = {
        url: '/user/advertise/times',
        data: {
            'Code': code
        }
    }
    return new Promise((resolve,reject) => {
        request(header, resolve, reject)
    })
}


/**
 *
 * 首页广告
 */
// 首页图片
function getHomepageImgDate() {
  let header = {
    url: '/homepage',
    data: {
    }
  }
  return new Promise((resolve,reject) => {
    request(header, resolve, reject, false)
  })
}

module.exports = {
    TEST,
    request,
    getHomepageImgDate,
    adLook,
    adTimes,
}
