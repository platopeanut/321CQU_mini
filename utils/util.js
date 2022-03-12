const curriculum_tool = require("../pages/center/curriculum/curriculum_tool");
/**
 *  常用方法
 */

const dormitory = {
    'A区': ['选择楼栋','一舍学生宿舍','二舍学生宿舍','三舍学生宿舍','四舍学生宿舍','五舍学生宿舍','六舍学生宿舍','七舍学生宿舍','八舍学生宿舍','九舍学生宿舍','十舍学生宿舍','十一舍学生宿舍','十二舍学生宿舍','A栋宿舍','C栋宿舍','D栋宿舍'],
    'B区': ['选择楼栋','一舍学生宿舍','二舍学生宿舍','三舍学生宿舍','四舍学生宿舍','五舍学生宿舍','六舍学生宿舍','七舍学生宿舍','八舍学生宿舍','九舍学生宿舍','十舍学生宿舍','十一舍学生宿舍','十二舍学生宿舍'],
    'C区': ['选择楼栋','一号学生宿舍','二号学生宿舍','三号学生宿舍','四号学生宿舍','五号学生宿舍'],
    '虎溪梅园': ['选择楼栋','一幢','二幢','三幢','四幢','五幢','六幢','七幢'],
    '虎溪竹园': ['选择楼栋','一幢','二幢','三幢','四幢','五幢','六幢'],
    '虎溪松园': ['选择楼栋','一幢','二幢','三幢','四幢','五幢','六幢','七幢'],
    '虎溪兰园': ['选择楼栋','一幢','二幢','三幢','四幢','五幢','六幢','七幢', '八幢'],
}
function get_dormitory (zone= '选择校区') {
    if (zone === '选择校区') return ['选择楼栋']
    else return dormitory[zone]
}

function get_campus_list() {
    //return ['选择校区','虎溪梅园', '虎溪竹园', '虎溪松园', '虎溪兰园']
    return ['选择校区', 'A区','B区','C区','虎溪梅园', '虎溪竹园', '虎溪松园', '虎溪兰园']
}
const dormitory_code = {
    'A区': 'A',
    'B区': 'B',
    'C区': 'C',
    '虎溪梅园': 'A',
    '虎溪竹园': 'B',
    '虎溪松园': 'C',
    '虎溪兰园': 'D',
}

function get_dormitory_code(room) {
    let code = dormitory_code[room['campus']]
    code += dormitory[room['campus']].indexOf(room['building'])
    code += room['room_id']
    return code
}
//老校区查寝室水电费规范码 
function get_dormitory_code_inABC(room){
    let code = dormitory_code[room['campus']]  
    // n —— 宿舍号
    if( code === 'A'){
        let n = dormitory[room['campus']].indexOf(room['building'])
        if( n > 12 ){
            if( n-12 === 1) code += 'A'
            else if( n-12 ===2) code += 'C'
            else code += 'D'
        }
        else code += n
    }
    else code += dormitory[room['campus']].indexOf(room['building'])
    code += 'S'
    //"-"改为'F'
    let num = room['room_id']
    for (let i = 0; i < num.length; i++) {
        if (num[i] === '-')  code += 'F'
        else code += num[i]
    }

    return code  
}

// 计算当前是第几周
function getCurrWeek(StartDate) {
    let _curr_date = getDate()
    let CurrDate = `${_curr_date.year}-${_curr_date.month}-${_curr_date.day}`
    let distance = daysDistance2(StartDate, CurrDate)
    if (distance >= 0 ) return parseInt(distance / 7 + 1)
    else {
        if (distance % 7 === 0) return parseInt(distance / 7) + 1
        else return parseInt(distance / 7)
    }
}



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

function get_time_from_index(index) {
    return time_table[index].split('~')
}


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
function score2point(score, calculation_rule) {
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
        if (calculation_rule === 'four') {
            if (score < 60) return 0
            if (score >= 90) return 4
            let a = score % 10 * 0.1
            let b = parseInt(score / 10) - 6 + 1
            return a + b
        } else if (calculation_rule === 'five') {
            if (score < 60) return 0
            let a = score % 10 * 0.1
            let b = parseInt(score / 10) - 6 + 1
            return a + b
        }
    }
}
  
function showError(res, prefix='') {
    wx.showToast({
        title: `[${prefix}][error:${res.data.ErrorCode}] ${res.data.ErrorInfo}`,
        icon: 'none'
    })
}

function parseFormat2Lesson(str) {
    let list = str.split('-')
    if (list.length === 1) return [list[0], 1]
    return [parseInt(list[0]), parseInt(list[1]) - parseInt(list[0]) + 1]
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

// 送给首页的信息
function get_index_info() {
    let Curriculum = wx.getStorageSync('Curriculum')
    if (Curriculum === '') {
        return {
            today_info: {
                week: 'unknown',
                today: new Date().getDay()
            },
            curriculum_info: '请先刷新课表数据'
        }
    }
    let CurrTerm = Curriculum['CurrTerm']
    let CurrTable = Curriculum[CurrTerm]['Table']
    let CurrTermInfo = Curriculum[CurrTerm]['TermInfo']
    let SelfSchedule = Curriculum['SelfSchedule']
    if (!SelfSchedule) SelfSchedule = []
    let Priority = Curriculum['Priority']
    if (!Priority) Priority = []

    let week = getCurrWeek(CurrTermInfo.StartDate)
    CurrTable = curriculum_tool.filterCourses(CurrTable)
    let curriculum = curriculum_tool.createTable(SelfSchedule, CurrTable)    // 自定义课程优先级高
    curriculum_tool.adaptPriority(curriculum, Priority)


    let curriculum_info = ''
    let _today = new Date().getDay() - 1
    if (_today === -1) _today = 6
    if (curriculum[week] === undefined || curriculum[week][_today] === undefined)
        curriculum_info = '今日无课'
    else {
        let _list = curriculum[week][_today]
        let _flag = false
        for (const item of _list) {
            if (item) _flag = true
        }
        if (!_flag) curriculum_info = '今日无课'
        else {
            let _time = new Date()
            let index = get_lesson_index({
                hour: _time.getHours(),
                minute: _time.getMinutes()
            })
            if (index === -1) {
                curriculum_info = '今日无课'
            } else {
                for (let i = index; i < _list.length; i ++) {
                    if (_list[i]) {
                        index = i
                        let time_li = get_time_from_index(index)
                        if (_list[index][0]['Self'])
                            curriculum_info = `${time_li[0]}~${time_li[1]}\n${_list[index][0].CourseName}`
                        else curriculum_info = `${time_li[0]}~${time_li[1]}\n${_list[index][0].CourseName}\n${_list[index][0].RoomName}`
                        break
                    }
                }
            }
        }
    }
    return {
        today_info: {
            week: week,
            today: new Date().getDay()
        },
        curriculum_info: curriculum_info
    }
}

// 行课时间与课程节数转换
/**
 *  -1 表示当天课程已经结束
 */
function get_lesson_index(time) {
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
        if (compareTime(time, {hour: time_list[i][0], minute: time_list[i][1]}) <= 0) {
            return i
        }
    }
    return -1
}


module.exports = {
    dormitory,
    getDate,
    parseFromStr,
    compareDate,
    parseDate,
    getTime,
    compareTime,
    parseTime,
    daysDistance,
    score2point,
    showError,
    shuffle,
    get_index_info,
    get_time_from_index,
    get_lesson_index,
    get_dormitory,
    get_campus_list,
    get_dormitory_code,
    get_dormitory_code_inABC,
    getCurrWeek,
}