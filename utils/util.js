/**
 *  常用方法
 */


// 获取当前日期
function getDate() {
    let timestamp = Date.parse(new Date());
    let date = new Date(timestamp);
    //获取年份  
    let Y =date.getFullYear();
    //获取月份  
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //获取当日日期 
    let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(); 
    return {
        year: Y,
        month: M,
        day: D
    }
}

// 获取当前时间
function getTime() {
    let date = new Date()
    return {
        hour: date.getHours() + 1,
        minute: date.getMinutes(),
        second: date.getSeconds()
    }
}


// 比较两个日期的先后传入date1，date2，返回-1，0，1表示date1-date2
function compareDate(date1, date2) {
    if (date1.year > date2.year) return 1
    else if (date1.year < date2.year) return -1
    else {
        if (date1.month > date2.month) return 1
        else if (date1.month < date2.month) return -1
        else {
            if (date1.day > date2.day) return 1
            else if (date1.day < date2.day) return -1
            else return 0
        }
    }
}

// 比较两个时间先后 -1 0 1,时，分
function compareTime(time1, time2) {
    if (time1.hour > time2.hour) return 1
    else if (time1.hour < time2.hour) return -1
    else {
        if (time1.minute > time2.minute) return 1
        else if (time1.minute < time2.minute) return -1
        else return 0
    }
}


// 解析日期
function parseDate(str, sep='-') {
    let date = str.split(sep)
    return {
        year: parseInt(date[0]),
        month: parseInt(date[1]),
        day: parseInt(date[2])
    }
}

// 解析时间
function parseTime(str, sep=':') {
    let time = str.split(sep)
    return {
        hour: parseInt(time[0]),
        minute: parseInt(time[1])
    }
}


// 计算两个日期之间的天数
/**
 * 计算两个日期之间的天数
 *  date1  开始日期 yyyy-MM-dd
 *  date2  结束日期 yyyy-MM-dd
 *  如果日期相同 返回一天 开始日期大于结束日期，返回0
 */
function daysDistance(date1,date2){
    let startDate = Date.parse(date1);
    let endDate = Date.parse(date2);
    if (startDate>endDate){
        return 0;
    }
    if (startDate===endDate){
        return 1;
    }
    return  (endDate - startDate) / (24 * 60 * 60 * 1000);
}
function daysDistance2(date1,date2){
    let startDate = Date.parse(date1);
    let endDate = Date.parse(date2);
    return  (endDate - startDate) / (24 * 60 * 60 * 1000);
}



// 解析字符串到对象
function parseFromStr(str) {
    return JSON.parse(str)
}

// 分数转换为绩点
function score2point(score) {
    if (score.startsWith('优'))
        score = 95
    else if (score.startsWith('良') || score === '合格')
        score = 85
    else if (score.startsWith('中'))
        score = 75
    else if (score === '及格')
        score = 65
    else if (score === '不及格' || score === '不合格')
        score = 50
    if (score < 0 || score > 100 || isNaN(score)) return ''
    else {
        if (score < 60) return 0
        if (score >= 90) return 4
        let a = score % 10 * 0.1
        let b = parseInt(score / 10) - 6 + 1
        return a + b
    }
}
  
function showError(res) {
    wx.showToast({
        title: `[error:${res.data.ErrorCode}] ${res.data.ErrorInfo}`,
        icon: 'none'
    })
}

function parseFormat2List(str) {
    let result = []
    let list = str.split(',')
    for (let i = 0; i < list.length; i++) {
        let item = list[i].split('-')
        if (item.length === 1) {
            result.push(parseInt(item[0]))
            continue
        }
        let left = parseInt(item[0])
        let right = parseInt(item[1])
        for (let j = left; j <= right; j++) {
            result.push(j)
        }
    }
    return result
}

function parseFormat2Lesson(str) {
    let list = str.split('-')
    if (list.length === 1) return [list[0], 1]
    return [parseInt(list[0]), parseInt(list[1]) - parseInt(list[0]) + 1]
}

// ClassNbr: "049977-652"
// CourseCode: "EDS20501"
// CourseName: "商务英语翻译"
// Credit: "2"
// InstructorName: "邓春-[主讲];"
// PeriodFormat: "1-2"
// RoomName: "D1201"
// TeachingWeekFormat: "1-4,6-17"
// WeekDayFormat: "五"
function parseWeekDayFormat(str) {
    let week_list = ['一', '二', '三', '四', '五', '六', '日']
    for (let i = 0; i < week_list.length; i++) {
        if (week_list[i] === str) return i
    }
}
function parseLesson(data) {
    let book = {}
    for (const item of data) {
        for (const week_index of parseFormat2List(item.TeachingWeekFormat)) {
            if(!book[week_index]) {
                book[week_index] = new Array(7)
                for (let i = 0; i < 7; i++) {
                    book[week_index][i] = new Array(13)
                }
            }
            if (!item.WeekDayFormat || !item.PeriodFormat) continue
            for (const index of parseFormat2List(item.PeriodFormat)) {
                book[week_index][parseWeekDayFormat(item.WeekDayFormat)][index-1] = item
            }
        }
    }
    return book
}

function getLessonList(data) {
    let lesson_list = []
    for (const item of data) {
        if(!lesson_list.includes(item.CourseCode)) lesson_list.push(item.CourseCode)
    }
    return lesson_list
}

function shuffle(arr){
    let l = arr.length
    let index, temp
    while(l>0){
        index = Math.floor(Math.random()*l)
        temp = arr[l-1]
        arr[l-1] = arr[index]
        arr[index] = temp
        l--
    }
    return arr
}

module.exports = {
    getDate,
    parseFromStr,
    compareDate,
    parseDate,
    getTime,
    compareTime,
    parseTime,
    daysDistance,
    daysDistance2,
    score2point,
    showError,
    parseLesson,
    getLessonList,
    shuffle,
}