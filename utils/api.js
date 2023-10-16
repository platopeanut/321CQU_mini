const util = require("./util")
const COS = require("../lib/cos-wx-sdk-v5")
/**
 *  321CQU API 接口
 */

const url = 'https://www.zhulegend.com/321CQU'
const Password = 'CQUz5321'
// get_announcement_cover
let COSType = 'upload_post_picture'
let cos = new COS({
    getAuthorization: function (options, callback) {
        // 异步获取临时密钥
        let curr_time = Date.now()
        let stu_id = wx.getStorageSync('StuInfo')["stu_id"]
        COSGetCredential(COSType, stu_id).then(res => {
            console.log(res)
            callback({
                TmpSecretId: res.Credentials.TmpSecretId,
                TmpSecretKey: res.Credentials.TmpSecretKey,
                XCosSecurityToken: res.Credentials.SessionToken,
                // StartTime: curr_time, // res.Expiration
                ExpiredTime: res.ExpiredTime
            })
        })
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
  let startTime = Date.now()
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
            // 事件上报
            if (res.data.Statue === 0) {
                wx.reportEvent("wxdata_perf_monitor", {
                    "wxdata_perf_monitor_id": header['url'],
                    "wxdata_perf_monitor_level": 1,
                    "wxdata_perf_error_code": 0,
                    "wxdata_perf_error_msg": res.data["ErrorInfo"],
                    "wxdata_perf_cost_time": Date.now() - startTime,
                    "wxdata_perf_extra_info1": "",
                    "wxdata_perf_extra_info2": "",
                    "wxdata_perf_extra_info3": ""
                })
            }
            if (show_err) { util.showError(res) }
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
 *  Token
 */
function getToken(username='', password='') {
    console.log("getToken")
    return new Promise((resolve, reject) => {
        wx.request({
            url: "https://api.321cqu.com/v1/authorization/login",
            method: "POST",
            data: {
                "apiKey": "koZfU+HGTNXRjxhSQiYpTQ==",
                "applyType": "WX_Mini_APP",
                "username": username,
                "password": password
            },
            success(res) {
                console.log(res)
                if (res.data['status'] === 1) {
                    const info = res.data['data']
                    wx.setStorageSync("TokenInfo", {
                        refreshToken: info.refreshToken,
                        refreshTokenExpireTime: info.refreshTokenExpireTime
                    })
                    resolve(res.data['data'])
                }
                else reject(res.data)
            }
        })
    })
}

function refreshToken(refreshToken) {
    console.log("refreshToken")
    return new Promise((resolve, reject) => {
        wx.request({
            url: "https://api.321cqu.com/v1/authorization/refreshToken",
            method: "POST",
            data: {
                "refreshToken": refreshToken
            },
            success(res) {
                if (res.data['status'] === 1) resolve(res.data['data'])
                else reject(res.data)
            }
        })
    })
}

// 用户验证
function userValidate() {
    return newRequest('https://api.321cqu.com/v1/edu_admin_center/validateAuth')
}

// 判断token是否过期
// true没有过期，false过期
function checkTokenExpireTime(expireTime, date=new Date()) {
    return expireTime - new Date().getTime() / 1000 > 0;
}

const currTokenInfo = {
    token: '',
    tokenExpireTime: 0
}

function setCurrTokenInfo(token, tokenExpireTime) {
    currTokenInfo.token = token
    currTokenInfo.tokenExpireTime = tokenExpireTime
}

function handleToken() {
    console.log(currTokenInfo)
    return new Promise((resolve, reject) => {
        // 如果token没有或者token过期
        if (currTokenInfo.token === ''
            || !checkTokenExpireTime(currTokenInfo.tokenExpireTime)) {
        // if (true) {
            // 尝试用refreshToken
            let tokenInfo = wx.getStorageSync("TokenInfo")
            // 如果refreshToken没有或者过期则也获取新的
            if (!tokenInfo || !tokenInfo['refreshToken'] || !tokenInfo['refreshTokenExpireTime'] ||
                !checkTokenExpireTime(tokenInfo['refreshTokenExpireTime'])) {
                const stuInfo = wx.getStorageSync('StuInfo');
                console.log(stuInfo)
                getToken(stuInfo.uid, stuInfo.uid_pwd).then(res => {
                    currTokenInfo.token = res.token
                    currTokenInfo.tokenExpireTime = res.tokenExpireTime
                    resolve(res.token)
                }).catch(err => reject(err))
            }
            else {
                refreshToken(tokenInfo.refreshToken).then(res => {
                    currTokenInfo.token = res.token
                    currTokenInfo.tokenExpireTime = res.tokenExpireTime
                    resolve(res.token)
                })
            }
        }
        else {
            resolve(currTokenInfo.token)
        }
    })
}

function newRequest(url, data={}, method="POST") {
    return handleToken().then(token => new Promise((resolve, reject) => {
        wx.showLoading({title: '加载中'})
        wx.request({
            header: {
                "Authorization": "Bearer " + token
            },
            url: url,
            method: method,
            data: data,
            success(res) {
                wx.hideLoading()
                if (res.data['status'] === 1) resolve(res.data['data'])
                else {
                    console.log(res)
                    wx.showToast({
                        title: `[${res.statusCode}]${res.data['msg']}`,
                        icon: 'none'
                    })
                    // reject(res)
                }
            }
        })
    }))
}

function bindOpenID(uid, code) {
    return newRequest("https://api.321cqu.com/v1/notification/bindOpenId", {
        "uid": uid,
        "code": code
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
//   let header = {
//     url: '/homepage',
//     data: {
//     }
//   }
//   return new Promise((resolve,reject) => {
//     request(header, resolve, reject, false, true, '2.1')
//   })
    return newRequest('https://api.321cqu.com/v1/important_info/homepages', {}, "GET");
}

// // 每日一句
// function sentenceADay() {
//     wx.request({
//         url: 'https://open.iciba.com/dsapi',
//         success: result => {
//             console.log(result)
//         }
//     })
// }

/*
    COS 对象存储
 */
// 获取临时密钥
function COSGetCredential(type, stu_id) {
    let header = {
        url: '/cos/get_credential',
        data: {
            Type: type,
            Sid: stu_id
        }
    }
    return new Promise((resolve,reject) => {
        request(header, resolve, reject, false, true, '2.1')
    })
}

function COSUpload(filename, file_path) {
    COSType = 'upload_post_picture'
    let stu_id = wx.getStorageSync('StuInfo')["stu_id"]
    return new Promise((resolve, reject) => {
        if (!stu_id) {
            wx.showToast({
                title: '学号不能为空',
                icon: 'none'
            })
            reject("stu_id is null")
            return
        }
        cos.postObject({
            Bucket: '321cqu-1302184418',
            Region: 'ap-chongqing',
            Key: `posts/${stu_id}/${filename}`,
            FilePath: file_path,
            // onProgress: function (info) {
            //     console.log(JSON.stringify(info));
            // }
        }, function (err, data) {
            if (err) reject(err)
            else resolve(data['Location'])
        });
    })
}

function COSDownload(key, callback) {
    COSType = 'get_announcement_cover'
    cos.getObjectUrl({
        Bucket: '321cqu-1302184418',
        Region: 'ap-chongqing',
        Key: key,
        // Sign: true
    }, function (err, data) {
        if (!err) callback(data)
    })
}

function getVerifyState() {
    let header = {
        url: '/api',
        data: {
            Version: util.CurrentVersion
        }
    }
    return new Promise((resolve,reject) => {
        request(header, resolve, reject, false, false, '1.0')
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
    COSUpload,
    getVerifyState,
    // sentenceADay,
    newRequest,
    userValidate,
    getToken,
    setCurrTokenInfo,
    bindOpenID,
    handleToken
}
