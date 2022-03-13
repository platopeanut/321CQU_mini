const util = require("../../../utils/util");

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
        '#87ceca',
        '#fecb62',
        '#f06c79',
        '#e286ab',
        '#67bdde',
        '#79cea5',
        '#f0b7e2',
        '#fecb62',
        '#f9a782',
        '#d2a495',
        '#fc9d99',
        '#facdae',
        '#c7c8a8',
        '#84af9b',
        '#8abeb2',
        '#c9ba83',
        '#ddd38c',
        '#de9c52',
        '#addc81',
        '#6bc235',
        '#269d81',
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
                for (const period of parseFormat(item['PeriodFormat'])) {
                    if (!table[teachingWeek][weekDay][period-1])
                        table[teachingWeek][weekDay][period-1] = []
                    // 拷贝赋值！！！
                    table[teachingWeek][weekDay][period-1].push(Object.assign({}, item))
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
                    for (;j < day.length; j++) {
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
}