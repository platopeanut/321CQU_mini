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
}
