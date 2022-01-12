const api = require('../../../utils/api')
const util = require('../../../utils/util')
const {parseLesson} = require("../../../utils/util");

Page({
    data: {
        month: -1,  // 月份
        week_list: null,    // 顶部
        table: null,    // 主体课表
        week_start: wx.getStorageSync('curriculum_week_start'),
        week_end: wx.getStorageSync('curriculum_week_end'),
        week: 1,   // 第几周
        today: 3,   // 今天周几
        showMode: 0, // 显示模式，0为每周，1为整个学期
        startYear: 2022,    // 开始学年
        termIndex: '一',    // 第几学期
        scrollHeight: 0,
    },
    getDayList() {
        return [13,14,15,16,17,18,19]
    },

    UIprocess(data) {
        for (const key in data) {
            let week = data[key]
            for (let i = 0; i < 7; i++) {
                for (let j = 0; j < week[i].length; j++) {
                    if (week[i][j]) {
                        let k = j
                        for (; k < week[i].length; k++) {
                            if (!week[i][k] || week[i][j].CourseName !== week[i][k].CourseName) break
                        }
                        week[i].splice(j+1, k-j-1)
                        week[i][j]['UILength'] = k-j
                    }
                }
            }
        }
        return data
    },

    onShow: function() {
        let that = this
        let week_list = [['周一'],['周二'],['周三'],['周四'],['周五'],['周六'],['周日']]
        let day_list = this.getDayList()
        for (let i = 0; i < week_list.length; i++) {
            week_list[i].push(day_list[i])
        }
        this.setData({
            month: 12,
            week_list: week_list,
            table: that.UIprocess(wx.getStorageSync('curriculum'))
        })
        console.log(this.data.table)
    },

    next_week() {
        this.setData({
            week: this.data.week+1
        })
    },

    pre_week() {
        this.setData({
            week: this.data.week-1
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
        wx.showLoading()
        api.getCurriculum(stu_id, uid, uid_pwd).then(res => {
            if (res.statusCode === 200) {
                wx.hideLoading()
                if (res.data.Statue === 1) {
                    let table = parseLesson(res.data.Courses)
                    let week_start = 0
                    let week_end = 0
                    week_start = week_end = Object.keys(table)[0]
                    for (const key of Object.keys(table)) {
                        let curr = parseInt(key)
                        if (curr > week_end) week_end = curr
                        if (curr < week_start) week_start = curr
                    }
                    wx.setStorageSync('curriculum', table)
                    wx.setStorageSync('curriculum_week_start', week_start)
                    wx.setStorageSync('curriculum_week_end', week_end)
                    that.setData({
                        table: that.UIprocess(table),
                        week_start: week_start,
                        week_end: week_end
                    })
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
    },
})