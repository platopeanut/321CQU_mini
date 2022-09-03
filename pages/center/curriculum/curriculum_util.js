const util = require("../../../utils/util")
const eval5 = require("../../../lib/eval5")

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
let defaultCode = "2:5,3:7,4:8,5:9,x:x+3:x>=7"


// 周数映射: 对于大一
function getChangedWeekIndex(currWeekIndex) {
    let Temporary = wx.getStorageSync('Temporary');
    if (Temporary && Temporary['CurriculumChange']) {
        if (currWeekIndex === 1) return 7;
        if (currWeekIndex === 2) return 5;
        if (currWeekIndex === 3) return 7;
        if (currWeekIndex === 4) return 8;
        if (currWeekIndex === 5) return 9;
        if (currWeekIndex === 6) return 6;
        if (currWeekIndex >= 7)
            return currWeekIndex + 3;
        return currWeekIndex;
    } else return currWeekIndex;
}

// 解析函数
function parseCode(index, code=defaultCode) {
    let Temporary = wx.getStorageSync('Temporary');
    if (Temporary && Temporary['CurriculumChange']) {
        if (Temporary['CurriculumIndexCode'])
            code = Temporary['CurriculumIndexCode']
        let items = code.split(',')
        for (const item of items) {
            if (item[0] === 'x') {
                let xyz = item.split(":")
                const func = new eval5.Function('x', `if(${xyz.length} === 2 || ${xyz[2]}) return ${xyz[1]};else return x;`)
                return parseInt(func(index))
            } else {
                let xy = item.split(':')
                if (index === parseInt(xy[0])) {
                    return parseInt(xy[1])
                }
            }
        }
        return index
    } else return index
}

// 计算当前是第几周
function getCurrWeek(StartDate, CurrDate=null) {
    if (!CurrDate) {
        let _curr_date = util.getDate()
        CurrDate = `${_curr_date.year}-${_curr_date.month}-${_curr_date.day}`
    }
    let distance = util.daysDistance2(StartDate, CurrDate)
    if (distance >= 0 ) return parseInt(distance / 7 + 1)
    else {
        if (distance % 7 === 0) return parseInt(distance / 7) + 1
        else return parseInt(distance / 7)
    }
}

// 获取当前周数
function getCurrWeekIndex() {
    let Curriculum = wx.getStorageSync('Curriculum')
    if (Curriculum === '') return -1
    let CurrTerm = Curriculum['CurrTerm']
    let CurrTermInfo = Curriculum[CurrTerm]['TermInfo']
    return getCurrWeek(CurrTermInfo.StartDate)
}

function getTimeFromIndex(index) {
    return time_table[index].split('~')
}

