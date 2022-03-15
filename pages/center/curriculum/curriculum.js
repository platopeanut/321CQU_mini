const api = require('../../../utils/api')
const util = require('../../../utils/util')
const curriculum_tool = require('./curriculum_tool')
const {getSchoolNextTermInfo} = require("../../../utils/api");

Page({
    data: {
        time_height: 0,
        //用户选择
        curr_year: -1,
        curr_month: -1,
        curr_week: -1,
        //标准时间
        year: -1,
        month: -1,  // 月份
        week: -1,   // 第几周
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
    },

    onShow: function() {
        let that = this
        this.setData({
            time_height: that.getTimeHeight()
        })
        // !this.data.CurrTermInfo || !this.data.table
        this.setData({
            curr_year: new Date().getFullYear(),
            year: new Date().getFullYear(),
            curr_month: new Date().getMonth(),
            month: new Date().getMonth(),
            today: new Date().getDay(),
            week_list: that.getCurrWeekList(),
        })
        this.buildTable()
        this.setData({
            curr_week: util.getCurrWeek(that.data.CurrTermInfo.StartDate),
            week: util.getCurrWeek(that.data.CurrTermInfo.StartDate),
        })
    },

    getTimeHeight() {
        let _time = new Date()
        if (util.compareTime({
            hour: _time.getHours(),
            minute: _time.getMinutes()
        }, {hour:8, minute:30}) <=0) return 1;
        else if (util.compareTime({
            hour: _time.getHours(),
            minute: _time.getMinutes()
        }, {hour:22, minute:30}) >=0) return 1690 - 1;

        let index = util.get_lesson_index({
            hour: _time.getHours(),
            minute: _time.getMinutes()
        })
        let zone = util.get_time_from_index(index)[0].split(':')
        // time2 - time1
        function time_sub(time1, time2) {
            return (time2.hour - time1.hour) * 60 + (time2.minute - time1.minute)
        }
        let _time_sub = time_sub({
            hour: parseInt(zone[0]),
            minute: parseInt(zone[1])
        }, {
            hour: _time.getHours(),
            minute: _time.getMinutes()
        })
        if (_time_sub < 0) _time_sub = 0
        return index * 130 + _time_sub*130/45
    },

    getCurrWeekList() {
        let week_list = [['周一'],['周二'],['周三'],['周四'],['周五'],['周六'],['周日']]
        let day_list = []
        let curDate = new Date()
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
    },

    // -1 为指定日期上一周， 1 为指定日期下一周
    getNeighborDayList(date, flag) {
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
        this.setData({
            month: _date.getMonth(),
            year: _date.getFullYear()
        })
        return week_list
    },

    nextWeek() {
        let that = this
        if (that.data.today === 0) that.data.today = 7
        let date = new Date(this.data.year, this.data.month, this.data.week_list[that.data.today - 1][1])
        this.setData({
            week: that.data.week+1,
            week_list: that.getNeighborDayList(date, 1),
        })
    },

    preWeek() {
        let that = this
        if (that.data.today === 0) that.data.today = 7
        let date = new Date(this.data.year, this.data.month, this.data.week_list[that.data.today - 1][1])
        this.setData({
            week: that.data.week-1,
            week_list: that.getNeighborDayList(date, -1),
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
        let that = this
        let item_list = e.currentTarget.dataset.item
        function teaching_time_helper(n, self=false) {
            if (!self) n.InstructorName = n.InstructorName.replace('-[主讲];', ' ')
            let time_list = n.PeriodFormat.split('-')
            if (time_list.length === 1) time_list.push(time_list[0])
            let start_time = util.get_time_from_index(time_list[0] - 1)[0]
            let end_time = util.get_time_from_index(time_list[1] - 1)[1]
            n.TeachingTime = start_time + '~' + end_time
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
        if (stu_id === '' || uid === '' || uid_pwd === '') {
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
        api.getSchoolTermInfo(uid, uid_pwd).then(res => {
            Curriculum['Curr']['TermInfo'] = {
                StartDate: res.StartDate,
                EndDate: res.EndDate,
                Term: res.Term
            }
            return api.getCurriculum(stu_id, uid, uid_pwd)
        }, err => {
            Curriculum['Curr'] = {'TermInfo': null, 'Table': null}
            return new Promise(()=>{})
        }).then(res => {
            Curriculum['Curr']['Table'] = res.Courses
            return api.getSchoolNextTermInfo(uid, uid_pwd)
        }, err => {
            Curriculum['Curr']['Table'] = null
            return new Promise(()=>{})
        }).then(res => {
            Curriculum['Next']['TermInfo'] = {
                StartDate: res.StartDate,
                EndDate: res.EndDate,
                Term: res.Term
            }
            return api.getNextCurriculum(stu_id, uid, uid_pwd)
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
        // api.getSchoolTermInfo(uid, uid_pwd).then(res => {
        //     wx.hideLoading()
        //     if (res.statusCode === 200) {
        //         if (res.data.Statue === 1) {
        //             console.log(res.data)
        //             let schoolTermInfo = {
        //                 EndDate: res.data.EndDate,
        //                 StartDate: res.data.StartDate,
        //                 Term: res.data.Term
        //             }
        //             wx.setStorageSync('schoolTermInfo', schoolTermInfo)
        //             // 2.获取当前学期课表
        //             wx.showLoading()
        //             api.getCurriculum(stu_id, uid, uid_pwd).then(res => {
        //                 wx.hideLoading()
        //                 if (res.statusCode === 200) {
        //                     if (res.data.Statue === 1) {
        //                         console.log(res.data)
        //                         let result = util.parseLesson(res.data.Courses)
        //                         let table = result[0]
        //                         let table_extra = result[1]
        //                         let lesson_list = util.getLessonList(res.data.Courses)
        //                         wx.setStorageSync('curriculum', table)
        //                         wx.setStorageSync('lesson_list', lesson_list)
        //                         wx.setStorageSync('curriculum_extra', table_extra)
        //
        //
        //
        //                         // 3.获取下学期学校信息
        //                         wx.showLoading()
        //                         api.getSchoolNextTermInfo(uid, uid_pwd).then(res => {
        //                             wx.hideLoading()
        //                             if (res.statusCode === 200) {
        //                                 if (res.data.Statue === 1) {
        //                                     if (res.data.EndDate === undefined || res.data.StartDate === undefined || res.data.Term === undefined) {
        //                                         wx.setStorageSync('nextSchoolTermInfo', '')
        //                                         wx.setStorageSync('nextCurriculum', '')
        //                                         wx.setStorageSync('nextLesson_list', '')
        //                                         wx.setStorageSync('nextCurriculum_extra', '')
        //                                         that.onShow()
        //                                         wx.showToast({
        //                                             title: '当前学期加载成功\n暂无预览学期信息',
        //                                             icon: 'none'
        //                                         })
        //                                     } else {
        //                                         let schoolTermInfo = {
        //                                             EndDate: res.data.EndDate,
        //                                             StartDate: res.data.StartDate,
        //                                             Term: res.data.Term
        //                                         }
        //                                         wx.setStorageSync('nextSchoolTermInfo', schoolTermInfo)
        //                                         // 4.获取下学期课表
        //                                         wx.showLoading()
        //                                         api.getNextCurriculum(stu_id, uid, uid_pwd).then(res => {
        //                                             wx.hideLoading()
        //                                             if (res.statusCode === 200) {
        //                                                 if (res.data.Statue === 1) {
        //                                                     // 无课表信息适配
        //                                                     if (res.data.Courses.length === 0) {
        //                                                         wx.showToast({
        //                                                             title: '暂无下学期课表信息',
        //                                                             icon: 'none'
        //                                                         })
        //                                                         wx.setStorageSync('nextCurriculum', '')
        //                                                         wx.setStorageSync('nextLesson_list', '')
        //                                                         wx.setStorageSync('nextCurriculum_extra', '')
        //                                                         return
        //                                                     }
        //                                                     let result = util.parseLesson(res.data.Courses)
        //                                                     let table = result[0]
        //                                                     let table_extra = result[1]
        //                                                     let lesson_list = util.getLessonList(res.data.Courses)
        //                                                     wx.setStorageSync('nextCurriculum', table)
        //                                                     wx.setStorageSync('nextLesson_list', lesson_list)
        //                                                     wx.setStorageSync('nextCurriculum_extra', table_extra)
        //                                                     that.onShow()
        //                                                     wx.showToast({
        //                                                         title: '当前学期加载成功\n预览学期加载成功',
        //                                                         icon: 'none'
        //                                                     })
        //                                                 } else {
        //                                                     util.showError(res, '获取下学期课表')
        //                                                 }
        //                                             } else {
        //                                                 wx.showToast({
        //                                                     title: '网络错误' + res.statusCode,
        //                                                     icon: 'none'
        //                                                 })
        //                                             }
        //                                         })
        //                                     }
        //                                 } else {
        //                                     wx.setStorageSync('nextSchoolTermInfo', '')
        //                                     wx.setStorageSync('nextCurriculum', '')
        //                                     wx.setStorageSync('nextLesson_list', '')
        //                                     wx.setStorageSync('nextCurriculum_extra', '')
        //                                     that.onShow()
        //                                     util.showError(res)
        //                                 }
        //                             } else {
        //                                 wx.setStorageSync('nextSchoolTermInfo', '')
        //                                 wx.setStorageSync('nextCurriculum', '')
        //                                 wx.setStorageSync('nextLesson_list', '')
        //                                 wx.setStorageSync('nextCurriculum_extra', '')
        //                                 that.onShow()
        //                                 wx.showToast({
        //                                     title: '网络错误' + res.statusCode,
        //                                     icon: 'none'
        //                                 })
        //                             }
        //                         })
        //                     } else {
        //                         util.showError(res, '获取当前学期课表')
        //                     }
        //                 } else {
        //                     wx.showToast({
        //                         title: '网络错误' + res.statusCode,
        //                         icon: 'none'
        //                     })
        //                 }
        //             })
        //         } else {
        //             util.showError(res, '获取当前学校学期信息')
        //         }
        //     } else {
        //         wx.showToast({
        //             title: '网络错误' + res.statusCode,
        //             icon: 'none'
        //         })
        //     }
        // })
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
        CurrTable = curriculum_tool.filterCourses(CurrTable)
        curriculum_tool.selectColor(CurrTable, SelfSchedule)
        let table = curriculum_tool.createTable(SelfSchedule, CurrTable)    // 自定义课程优先级高
        curriculum_tool.adaptPriority(table, Priority)
        table = curriculum_tool.UIProcess(table)
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
