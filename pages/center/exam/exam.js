const exam_api = require('./exam_api')
const util = require('../../../utils/util')
Page({

    data: {
        has_exam: true,
        exam_list: [],
        exam_list_over: [],
        curr_date: util.getDate(),
        curr_time: util.getTime(),
    },

    onShow: function() {
        // 从本地缓存中获取数据
        let that = this
        let exams = wx.getStorageSync('ExamSchedule')
        if (exams === '' || exams.length === 0) {
            that.setData({
                has_exam: false
            })
            wx.showToast({
              title: '没有记录可以尝试下拉刷新',
              icon: 'none'
            })
            return
        }
        this.parseData(exams)
    },

    updateData: function() {
        let StuInfo = wx.getStorageSync('StuInfo')
        let stu_id = StuInfo['stu_id']
        let uid = StuInfo['uid']
        let uid_pwd = StuInfo['uid_pwd']
        if (!(stu_id && uid && uid_pwd)) {
            wx.showToast({
              title: '请完善统一身份信息',
              icon: 'none'
            })
            return
        }
        let that = this
        exam_api.getExamSchedule(stu_id, uid, uid_pwd).then(res => {
            if (res.Exams.length === 0) {
                wx.showToast({
                    title: '暂无考试安排',
                    icon: 'none',
                })
                that.setData({
                    has_exam: false,
                    exam_list: [],
                    exam_list_over: [],
                })
            } else {
                wx.showToast({
                    title: '更新成功',
                    icon: 'none'
                })
            }
            that.parseData(res.Exams)
            wx.setStorageSync('ExamSchedule', res.Exams)
        })
    },

    parseData: function (data) {
        let exam_list = []
        let exam_list_over = []
        data.forEach(element => {
            // 计算相距天数
            let curr_date = this.data.curr_date.year + '-' + this.data.curr_date.month + '-' + this.data.curr_date.day
            element.distance = util.daysDistance(curr_date, element.ExamDate)
            let exam_date = util.parseDate(element.ExamDate)
            let exam_time = util.parseTime(element.StartTime)
            let over = util.compareDate(this.data.curr_date, exam_date) > 0 ||(util.compareDate(this.data.curr_date, exam_date) === 0 && util.compareTime(this.data.curr_time, exam_time) > 0)
            if (!over) exam_list.push(element)
            else exam_list_over.push(element)
        });
        this.setData({
            exam_list: exam_list,
            exam_list_over: exam_list_over.reverse()
        })
    },

    onPullDownRefresh: function() {
        wx.stopPullDownRefresh()
        this.updateData()
    }
})