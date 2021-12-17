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

// 解析字符串到对象
function parseFromStr(str) {
  // return (new Function("return " + str))();
  return JSON.parse(str)
}

module.exports = {
  getVolunteerTime,
  getVolunteerRecord,
  getStuName,
  sendVolunteer,
  parseFromStr,
}
