const util = require("./util");
/**
 *  321CQU API 接口
 */

const url = 'https://www.zhulegend.com/321CQU'
const Password = 'CQUz5321'

function request(header, resolve, reject) {
  wx.showLoading()
  header['data']['Key'] = Password
  wx.request({
    url: url + header['url'],
    method: 'POST',
    data: header['data'],
    success: res => {
      wx.hideLoading()
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

// 本科生统一身份认证校验
function checkUidInfo(stu_id, uid, uid_pwd, code) {
  return new Promise((resolve,reject) => {
    wx.request({
      url: url + '/user/login',
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

// 获取课表
function getCurriculum(stu_id, uid, uid_pwd) {
  let header = {
    url: '/student/get_course',
    data: {
      'Sid': stu_id,
      'UserName': uid,
      'Password': uid_pwd
    }
  }
  return new Promise((resolve,reject) => {
    request(header, resolve, reject)
  })
}

// 下学期课表预览
function getNextCurriculum(stu_id, uid, uid_pwd) {
  let header = {
    url: '/student/get_enrollment',
    data: {
      'Sid': stu_id,
      'UserName': uid,
      'Password': uid_pwd
    }
  }
  return new Promise((resolve,reject) => {
    request(header, resolve, reject)
  })
}

// 备份到云端
function pushSelfSchedule(code, events) {
  let header = {
    url: '/course_table/push_custom_event',
    data: {
      'Code': code,
      'Events': events,
    }
  }
  return new Promise((resolve,reject) => {
    request(header, resolve, reject)
  })
}
// 同步到本地
function pullSelfSchedule(code) {
  let header = {
    url: '/course_table/pull_custom_event',
    data: {
      'Code': code,
    }
  }
  return new Promise((resolve,reject) => {
    request(header, resolve, reject)
  })
}
// 研究生统一身份认证校验
function checkPGUidInfo(uid, uid_pwd) {
  return new Promise((resolve,reject) => {
    wx.request({
      url: url + '/pg_student/is_match',
      method: 'POST',
      data: {
        'Key': Password,
        'UserName': uid,
        'Password': uid_pwd
      },
      success: resolve,
      fail: reject
    })
  })
}

// 研究生成绩查询
function getPGGrade(uid, uid_pwd) {
  return new Promise((resolve,reject) => {
    wx.request({
      url: url + '/pg_student/get_score',
      method: 'POST',
      data: {
        'Key': Password,
        'UserName': uid,
        'Password': uid_pwd
      },
      success: resolve,
      fail: reject
    })
  })
}

// 学校当前学期信息
function getSchoolTermInfo(uid, uid_pwd) {
  let header = {
    url: '/school_info/get_curr_term',
    data: {
      'UserName': uid,
      'Password': uid_pwd
    }
  }
  return new Promise((resolve,reject) => {
    request(header, resolve, reject)
  })
}
// 学校下学期信息
function getSchoolNextTermInfo(uid, uid_pwd) {
  let header = {
    url: '/school_info/get_next_term',
    data: {
      'UserName': uid,
      'Password': uid_pwd
    }
  }
  return new Promise((resolve,reject) => {
    request(header, resolve, reject)
  })
}


// 增加一次广告观看次数
function ad_look(code) {
  return new Promise((resolve,reject) => {
    wx.request({
      url: url + '/user/advertise/look',
      method: 'POST',
      data: {
        'Key': Password,
        'Code': code,
      },
      success: resolve,
      fail: reject
    })
  })
}

function ad_times(code) {
  return new Promise((resolve,reject) => {
    wx.request({
      url: url + '/user/advertise/times',
      method: 'POST',
      data: {
        'Key': Password,
        'Code': code,
      },
      success: resolve,
      fail: reject
    })
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

// 查询gpa和排名
function get_gpa_and_rank(uid, uid_pwd) {
  return new Promise((resolve,reject) => {
    wx.request({
      url: url + '/student/get_gpa_ranking',
      method: 'POST',
      data: {
        'Key': Password,
        'UserName': uid,
        'Password': uid_pwd
      },
      success: resolve,
      fail: reject
    })
  })
}

// 查询水电费
function get_fees(uid, uid_pwd, is_hu_xi, room_code) {
  return new Promise((resolve,reject) => {
    wx.request({
      url: url + '/school_info/get_fees',
      method: 'POST',
      data: {
        'Key': Password,
        'UserName': uid,
        'Password': uid_pwd,
        'IsHuXi': is_hu_xi,
        'Room': room_code
      },
      success: resolve,
      fail: reject
    })
  })
}

//查询一卡通相关信息：
function getSchoolCardInfo(uid, uid_pwd){
  return new Promise((resolve,reject) => {
    wx.request({
      url: url + '/school_info/get_card',
      method: 'POST',
      data: {
        'Key': Password,
        'UserName': uid,
        'Password': uid_pwd,
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
  getCurriculum,
  getNextCurriculum,
  checkPGUidInfo,
  getPGGrade,
  getSchoolTermInfo,
  getSchoolNextTermInfo,
  ad_look,
  ad_times,
  query_class_info_by_class_name,
  query_class_info_by_teacher_name,
  query_class_detail,
  get_gpa_and_rank,
  get_fees,
  getSchoolCardInfo,
  pullSelfSchedule,
  pushSelfSchedule,
}
