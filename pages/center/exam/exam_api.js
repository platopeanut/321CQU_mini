const api = require('../../../utils/api')

// 考试安排
function getExamSchedule(stu_id, uid, uid_pwd) {
    let header = {
        url: '/student/get_exam',
        data: {
            'Sid': stu_id,
            'UserName': uid,
            'Password': uid_pwd,
        }
    }
    return new Promise((resolve,reject) => {
        api.request(header, resolve, reject)
    })
}


module.exports = {
    getExamSchedule,
}