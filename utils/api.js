/**
 *  321CQU API 接口
 */

const url = 'https://www.zhulegend.com/321CQU'
const Password = 'CQUz5321'

// 对应学号的姓名
function getStuName(stu_id) {
  return new Promise((resolve,reject) => {
    wx.request({
      url: url + '/student/StuVal',
      method: 'POST',
      data: {
        'Key': Password,
        'Sid': stu_id,
      },
      success: resolve,
      fail: reject
    })
  }) 
}

// 志愿时长的记录
function getVolunteerRecord(stu_id) {
  return new Promise((resolve,reject) => {
    wx.request({
      url: url + '/student/all_activity',
      method: 'POST',
      data: {
        'Key': Password,
        'Sid': stu_id,
      },
      success: resolve,
      fail: reject
    })
  })
}

// 志愿总时长
function getVolunteerTime(stu_id) {
  return new Promise((resolve,reject) => {
    wx.request({
      url: url + '/student/total_duration',
      method: 'POST',
      data: {
        'Key': Password,
        'Sid': stu_id,
      },
      success: resolve,
      fail: reject
    })
  })
}

// 志愿发送至邮箱
function sendVolunteer(stu_id, email, fid_list) {
  return new Promise((resolve,reject) => {
    wx.request({
      url: url + '/mail/send_volunteer_pdfs',
      method: 'POST',
      data: {
        'Key': Password,
        'Sid': stu_id,
        'Mail': email,
        'Fid': fid_list,
      },
      success: resolve,
      fail: reject
    })
  })
}

// 设置昵称，上传用户头像
function setNickname(stu_id, nickname, avatarUrl) {
  return new Promise((resolve,reject) => {
    wx.request({
      url: url + '/user/set_info',
      method: 'POST',
      data: {
        'Key': Password,
        'Sid': stu_id,
        'UserName': nickname,
        'UserImg': avatarUrl,
      },
      success: resolve,
      fail: reject
    })
  })
}



// 获取反馈信息
function getFeedback(limit) {
  return new Promise((resolve,reject) => {
    wx.request({
      url: url + '/test_api/feedback/get',
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
      url: url + '/test_api/feedback/get_comment',
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
      url: url + '/test_api/feedback/send_comment',
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


// 统一身份认证校验
function checkUidInfo(stu_id, uid, uid_pwd, code) {
  return new Promise((resolve,reject) => {
    wx.request({
      url: url + '/student/get_score',
      method: 'POST',
      data: {
        'Key': Password,
        'Sid': stu_id,
        'UserName': uid,
        'Password': uid_pwd,
        'NeedAll': false,
        'Code': code
      },
      success: resolve,
      fail: reject
    })
  })
}

// 成绩查询
function getGrade(stu_id, uid, uid_pwd, code) {
  return new Promise((resolve,reject) => {
    wx.request({
      url: url + '/student/get_score',
      method: 'POST',
      data: {
        'Key': Password,
        'Sid': stu_id,
        'UserName': uid,
        'Password': uid_pwd,
        'Code': code,
        'NeedAll': true
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
  return new Promise((resolve,reject) => {
    wx.request({
      url: url + '/about/about_us',
      method: 'POST',
      data: {
        'Key': Password,
      },
      success: resolve,
      fail: reject
    })
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


module.exports = {
  test,
  getVolunteerTime,
  getVolunteerRecord,
  getStuName,
  sendVolunteer,
  setNickname,
  getFeedback,
  sendFeedback,
  checkUidInfo,
  getGrade,
  getExamSchedule,
  getAboutUs,
  subscribe,
  send_feedback_comment,
  get_feedback_comment,
}
