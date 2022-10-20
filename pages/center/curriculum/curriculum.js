const curriculum_api = require('./curriculum_api')
const util = require('../../../utils/util')
const curriculum_util = require('./curriculum_util')

Page({
    data: {
        time_height: 0,
        curr_week: -1,
        year: -1,
        month: -1,  // 月份
        week: -1,   // 第几周
        display_week : -1,
        today: -1,   // 今天周几

        week_list: null,    // 顶部
        table: null,    // 主体课表

        currDetailLessons: null,

        showMode: 0, // 显示模式，0为每周，1为整个学期
        detailState: false,
        selectTermState: false,
        longPressState: false,

        CurrTermInfo: null,
        CurrTerm: null,
        term_list: [],

        // 手势操作
        clientX: -1,
    },

    onShow: function() {
        let that = this
        let now_date = new Date()       // 客观当前日期
        this.setData({
            time_height: that.getTimeHeight(now_date),
            year: now_date.getFullYear(),
            month: now_date.getMonth(),
            today: now_date.getDay(),
            week_list: curriculum_util.getCurrWeekList(now_date),
        })
        let Curriculum = wx.getStorageSync('Curriculum')
        if (!Curriculum) return
        let CurrTerm = Curriculum['CurrTerm']
        let CurrTermInfo = Curriculum[CurrTerm]['TermInfo']
        let display_week = curriculum_util.getCurrWeek(CurrTermInfo.StartDate)
        let week = curriculum_util.parseCode(display_week)
        this.setData({
            week: week,
            curr_week: week,
            display_week: display_week,
        })
        this.buildTable()
    },

    getTimeHeight(now_date) {
        if (util.compareTime({
            hour: now_date.getHours(),
            minute: now_date.getMinutes()
        }, {hour:8, minute:30}) <=0) return 1;
        else if (util.compareTime({
            hour: now_date.getHours(),
            minute: now_date.getMinutes()
        }, {hour:22, minute:30}) >=0) return 1690 - 1;

        let index = curriculum_util.getLessonIndex({
            hour: now_date.getHours(),
            minute: now_date.getMinutes()
        })
        let zone = curriculum_util.getTimeFromIndex(index)[0].split(':')
        // time2 - time1
        function time_sub(time1, time2) {
            return (time2.hour - time1.hour) * 60 + (time2.minute - time1.minute)
        }
        let _time_sub = time_sub({
            hour: parseInt(zone[0]),
            minute: parseInt(zone[1])
        }, {
            hour: now_date.getHours(),
            minute: now_date.getMinutes()
        })
        if (_time_sub < 0) _time_sub = 0
        return index * 130 + _time_sub*130/45
    },


    // -1 为指定日期上一周， 1 为指定日期下一周
    getNeighborDayList(date, flag) {
        let result = curriculum_util.getNeighborDayList(date, flag)
        let week_list = result['week_list']
        this.setData({
            month: result['month'],
            year: result['year']
        })
        return week_list
    },

    nextWeek() {
        let that = this
        if (that.data.today === 0) that.data.today = 7
        let date = new Date(this.data.year, this.data.month, this.data.week_list[that.data.today - 1][1])
        this.setData({
            display_week: that.data.display_week + 1,
            week: curriculum_util.parseCode(that.data.display_week + 1),
            week_list: that.getNeighborDayList(date, 1),
        })
    },

    preWeek() {
        let that = this
        if (that.data.today === 0) that.data.today = 7
        let date = new Date(this.data.year, this.data.month, this.data.week_list[that.data.today - 1][1])
        this.setData({
            display_week: that.data.display_week - 1,
            week: curriculum_util.parseCode(that.data.display_week - 1),
            week_list: that.getNeighborDayList(date, -1),
        })
    },

    onTouchStart(e) {
        this.setData({
            clientX: e.changedTouches[0].clientX
        })
    },

    onTouchEnd(e) {
        let distance = e.changedTouches[0].clientX
        if (distance - this.data.clientX >= 100) this.preWeek()
        else if (distance - this.data.clientX <= -100) this.nextWeek()
        this.setData({
            clientX: -1
        })
    },

    hideModal() {
        this.setData({
            detailState: false,
            selectTermState: false,
            longPressState: false,
        })
    },

    getDetailLessonInfo(e) {
        let item_list = e.currentTarget.dataset.item
        function teaching_time_helper(n, self=false) {
            if (!self) n.InstructorName = n.InstructorName.replace('-[主讲];', ' ')
            let time_list = n.PeriodFormat.split(',')
            n.TeachingTime = ''
            time_list.forEach((item, idx) => {
                if (idx !== 0) n.TeachingTime += ', '
                let time = item.split('-')
                if (time.length === 1) time.push(time[0])
                let start_time = curriculum_util.getTimeFromIndex(time[0] - 1)[0]
                let end_time = curriculum_util.getTimeFromIndex(time[1] - 1)[1]
                n.TeachingTime += start_time + '~' + end_time
            })
            return n
        }
        for (let i = 0; i < item_list.length; i++) {
            item_list[i] = teaching_time_helper(item_list[i], item_list[i].Self)
        }
        this.setData({
            detailState: true,
            currDetailLessons: item_list
        })
    },
    switchModelTo1() {
        this.setData({
            showMode: 1
        })
    },
    switchModelTo0() {
        this.setData({
            showMode: 0
        })
    },
    selectTerm: function() {
        this.setData({
            selectTermState: true,
        })
    },
    selectTerm2: function (e) {
        let item = e.currentTarget.dataset.item
        let Curriculum = wx.getStorageSync('Curriculum')
        for (const Term in Curriculum) {
            if (Curriculum[Term]['TermInfo']['Term'] === item) {
                Curriculum['CurrTerm'] = Term
                wx.setStorageSync('Curriculum', Curriculum)
                break
            }
        }
        this.onShow()
    },
    updateData: function() {
        let that = this
        let StuInfo = wx.getStorageSync('StuInfo')
        let stu_id = StuInfo['stu_id']
        let uid = StuInfo['uid']
        let uid_pwd = StuInfo['uid_pwd']
        if (!(stu_id && uid && uid_pwd)) {
            wx.showToast({
                title: '请绑定学号，统一身份账号及密码',
                icon: 'none'
            })
            return
        }
        let Curriculum = wx.getStorageSync('Curriculum')
        if (Curriculum === '') Curriculum = {
            'Curr': {'TermInfo': null, 'Table': null,},
            'Next': {'TermInfo': null, 'Table': null,}
        }
        // 1.获取当前学期学校信息
        curriculum_api.getSchoolCurrTermInfo(uid, uid_pwd).then(res => {
            Curriculum['Curr']['TermInfo'] = {
                StartDate: res.StartDate,
                EndDate: res.EndDate,
                Term: res.Term
            }
            return curriculum_api.getCurriculum(stu_id, uid, uid_pwd)
        }, err => {
            Curriculum['Curr'] = {'TermInfo': null, 'Table': null}
            return new Promise(()=>{})
        }).then(res => {
            Curriculum['Curr']['Table'] = res.Courses
            return curriculum_api.getSchoolNextTermInfo(uid, uid_pwd)
        }, err => {
            Curriculum['Curr']['Table'] = null
            return new Promise(()=>{})
        }).then(res => {
            Curriculum['Next']['TermInfo'] = {
                StartDate: res.StartDate,
                EndDate: res.EndDate,
                Term: res.Term
            }
            return curriculum_api.getNextCurriculum(stu_id, uid, uid_pwd)
        }, err => {
            Curriculum['Next'] = {'TermInfo': null, 'Table': null}
            return new Promise(()=>{})
        }).then(res => {
            Curriculum['Next']['Table'] = res.Courses
            wx.showToast({
                title: '当前学期课表信息加载完毕\n下一学期课表信息加载完毕',
                icon: 'none'
            })
        }, err => {
            Curriculum['Next']['Table'] = null
        }).finally(() => {
            Curriculum['CurrTerm'] = 'Curr'
            wx.setStorageSync('Curriculum', Curriculum)
            that.onShow()
        })
    },

    buildTable: function () {
        let Curriculum = wx.getStorageSync('Curriculum')
        let term_list = []
        if (Curriculum['Curr']['TermInfo']) term_list.push(Curriculum['Curr']['TermInfo']['Term'])
        if (Curriculum['Next']['TermInfo']) term_list.push(Curriculum['Next']['TermInfo']['Term'])
        let CurrTerm = Curriculum['CurrTerm']
        let CurrTermInfo = Curriculum[CurrTerm]['TermInfo']
        let CurrTable = Curriculum[CurrTerm]['Table']
        let SelfSchedule = Curriculum['SelfSchedule']
        if (!SelfSchedule) SelfSchedule = []
        let Priority = Curriculum['Priority']
        if (!Priority) Priority = []
        CurrTable = curriculum_util.filterCourses(CurrTable)
        curriculum_util.selectColor(CurrTable, SelfSchedule)
        let table = curriculum_util.createTable(SelfSchedule, CurrTable)    // 自定义课程优先级高
        curriculum_util.adaptPriority(table, Priority)
        table = curriculum_util.UIProcess(table)
        this.setData({
            table: table,
            CurrTermInfo: CurrTermInfo,
            CurrTerm: CurrTerm,
            term_list: term_list,
        })
    },

    setPriority: function (e) {
        let that = this
        let idx = e.currentTarget.dataset.index
        let CourseCode = this.data.currDetailLessons[idx]['CourseCode']

        wx.showActionSheet({
            itemList: ['提高显示优先级'],
            success: res => {
                if (res.tapIndex === 0) {
                    let Curriculum = wx.getStorageSync('Curriculum')
                    let Priority = Curriculum['Priority']
                    if (!Priority) Priority = []
                    let i = 0
                    for (; i < Priority.length; i++) {
                        if (Priority[i] === CourseCode) {
                            Priority.splice(i, 1)
                            Priority.push(CourseCode)
                            break
                        }
                    }
                    if (i === Priority.length) Priority.push(CourseCode)
                    Curriculum['Priority'] = Priority
                    wx.setStorageSync('Curriculum', Curriculum)
                    wx.showToast({
                        title: '设置成功',
                        icon: 'none'
                    })
                    that.onShow()
                }
            }
        })
    },

    longPressOperation: function () {
        let that = this
        wx.vibrateShort()
        wx.showActionSheet({
            itemList: ['课表配置','刷新课表'],
            success: res => {
                if (res.tapIndex === 0) {
                    wx.navigateTo({
                        url: './config/config'
                    })
                } else if (res.tapIndex === 1) {
                    that.updateData()
                }
            }
        })
    }
})
