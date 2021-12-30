const api = require('../../../utils/api')

Page({
    data: {
        uid: wx.getStorageSync('uid'),
        uid_pwd: wx.getStorageSync('uid_pwd'),
        stu_id: wx.getStorageSync('stu_id'),
        grade_list: [],
        term_list: [],
        curr_term: '',
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
        if (this.data.stu_id == '' || this.data.uid == '' || this.data.uid_pwd == '') {
            wx.showToast({
              title: '请先绑定学号，统一身份认证账号及密码',
              icon: 'none'
            })
            return
        }
        wx.showLoading()
        api.getGrade(this.data.stu_id, this.data.uid, this.data.uid_pwd).then(res => {
            if (res.statusCode == 200) {
                if (res.data.Statue == 1) {
                    that.setData({
                        grade_list: res.data.ScoreLog,
                        term_list: Object.keys(res.data.ScoreLog),
                    })
                    let curr_term = this.data.term_list[0]
                    this.setData({
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
    onShow: function () {
        let grade_info = wx.getStorageSync('grade_info')
        this.setData({
            grade_list: grade_info.grade_list,
            term_list: grade_info.term_list,
            curr_term: grade_info.curr_term
        })  
        if (grade_info == '') {
            wx.showToast({
            title: '没有记录可以尝试下拉刷新',
            icon: 'none'
            })
        }
    },
    onPullDownRefresh: function() {
        this.updateData()
    }

})