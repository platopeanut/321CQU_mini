const api = require('../../../utils/api')

// 根据教师名称查询课程信息
function queryClassInfoByTeacherName(teacher_name) {
    let header = {
        url: '/school_info/get_course_list',
        data: {
            'TeacherName': teacher_name,
        }
    }
    return new Promise((resolve,reject) => {
        api.request(header, resolve, reject)
    })
}

// 根据课程名称查询课程信息
function queryClassInfoByClassName(class_name) {
    let header = {
        url: '/school_info/get_course_list',
        data: {
            'CourseName': class_name,
        }
    }
    return new Promise((resolve,reject) => {
        api.request(header, resolve, reject)
    })
}

// 根据Cid查询课程详细信息
function queryClassDetail(Cid) {
    let header = {
        url: '/school_info/get_course_detail',
        data: {
            'Cid': Cid,
        }
    }
    return new Promise((resolve,reject) => {
        api.request(header, resolve, reject)
    })
}

async function queryClassInfo(courseName = null, teacherName = null) {
    const data = {};
    if (courseName) data['course_name'] = courseName;
    if (teacherName) data['teacher_name'] = teacherName;
    const res = await api.newRequest("https://api.321cqu.com/v1/course_score_query/course", data, "GET");
    return res['courses'];
}

async function queryNewClassDetail(cid) {
    return await api.newRequest("https://api.321cqu.com/v1/course_score_query/course/" + cid, {}, "GET");
}


module.exports = {
    queryClassInfoByTeacherName,
    queryClassInfoByClassName,
    queryClassDetail,
    queryClassInfo,
    queryNewClassDetail,
}