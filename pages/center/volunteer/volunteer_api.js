const api = require('../../../utils/api')

// 对应学号的姓名
function getStuName(stu_id) {
    let header = {
        url: '/student/StuVal',
        data: {
            'Sid': stu_id,
        }
    }
    return new Promise((resolve,reject) => {
        api.request(header, resolve, reject)
    })
}

// 志愿时长的记录
function getVolunteerRecord(stu_id) {
    let header = {
        url: '/student/all_activity',
        data: {
            'Sid': stu_id,
        }
    }
    return new Promise((resolve,reject) => {
        api.request(header, resolve, reject)
    })
}

// 志愿总时长
function getVolunteerTime(stu_id) {
    let header = {
        url: '/student/total_duration',
        data: {
            'Sid': stu_id,
        }
    }
    return new Promise((resolve,reject) => {
        api.request(header, resolve, reject)
    })
}

// 志愿发送至邮箱
function sendVolunteer(stu_id, email, fid_list) {
    let header = {
        url: '/mail/send_volunteer_pdfs',
        data: {
            'Sid': stu_id,
            'Mail': email,
            'Fid': fid_list,
        }
    }
    return new Promise((resolve,reject) => {
        api.request(header, resolve, reject, false)
    })
}

module.exports = {
    getVolunteerTime,
    getVolunteerRecord,
    getStuName,
    sendVolunteer,
}