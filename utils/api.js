const util = require("./util")
const {version} = require("../lib/towxml/echarts/wx-echarts");
/**
 *  321CQU API 接口
 */

const url = 'https://www.zhulegend.com/321CQU'
const Password = 'CQUz5321'

function request(header, resolve, reject, loading = true, show_err = true, version='1.0') {
  if (loading) {wx.showLoading()}
  let data = {}
  if (version === '1.0') {
      header['data']['Key'] = Password
      data = header['data']
  } else {
      data = {
          'Key': Password,
          'Version': version,
          'Params': header.data,
      }
  }
  wx.request({
    url: url + header['url'],
    method: 'POST',
    data: data,
    success: res => {
      if (loading) {wx.hideLoading()}
      if (res.statusCode === 200) {
        if (res.data.Statue === 1) {
          if (version === '1.0') resolve(res.data)
          else resolve(res.data.data)
        } else {
            if (show_err) {
                util.showError(res)
            }
            reject(res.data)
        }
      } else {
        wx.showToast({
          title: '网络错误' + res.statusCode,
          icon: 'none'
        })
      }
    },
    fail: () => {
      if (loading) {wx.hideLoading()}
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
function getHomepageImgData() {
  let header = {
    url: '/homepage',
    data: {
    }
  }
  return new Promise((resolve,reject) => {
    request(header, resolve, reject, false, true, '2.0')
  })
}

module.exports = {
    TEST,
    request,
    getHomepageImgData,
    adLook,
    adTimes,
}
