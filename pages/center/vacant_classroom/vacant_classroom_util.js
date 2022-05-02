const util = require("../../../utils/util")

// function getWeekList() {
//     return [["周一", 21]
// ["周二", 22]
// ["周三", 23]
// ["周四", 24]
// ["周五", 25]["周六", 26]
//  ["周日", 27]]
// }










const time_table = [
    '08:30~09:15',
    '09:25~10:10',
    '10:30~11:15',
    '11:25~12:10',
    '13:30~14:15',
    '14:25~15:10',
    '15:20~16:05',
    '16:25~17:10',
    '17:20~18:05',
    '19:00~19:45',
    '19:55~20:40',
    '20:50~21:35',
    '21:45~22:30',
]

// 计算当前是第几周
function getCurrWeek(StartDate) {
    let _curr_date = util.getDate()
    let CurrDate = `${_curr_date.year}-${_curr_date.month}-${_curr_date.day}`
    let distance = util.daysDistance2(StartDate, CurrDate)
    if (distance >= 0 ) return parseInt(distance / 7 + 1)
    else {
        if (distance % 7 === 0) return parseInt(distance / 7) + 1
        else return parseInt(distance / 7)
    }
}
function getTimeFromIndex(index) {
    return time_table[index].split('~')
}
// 行课时间与课程节数转换
/**
 *  -1 表示当天课程已经结束
 */
function getLessonIndex(time) {
    let time_list = [
        [9, 15],
        [10, 10],
        [11, 15],
        [12, 10],
        [14, 15],
        [15, 10],
        [16, 5],
        [17, 10],
        [18, 5],
        [19, 45],
        [20, 40],
        [21, 35],
        [22, 30],
    ]
    for (let i = 0; i < time_list.length; i++) {
        if (util.compareTime(time, {hour: time_list[i][0], minute: time_list[i][1]}) <= 0) {
            return i
        }
    }
    return -1
}


module.exports = {
    getCurrWeek,
    getTimeFromIndex,
    getLessonIndex,
}