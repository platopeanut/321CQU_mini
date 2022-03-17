const api = require('../../../utils/api')

// 本科生统一身份登录
function loginUG(uid, uid_pwd) {
    let header = {
        url: '/user/login',
        data: {
            'UserName': uid,
            'Password': uid_pwd
        }
    }
    return new Promise((resolve,reject) => {
        api.request(header, resolve, reject)
    })
}

// 研究生统一身份登录
function loginPG(uid, uid_pwd) {
    let header = {
        url: '/pg_student/is_match',
        data: {
            'UserName': uid,
            'Password': uid_pwd
        }
    }
    return new Promise((resolve,reject) => {
        api.request(header, resolve, reject)
    })
}

// 设置昵称，上传用户头像
function setNickname(stu_id, nickname, avatarUrl) {
    let header = {
        url: '/user/set_info',
        data: {
            'Sid': stu_id,
            'UserName': nickname,
            'UserImg': avatarUrl,
        }
    }
    return new Promise((resolve,reject) => {
        api.request(header, resolve, reject)
    })
}

module.exports = {
    loginUG,
    loginPG,
    setNickname,
}