// date为Date类型，flag：-1 为指定日期上一周， 1 为指定日期下一周
function getNeighborDayList(date, flag) {
    let week_list = [['周一'],['周二'],['周三'],['周四'],['周五'],['周六'],['周日']]
    let day_list = []
    let week_index = date.getDay()   // 周几
    if (week_index === 0) week_index = 7
    let _date = new Date(date.getTime() + 24*60*60*1000*7*flag)
    for (let i = week_index-1; i >=0; i--) {
        day_list.push(new Date(_date.getTime() - 24*60*60*1000*i).getDate())
    }
    for (let i = 0; i < 7-week_index; i++) {
        day_list.push(new Date(_date.getTime() + 24*60*60*1000*(i+1)).getDate())
    }
    for (let i = 0; i < week_list.length; i++) {
        week_list[i].push(day_list[i])
    }
    return {
        week_list: week_list,
        month: _date.getMonth(),
        year: _date.getFullYear()
    }
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

// 送给首页的信息
function getIndexInfo() {
    let Curriculum = wx.getStorageSync('Curriculum')
    if (Curriculum === '') return null
    let CurrTerm = Curriculum['CurrTerm']
    let CurrTable = Curriculum[CurrTerm]['Table']
    let CurrTermInfo = Curriculum[CurrTerm]['TermInfo']
    let SelfSchedule = Curriculum['SelfSchedule']
    if (!SelfSchedule) SelfSchedule = []
    let Priority = Curriculum['Priority']
    if (!Priority) Priority = []

    let display_week = getCurrWeek(CurrTermInfo.StartDate)
    let week = parseCode(display_week)

    CurrTable = filterCourses(CurrTable)
    let curriculum = createTable(SelfSchedule, CurrTable)    // 自定义课程优先级高
    adaptPriority(curriculum, Priority)

    let _today = new Date().getDay() - 1
    if (_today === -1) _today = 6

    let info = {
        'display_week': display_week,
        'week': week,
        'today': "一二三四五六日".split(/(?!\b)/)[_today],
        'classes': null
    }
    if (!curriculum[week] || !curriculum[week][_today]) info['classes'] = []
    else info['classes'] = curriculum[week][_today]
    return info
}

function getCurrWeekList(curDate) {
    let week_list = [['周一'],['周二'],['周三'],['周四'],['周五'],['周六'],['周日']]
    let day_list = []
    let week_index = curDate.getDay()   // 周几
    if (week_index===0) week_index = 7
    for (let i = week_index-1; i >=0; i--) {
        day_list.push(new Date(curDate.getTime() - 24*60*60*1000*i).getDate())
    }
    for (let i = 0; i < 7-week_index; i++) {
        day_list.push(new Date(curDate.getTime() + 24*60*60*1000*(i+1)).getDate())
    }
    for (let i = 0; i < week_list.length; i++) {
        week_list[i].push(day_list[i])
    }
    return week_list
}


function parseFormat(str) {
    let list = str.split(',')
    let result = []
    for (const item of list) {
        let period = item.split('-')
        if (period.length === 1) {
            if (period[0] === '') continue
            result.push(parseInt(period[0]))
            continue
        }
        let start = parseInt(period[0])
        let finish = parseInt(period[1])
        for (let i = start; i <= finish; i++) result.push(i)
    }
    return result
}

function parseWeekDayFormat(str) {
    let week_list = ['一', '二', '三', '四', '五', '六', '日']
    for (let i = 0; i < week_list.length; i++) {
        if (week_list[i] === str) return i
    }
}

function filterCourses(Courses) {
    return Courses.filter(item => {
        return item['PeriodFormat'] && item['TeachingWeekFormat'] && item['WeekDayFormat']
    })
}

function selectColor(...list) {
    const color_list = [
        '#ff9b6a',
        '#addc81',
        '#87ceca',
        '#fecb62',
        '#f06c79',
        '#e286ab',
        '#67bdde',
        '#79cea5',
        '#f0b7e2',
        '#ddd38c',
        '#fc9d99',
        '#facdae',
        '#c7c8a8',
        '#c9ba83',
        '#de9c52',
        '#f9a782',
        '#84af9b',
        '#d2a495',
        '#8abeb2',
        '#6bc235',
        '#269d81',
        '#fecb62',
    ]
    let course_code_list = []
    let idx = 0
    for (const section of list) {
        for (const item of section) {
            let i = 0
            for (;i < course_code_list.length; i++) {
                if (course_code_list[i] === item['CourseCode']) {
                    item['Color'] = color_list[i]
                    break
                }
            }
            if (i === course_code_list.length) {
                item['Color'] = color_list[idx]
                course_code_list.push(item['CourseCode'])
                if (color_list.length - 1> idx) idx ++
            }
        }
    }
}

function createTable(...list) {
    let table = {}
    for (const section of list) {
        for (const item of section) {
            for (const teachingWeek of parseFormat(item['TeachingWeekFormat'])) {
                if (!table[teachingWeek]) {
                    table[teachingWeek] = new Array(7)
                    for (let i = 0; i < 7; i++) table[teachingWeek][i] = new Array(13)
                }
                let weekDay = parseWeekDayFormat(item['WeekDayFormat'])
                let periodList = parseFormat(item['PeriodFormat'])
                for (const period of periodList) {
                    if (!table[teachingWeek][weekDay][period-1])
                        table[teachingWeek][weekDay][period-1] = []
                    // 拷贝赋值！！！
                    table[teachingWeek][weekDay][period-1].push(Object.assign({
                        'PeriodLength': periodList.length
                    }, item))
                }
            }
        }
    }
    return table
}

function adaptPriority(table, priority_queue) {
    // priority_queue: CourseCode组成的优先级队列
    for (const teachingWeek in table) {
        for (const day of table[teachingWeek]) {
            for (const item of day) {
                if (item) {
                    for (const CourseCode of priority_queue) {
                        for (let i = 0; i < item.length; i++) {
                            if (item[i]['CourseCode'] === CourseCode) {
                                let curr = item.splice(i, 1)[0]
                                item.unshift(curr)
                            }
                        }
                    }
                }
            }
        }
    }
}

function UIProcess(table) {
    for (const teachingWeek in table) {
        for (const day of table[teachingWeek]) {
            for (let i = 0; i < day.length; i++) {
                if (day[i]) {
                    let j = i + 1
                    for (;j < day.length && j - i < day[i][0]['PeriodLength']; j++) {
                        if (!day[j] || day[j][0]['CourseCode'] !== day[i][0]['CourseCode']) break
                    }
                    for (let k = i + 1; k < j; k++) {
                        if (day[k].length > 1) {
                            for (let l = 1; l < day[k].length; l++) {
                                let exist = false
                                for (let m = 0; m < day[i].length; m++) {
                                    if (day[i][m].CourseCode === day[k][l].CourseCode) {
                                        exist = true
                                        break
                                    }
                                }
                                if (!exist) day[i].push(day[k][l])
                            }
                        }
                    }
                    day[i][0]['UILength'] = j - i
                    day.splice(i + 1, j - i - 1)
                }
            }
        }
    }
    return table
}

module.exports = {
    parseFormat,
    selectColor,
    createTable,
    adaptPriority,
    UIProcess,
    filterCourses,
    getIndexInfo,
    getCurrWeek,
    getLessonIndex,
    getTimeFromIndex,

    getCurrWeekList,
    getCurrWeekIndex,
    getNeighborDayList,
    getChangedWeekIndex,
    parseCode,
    defaultCode,
}