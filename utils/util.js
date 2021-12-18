const url = 'https://www.zhulegend.com/321CQU'
const Password = 'CQUz5321'

// 对应学号的姓名
function getStuName(stu_id) {
  return new Promise((resolve,reject) => {
    wx.request({
      url: url,
      method: 'POST',
      data: {
        'Password': Password,
        'Sid': stu_id,
        'Method': 1
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
      url: url,
      method: 'POST',
      data: {
        'Password': Password,
        'Sid': stu_id,
        'Method': 3
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
      url: url,
      method: 'POST',
      data: {
        'Password': Password,
        'Sid': stu_id,
        'Method': 2
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
      url: url,
      method: 'POST',
      data: {
        'Password': Password,
        'Sid': stu_id,
        'Mail': email,
        'Fid': fid_list,
        'Method': 4
      },
      success: resolve,
      fail: reject
    })
  })
}

function setNickname(stu_id, nickname) {
  return new Promise((resolve,reject) => {
    wx.request({
      url: url,
      method: 'POST',
      data: {
        'Password': Password,
        'Sid': stu_id,
        'Username': nickname,
        'Method': 5
      },
      success: resolve,
      fail: reject
    })
  })
}

// 解析字符串到对象
function parseFromStr(str) {
  return JSON.parse(str)
}


// 获取反馈信息
function getFeedback(limit) {
  return new Promise((resolve,reject) => {
    wx.request({
      url: url,
      method: 'POST',
      data: {
        'Password': Password,
        'Method': 7,
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
      url: url,
      method: 'POST',
      data: {
        'Password': Password,
        'Method': 6,
        'Sid': stu_id,
        'Content': message,
      },
      success: resolve,
      fail: reject
    })
  })
}

module.exports = {
  getVolunteerTime,
  getVolunteerRecord,
  getStuName,
  sendVolunteer,
  parseFromStr,
  setNickname,
  getFeedback,
  sendFeedback,
}
