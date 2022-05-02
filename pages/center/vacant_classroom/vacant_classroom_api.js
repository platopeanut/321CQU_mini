const api = require('../../../utils/api')


// 新校区空教室信息
function getClassroomInfo(uid, uid_pwd, week, weekday) {
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

//老校区空教室信息
function getOldClassroomInfo(uid, uid_pwd, week, weekday, building){
    let header = {
        url: '/school_info/get_vacant_room_old_campus',
        data: {
            'UserName': uid,
            'Password': uid_pwd,
            'AppointWeek':week,
            'AppointWeekday':weekday,
            'AppointBuilding':building,
            // 'AppointCourse':course_time

        }
    }
    return new Promise((resolve,reject) => {
        api.request(header, resolve, reject)
    })
}


module.exports = {
    getClassroomInfo,
    getOldClassroomInfo,
}