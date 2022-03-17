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
    fail: res => {
      wx.hideLoading()
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      })
    }
  })
}

// 获取反馈信息
function getFeedback(limit) {
  return new Promise((resolve,reject) => {
    wx.request({
      url: url + '/feedback/get',
      method: 'POST',
      data: {
        'Key': Password,
        'Limit': limit
      },
      success: resolve,
      fail: reject
    })
  })
}

// 发送反馈信息
function sendFeedback(stu_id, message) {
  return new Promise((resolve,reject) => {
    wx.request({
      url: url + '/feedback/send',
      method: 'POST',
      data: {
        'Key': Password,
        'Sid': stu_id,
        'Content': message,
      },
      success: resolve,
      fail: reject
    })
  })
}

// 获取反馈评论
function get_feedback_comment(FBid) {
  return new Promise((resolve,reject) => {
    wx.request({
      url: url + '/feedback/get_comment',
      method: 'POST',
      data: {
        'Key': Password,
        'FBid': FBid,
      },
      success: resolve,
      fail: reject
    })
  })
}

// 发表反馈评论
function send_feedback_comment(Sid, Content, FBid) {
  return new Promise((resolve,reject) => {
    wx.request({
      url: url + '/feedback/send_comment',
      method: 'POST',
      data: {
        'Key': Password,
        'FBid': FBid,
        'Sid': Sid,
        'Content': Content,
      },
      success: resolve,
      fail: reject
    })
  })
}


// 考试安排
function getExamSchedule(stu_id, uid, uid_pwd) {
  return new Promise((resolve,reject) => {
    wx.request({
      url: url + '/student/get_exam',
      method: 'POST',
      data: {
        'Key': Password,
        'Sid': stu_id,
        'UserName': uid,
        'Password': uid_pwd,
      },
      success: resolve,
      fail: reject
    })
  })
}

// 获取关于界面
function getAboutUs() {
  let header = {
    url: '/about/about_us',
    data: {}
  }
  return new Promise((resolve,reject) => {
    request(header, resolve, reject)
  })
}

// 订阅
function subscribe(code, stu_id, uid, uid_pwd) {
  return new Promise((resolve,reject) => {
    wx.request({
      url: url + '/message/subscribe',
      method: 'POST',
      data: {
        'Key': Password,
        'Code': code,
        'Sid': stu_id,
        'UserName': uid,
        'Password': uid_pwd
      },
      success: resolve,
      fail: reject
    })
  })
}

// test 测试接口
function test(data) {
  return new Promise((resolve,reject) => {
    wx.request({
      url: url + '/test_data',
      method: 'POST',
      data: {
        'Key': Password,
        'Data': data
      },
      success: resolve,
      fail: reject
    })
  })
}


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

// 根据教师名称查询课程信息
function query_class_info_by_teacher_name(teacher_name) {
  return new Promise((resolve,reject) => {
    wx.request({
      url: url + '/school_info/get_course_list',
      method: 'POST',
      data: {
        'Key': Password,
        'TeacherName': teacher_name,
      },
      success: resolve,
      fail: reject
    })
  })
}

// 根据课程名称查询课程信息
function query_class_info_by_class_name(class_name) {
  return new Promise((resolve,reject) => {
    wx.request({
      url: url + '/school_info/get_course_list',
      method: 'POST',
      data: {
        'Key': Password,
        'CourseName': class_name,
      },
      success: resolve,
      fail: reject
    })
  })
}

// 根据Cid查询课程详细信息
function query_class_detail(Cid) {
  return new Promise((resolve,reject) => {
    wx.request({
      url: url + '/school_info/get_course_detail',
      method: 'POST',
      data: {
        'Key': Password,
        'Cid': Cid,
      },
      success: resolve,
      fail: reject
    })
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
    test,
    request,
    getFeedback,
    sendFeedback,
    getExamSchedule,
    getAboutUs,
    subscribe,
    send_feedback_comment,
    get_feedback_comment,
    adLook,
    adTimes,
    query_class_info_by_class_name,
    query_class_info_by_teacher_name,
    query_class_detail,
    getHomepageImgDate,
}
