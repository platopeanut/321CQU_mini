const api = require('../../../utils/api')


// 空教室信息
function getClassroomInfo(uid, uid_pwd, week, weekday, ) {
    let header = {
        url: '/school_info/get_vacant_room',
        data: {
            'UserName': uid,
            'Password': uid_pwd,
            'AppointWeek':week,
            'AppointWeekday':weekday,
            // 'AppointCourse':course_time

        }
    }
    return new Promise((resolve,reject) => {
        api.request(header, resolve, reject)
    })
}



module.exports = {
    getClassroomInfo,
}