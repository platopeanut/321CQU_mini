const api = require('../../../utils/api');

/**
 * @param stu_id        学号
 * @param sport_pwd     体测查询密码
 */
function getSportScoreList(stu_id, sport_pwd) {
    let header = {
        url: '/student/get_sport_score_list',
        data: {
            'Sid': stu_id,
            'Password': sport_pwd
        }
    }
    return new Promise((resolve,reject) => {
        api.request(header, resolve, reject, true, true, '2.0');
    })
}

/**
 * @param stu_id        学号
 * @param sport_pwd     体测查询密码
 * @param stu_no        学生编号
 * @param academic_year 学年
 * @param term          学期
 * @param grade         年级
 * @param sex           性别
 */
function getSportScoreDetail(stu_id, sport_pwd, stu_no, academic_year, term, grade, sex) {
    let header = {
        url: '/student/get_sport_score_detail',
        data: {
            'Sid': stu_id,
            'Password': sport_pwd,
            'StuNo': stu_no,
            'AcademicYear': academic_year,
            'Term': term,
            'Grade': grade,
            'Sex': sex
        }
    }
    return new Promise((resolve,reject) => {
        api.request(header, resolve, reject, true, true, '2.0');
    })
}

module.exports = {
    getSportScoreList,
    getSportScoreDetail,
};


