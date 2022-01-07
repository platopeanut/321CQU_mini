const api = require('../../../utils/api')
const util = require('../../../utils/util')

Page({
    data: {
        uid: wx.getStorageSync('uid'),
        uid_pwd: wx.getStorageSync('uid_pwd'),
        stu_id: wx.getStorageSync('stu_id'),
        grade_list: [],
        term_list: [],
        curr_term: '',
        point_info: [],
        avg_point: 0,
        modalState: false,
        score_analysis_record: wx.getStorageSync('score_analysis_record') != ''
    },
    selectTerm: function(res) {
        this.setData({
            curr_term: res.target.dataset.id
        })
    },
    updateData: function() {
        let that = this
        this.setData({
            uid: wx.getStorageSync('uid'),
            uid_pwd: wx.getStorageSync('uid_pwd'),
            stu_id: wx.getStorageSync('stu_id'),
        })
        if (this.data.stu_id === '' || this.data.uid === '' || this.data.uid_pwd === '') {
            wx.showToast({
              title: '请先绑定学号，统一身份认证账号及密码',
              icon: 'none'
            })
            return
        }
        wx.showLoading()
        wx.login({
            success: function(res) {
                api.getGrade(that.data.stu_id, that.data.uid, that.data.uid_pwd, res.code).then(res => {
                    if (res.statusCode === 200) {
                        if (res.data.Statue == 1) {
                            console.log(res.data)
                            let grade_list = res.data.ScoreLog
                            let term_list = Object.keys(res.data.ScoreLog)
                            for (const term_name of term_list) {
                                for (let i = 0; i < grade_list[term_name].length; i++) {
                                    grade_list[term_name][i]['point'] = util.score2point(grade_list[term_name][i]['EffectiveScoreShow'])
                                }
                            }
                            that.setData({
                                grade_list: grade_list,
                                term_list: term_list
                            })
                            let curr_term = that.data.term_list[0]
                            that.setData({
                                curr_term: curr_term
                            })
                            // 本地缓存
                            let grade_info = {
                                grade_list: that.data.grade_list,
                                term_list: that.data.term_list,
                                curr_term: that.data.curr_term
                            }
                            wx.setStorageSync('grade_info', grade_info)
                        } else {
                            wx.showToast({
                              title: '信息错误',
                              icon: 'error',
                            })
                        }
                    } else {
                        wx.showToast({
                          title: '网络错误',
                          icon: 'error'
                        })
                    }
                    wx.hideLoading()
                })
            },
            fail: function() {
                wx.showToast({
                  title: '登陆失败',
                  icon: 'error'
                })
                wx.hideLoading()
            }
        })
    },
    onShow: function () {
        let grade_info = wx.getStorageSync('grade_info')
        this.setData({
            grade_list: grade_info.grade_list,
            term_list: grade_info.term_list,
            curr_term: grade_info.curr_term
        })  
        if (grade_info === '') {
            wx.showToast({
            title: '没有记录可以尝试下拉刷新',
            icon: 'none'
            })
        }
    },
    onPullDownRefresh: function() {
        this.updateData()
        wx.stopPullDownRefresh()
    },
    score_analysis: function () {
        this.setData({
            modalState: true
        })
        if (!this.data.score_analysis_record) {
            wx.showToast({
                title: '统计采用四分制，统计过程过滤了四六级考试和重修科目',
                icon: 'none',
                duration: 2000
            })
            wx.setStorageSync('score_analysis_record', true)
            this.setData({
                score_analysis_record: true
            })
        }
        let grade_list = this.data.grade_list
        let term_list = this.data.term_list
        let point_list = []
        let credit_list = []
        console.log(grade_list)
        console.log(term_list)
        for (let i = 0; i < term_list.length; i++) {
            let term = term_list[i]
            let point = 0
            let credit = 0
            for (let j = 0; j < grade_list[term].length; j++) {
                let item = grade_list[term][j]
                // 过滤项
                if (item.CourseName === '大学英语(国家四级)' || item.CourseName === '大学英语(国家六级)') continue
                if (item.StudyNature !== '初修') continue
                credit += parseFloat(item.CourseCredit)
                point += parseFloat(item.CourseCredit) * util.score2point(item.EffectiveScoreShow)
            }
            point /= credit
            point = point.toFixed(4)
            point_list.push(point)
            credit_list.push(credit)
        }
        console.log(point_list)
        console.log(credit_list)
        let avg_point = 0
        let credit_sum = 0
        for (let i = 0; i < point_list.length; i++) {
            avg_point += point_list[i] * credit_list[i]
            credit_sum += credit_list[i]
        }
        avg_point /= credit_sum
        avg_point = avg_point.toFixed(4)
        console.log(avg_point)
        let point_info = []
        for (let i = 0; i < point_list.length; i++) {
            point_info.push({
                point: point_list[i],
                credit: credit_list[i],
                term: term_list[i]
            })
        }
        this.setData({
            point_info: point_info,
            avg_point: avg_point
        })
    },

    hideModal: function () {
        this.setData({
            modalState: false
        })
    }
})