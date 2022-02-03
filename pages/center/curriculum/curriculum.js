const api = require('../../../utils/api')
const util = require('../../../utils/util')
const {parseLesson} = require("../../../utils/util");

Page({
    data: {
        curr_year: -1,
        year: -1,
        month: -1,  // 月份
        curr_month: -1,
        week_list: null,    // 顶部
        table: null,    // 主体课表
        week: -1,   // 第几周
        curr_week: -1,
        today: -1,   // 今天周几
        showMode: 0, // 显示模式，0为每周，1为整个学期
        detailState: false,
        currDetailLesson: null,
        currSchoolTermInfo: null,
        selectTermState: false,
        term_list: [],
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

    getDetailLessonInfo(e) {
        let item = e.currentTarget.dataset.item
        item.InstructorName = item.InstructorName.replace('-[主讲];', ' ')
        this.setData({
            detailState: true,
            currDetailLesson: item
        })
    },
    hideModal() {
        this.setData({
            detailState: false,
            selectTermState: false,
        })
    },
    UIprocess(data, lesson_list) {
        let color_list = getApp().globalData.color_list
        for (const key in data) {
            let week = data[key]
            for (let i = 0; i < 7; i++) {
                for (let j = 0; j < week[i].length; j++) {
                    if (week[i][j]) {
                        let k = j
                        for (; k < week[i].length; k++) {
                            if (!week[i][k] || week[i][j].ClassNbr !== week[i][k].ClassNbr) break
                        }
                        week[i].splice(j+1, k-j-1)
                        week[i][j]['UILength'] = k-j
                        week[i][j]['color'] = color_list[lesson_list.indexOf(week[i][j].CourseCode)]
                    }
                }
            }
        }
        return data
    },

    // 计算当前是第几周
    getCurrWeek() {
        let StartDate = this.data.currSchoolTermInfo.StartDate
        let _curr_date = util.getDate()
        let CurrDate = `${_curr_date.year}-${_curr_date.month}-${_curr_date.day}`
        let distance = util.daysDistance2(StartDate, CurrDate)
        if (distance>0 ) return parseInt(distance/7+1)
        else return parseInt(distance/7)
    },

    onShow: function() {
        let that = this
        this.setData({
            currSchoolTermInfo: wx.getStorageSync('schoolTermInfo'),
            curr_year: new Date().getFullYear(),
            year: new Date().getFullYear(),
            month: new Date().getMonth(),
            curr_month: new Date().getMonth(),
            today: new Date().getDay(),
            term_list: [wx.getStorageSync('schoolTermInfo'), wx.getStorageSync('nextSchoolTermInfo')],
        })
        this.setData({
            week_list: that.getCurrWeekList(),
            table: that.UIprocess(wx.getStorageSync('curriculum'), wx.getStorageSync('lesson_list')),
            week: that.getCurrWeek(),
            curr_week: that.getCurrWeek(),
        })
    },

    next_week() {
        let that = this
        let date = new Date(this.data.year, this.data.month, this.data.week_list[that.data.today][1])
        this.setData({
            week: that.data.week+1,
            week_list: that.getNeighborDayList(date, 1),
        })
    },

    pre_week() {
        let that = this
        let date = new Date(this.data.year, this.data.month, this.data.week_list[that.data.today][1])
        this.setData({
            week: that.data.week-1,
            week_list: that.getNeighborDayList(date, -1),
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
        let that = this
        this.setData({
            currSchoolTermInfo : item,
        })
        this.setData({
            year: that.data.curr_year,
            month: that.data.curr_month,
            curr_week: that.getCurrWeek(),
            week_list: that.getCurrWeekList(),
            week: that.getCurrWeek(),
        })
        if (item.Term === wx.getStorageSync('nextSchoolTermInfo').Term) {
            that.setData({
                table: that.UIprocess(wx.getStorageSync('nextCurriculum'), wx.getStorageSync('nextLesson_list')),
            })
        } else if (item.Term === wx.getStorageSync('schoolTermInfo').Term) {
            that.setData({
                table: that.UIprocess(wx.getStorageSync('curriculum'), wx.getStorageSync('lesson_list')),
            })
        }
    },
    updateData: function() {
        let that = this
        let stu_id = wx.getStorageSync('stu_id')
        let uid = wx.getStorageSync('uid')
        let uid_pwd = wx.getStorageSync('uid_pwd')
        if (stu_id === '' || uid === '' || uid_pwd === '') {
            wx.showToast({
                title: '请绑定学号，统一身份账号及密码',
                icon: 'none'
            })
            return
        }
        // 获取当前学期课表
        wx.showLoading()
        api.getCurriculum(stu_id, uid, uid_pwd).then(res => {
            if (res.statusCode === 200) {
                wx.hideLoading()
                if (res.data.Statue === 1) {
                    let table = util.parseLesson(res.data.Courses)
                    let lesson_list = util.getLessonList(res.data.Courses)
                    wx.setStorageSync('curriculum', table)
                    wx.setStorageSync('lesson_list', lesson_list)
                    that.onShow()
                } else {
                    util.showError(res)
                }
            } else {
                wx.hideLoading()
                wx.showToast({
                    title: '网络错误',
                    icon: 'none'
                })
            }
        })
        // 获取当前学期学校信息
        wx.showLoading()
        api.getSchoolTermInfo(uid, uid_pwd).then(res => {
            wx.hideLoading()
            if (res.statusCode === 200) {
                if (res.data.Statue === 1) {
                    let schoolTermInfo = {
                        EndDate: res.data.EndDate,
                        StartDate: res.data.StartDate,
                        Term: res.data.Term
                    }
                    wx.setStorageSync('schoolTermInfo', schoolTermInfo)
                } else {
                    util.showError(res)
                }
            } else {
                wx.showToast({
                    title: '网络错误',
                    icon: 'none'
                })
            }
        })
        // 获取下学期课表
        api.getNextCurriculum(stu_id, uid, uid_pwd).then(res => {
            if (res.statusCode === 200) {
                wx.hideLoading()
                if (res.data.Statue === 1) {
                    let table = util.parseLesson(res.data.Courses)
                    let lesson_list = util.getLessonList(res.data.Courses)
                    wx.setStorageSync('nextCurriculum', table)
                    wx.setStorageSync('nextLesson_list', lesson_list)
                } else {
                    util.showError(res)
                }
            } else {
                wx.hideLoading()
                wx.showToast({
                    title: '网络错误',
                    icon: 'none'
                })
            }
        })
        // 获取下学期学校信息
        wx.showLoading()
        api.getSchoolNextTermInfo(uid, uid_pwd).then(res => {
            wx.hideLoading()
            if (res.statusCode === 200) {
                if (res.data.Statue === 1) {
                    let schoolTermInfo = {
                        EndDate: res.data.EndDate,
                        StartDate: res.data.StartDate,
                        Term: res.data.Term
                    }
                    wx.setStorageSync('nextSchoolTermInfo', schoolTermInfo)
                } else {
                    util.showError(res)
                }
            } else {
                wx.showToast({
                    title: '网络错误',
                    icon: 'none'
                })
            }
        })
        that.onShow()
    },
})