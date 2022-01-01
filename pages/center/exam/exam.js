const api = require('../../../utils/api')
const util = require('../../../utils/util')
Page({

    data: {
        exam_list: [],
        exam_list_over: [],
        curr_date: util.getDate(),
        curr_time: util.getTime(),
    },

    onShow: function() {
        // 从本地缓存中获取数据
        let exams = wx.getStorageSync('exam_schedule')
        this.setData({
            exam_list: exams.exam_list,
            exam_list_over: exams.exam_list_over,
        })
        
        if (exams == '') {
            wx.showToast({
              title: '没有记录可以尝试下拉刷新',
              icon: 'none'
            })
        }
        
    },

    updateData: function() {
        let stu_id = wx.getStorageSync('stu_id')
        let uid = wx.getStorageSync('uid')
        let uid_pwd = wx.getStorageSync('uid_pwd')
        if (stu_id == '' || uid == '' || uid_pwd == '') {
            wx.showToast({
              title: '请先绑定学号，统一身份认证账号及密码',
              icon: 'none'
            })
            return
        }
        let that = this
        api.getExamSchedule(stu_id, uid, uid_pwd).then(res => {
            if (res.statusCode == 200) {
                if (res.data.Statue == 1) {
                    console.log(res)
                    let exam_list = []
                    let exam_list_over = []
                    res.data.Exams.forEach(element => {

                        // 计算相距天数
                        let curr_date = this.data.curr_date.year + '-' + this.data.curr_date.month + '-' + this.data.curr_date.day
                        let distance = util.daysDistance(curr_date, element.ExamDate)
                        element.distance = distance
                        let exam_date = util.parseDate(element.ExamDate)
                        let exam_time = util.parseTime(element.StartTime)
                        let over = util.compareDate(this.data.curr_date, exam_date) > 0 ||(util.compareDate(this.data.curr_date, exam_date) == 0 && util.compareTime(this.data.curr_time, exam_time) > 0)
                        if (!over) exam_list.push(element)
                        else exam_list_over.push(element)
                    });
                    that.setData({
                        exam_list: exam_list,
                        exam_list_over: exam_list_over.reverse()
                    })
                    // 本地缓存
                    let exam_schedule = {
                        exam_list: exam_list, 
                        exam_list_over: exam_list_over
                    }
                    wx.setStorageSync('exam_schedule', exam_schedule)
                } else {
                    wx.showToast({
                      title: '查询错误',
                      icon: 'error'
                    })
                }
            } else {
                wx.showToast({
                  title: '网络错误',
                  icon: 'error'
                })
            }
        })
    },

    onPullDownRefresh: function() {
        wx.showLoading()
        this.updateData()
        wx.stopPullDownRefresh()
        wx.hideLoading()
        
    }
})