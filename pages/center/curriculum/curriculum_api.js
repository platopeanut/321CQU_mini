const api = require('../../../utils/api')


// 学校当前学期信息
function getSchoolCurrTermInfo(uid, uid_pwd) {
    return getSchoolTermInfo(uid, uid_pwd, 0);
}
// 学校下学期信息
function getSchoolNextTermInfo(uid, uid_pwd) {
    return getSchoolTermInfo(uid, uid_pwd, 1);
}
// 获取学校学期信息
function getSchoolTermInfo(uid, uid_pwd, offset) {
    let header = {
        url: '/school_info/get_term_info',
        data: {
            'UserName': uid,
            'Password': uid_pwd,
            'TermOffset': offset
        }
    }
    return new Promise((resolve,reject) => {
        api.request(header, resolve, reject, true, true, '2.0')
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
        api.request(header, resolve, reject)
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
        api.request(header, resolve, reject)
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
        api.request(header, resolve, reject)
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
        api.request(header, resolve, reject)
    })
}


module.exports = {
    getSchoolCurrTermInfo,
    getSchoolNextTermInfo,
    getCurriculum,
    getNextCurriculum,
    pullSelfSchedule,
    pushSelfSchedule,
}