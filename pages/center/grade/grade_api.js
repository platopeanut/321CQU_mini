const api = require('../../../utils/api')

// 本科生成绩查询
function getUGGrade(stu_id) {
    return api.newRequest(
        "https://api.321cqu.com/v1/edu_admin_center/fetchScore",
        {
            "sid": stu_id,
            "is_minor": true
        }
    ).then(res => {
        // 兼容到旧的格式
        function getTermName(session) {
            return `${session['year']}${session['is_autumn'] ? '秋' : '春'}`
        }
        let data = {}
        res.scores.forEach(it => {
            const termName = getTermName(it.session)
            if (!data[termName]) data[termName] = []
            data[termName].push({
                CourseCode: it.course.code,
                CourseCredit: it.course.credit,
                CourseName: it.course.name,
                CourseNature: it.course_nature,
                EffectiveScoreShow: it.score,
                InstructorName: it.course.instructor,
                StudyNature: it.study_nature
            })
        })
        return data
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
