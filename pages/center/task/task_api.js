const api = require('../../../utils/api')


// 订阅
function subscribe(code, stu_id, uid, uid_pwd) {
    let header = {
        url: '/message/subscribe',
        data: {
            'Code': code,
            'Sid': stu_id,
            'UserName': uid,
            'Password': uid_pwd
        }
    }
    return new Promise((resolve,reject) => {
        api.request(header, resolve, reject, false)
    })
}

module.exports = {
    subscribe
}

