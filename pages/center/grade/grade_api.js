const api = require('../../../utils/api')

// 本科生成绩查询
function getUGGrade(stu_id, uid, uid_pwd, code) {
    let header = {
        url: '/student/get_score',
        data: {
            'Sid': stu_id,
            'UserName': uid,
            'Password': uid_pwd,
            'Code': code,
            'NeedAll': true
        }
    }
    return new Promise((resolve,reject) => {
        api.request(header, resolve, reject)
    })
}

// 研究生成绩查询
function getPGGrade(uid, uid_pwd) {
    let header = {
        url: '/pg_student/get_score',
        data: {
            'UserName': uid,
            'Password': uid_pwd
        }
    }
    return new Promise((resolve,reject) => {
        api.request(header, resolve, reject)
    })
}

// 查询gpa和排名
function getGpaAndRank(uid, uid_pwd) {
    let header = {
        url: '/student/get_gpa_ranking',
        data: {
            'UserName': uid,
            'Password': uid_pwd
        }
    }
    return new Promise((resolve,reject) => {
        api.request(header, resolve, reject)
    })
}

module.exports = {
    getUGGrade,
    getPGGrade,
    getGpaAndRank,
}
