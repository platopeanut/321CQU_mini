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

// 云存储账户信息
function pushUserInfo(code, stu_id, uid, uid_pwd, email, dormitory, identity) {
    let header = {
        url: '/user/update_user_info',
        data: {
            'Code': code,
            'Sid': stu_id,
            'Auth': uid,
            'Password': uid_pwd,
            'Email': email,
            'Dormitory': dormitory,
            'Type': identity
        }
    }
    return new Promise((resolve,reject) => {
        api.request(header, resolve, reject)
    })
}
// 云同步账户信息
function pullUserInfo(code) {
    let header = {
        url: '/user/select_user_info',
        data: {
            'Code': code
        }
    }
    return new Promise((resolve,reject) => {
        api.request(header, resolve, reject, false, false)
    })
}
//删除云端账户信息
function deleteUserInfo(code) {
    let header = {
        url: '/user/delete_user_info',
        data: {
            'Code': code
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
    pushUserInfo,
    pullUserInfo,
    deleteUserInfo,
}