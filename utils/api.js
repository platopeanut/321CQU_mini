const util = require("./util")
const COS = require("../lib/cos-wx-sdk-v5")
/**
 *  321CQU API 接口
 */

const url = 'https://www.zhulegend.com/321CQU'
const Password = 'CQUz5321'
let COSType = 'download'
let cos = new COS({
    getAuthorization: function (options, callback) {
        // 异步获取临时密钥
        let curr_time = Date.now()
        console.log(curr_time)
        COSGetCredential(COSType).then(res => {
            console.log(res)
            callback({
                TmpSecretId: res.Credentials.TmpSecretId,
                TmpSecretKey: res.Credentials.TmpSecretKey,
                XCosSecurityToken: res.Credentials.SessionToken,
                // StartTime: curr_time, // res.Expiration
                ExpiredTime: res.ExpiredTime
            })
        })
        // wx.request({
        //     url: 'https://example.com/server/sts.php',
        //     data: {
        //         bucket: options.Bucket,
        //         region: options.Region,
        //     },
        //     dataType: 'json',
        //     success: function (result) {
        //         var data = result.data;
        //         var credentials = data && data.credentials;
        //         if (!data || !credentials) return console.error('credentials invalid');
        //         callback({
        //             TmpSecretId: credentials.tmpSecretId,
        //             TmpSecretKey: credentials.tmpSecretKey,
        //             XCosSecurityToken: credentials.sessionToken,
        //             // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
        //             StartTime: data.startTime, // 时间戳，单位秒，如：1580000000
        //             ExpiredTime: data.expiredTime, // 时间戳，单位秒，如：1580000900
        //         });
        //     }
        // })

    }
})

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
    request(header, resolve, reject, false, true, '2.1')
  })
}

/*
    COS 对象存储
 */
// 获取临时密钥
function COSGetCredential(type) {
    let header = {
        url: '/cos/get_credential',
        data: {
            Type: type
        }
    }
    return new Promise((resolve,reject) => {
        request(header, resolve, reject, false, true, '2.0')
    })
}

function COSUpload() {

}

function COSDownload(key, callback) {
    COSType = 'download'
    cos.getObjectUrl({
        Bucket: '321cqu-1302184418',
        Region: 'ap-chongqing',
        Key: key,
        // Sign: true
    }, function (err, data) {
        if (!err) callback(data)
    })
}

module.exports = {
    url,
    TEST,
    request,
    getHomepageImgData,
    adLook,
    adTimes,
    COSGetCredential,
    COSDownload,
}
