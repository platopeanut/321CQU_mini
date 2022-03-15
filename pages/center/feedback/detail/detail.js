const api = require('../../../../utils/api')


Page({

    data: {
        feedback_data: '',
        isAgree : false,
        FBid: '',
        comment_list: [],
        InputBottom: 0,
        comment: '',
        anonymous: getApp().globalData.anonymous
    },

    InputFocus(e) {
        this.setData({
            InputBottom: e.detail.height
        })
    },
    InputValue(e) {
        this.setData({
            comment: e.detail.value
        })
    },
    InputBlur(e) {
        this.setData({
            InputBottom: 0
        })
    },

    send_comment: function() {
        if (this.data.comment === '') {
            wx.showToast({
              title: '消息不能为空',
              icon: 'error'
            })
            return
        }
        let Sid = wx.getStorageSync('StuInfo')['stu_id']
        if (Sid === '' || Sid === undefined) {
            wx.showToast({
              title: '请绑定学号',
              icon: 'error'
            })
        }
        let that = this
        wx.showLoading()
        api.send_feedback_comment(Sid, this.data.comment, this.data.FBid).then(res => {
            if (res.statusCode === 200 && res.data.Statue === 1) {
                wx.hideLoading()
                // wx.showToast({
                //   title: '发送成功',
                //   icon: 'none',
                //   duration: 1000,
                // })
                that.setData({
                    comment: '',
                })
                that.update()
            } else {
                wx.hideLoading()
                wx.showToast({
                  title: '发送失败',
                  icon: 'error'
                })
            }
        })
    },

    onShow: function (options) {
        let that = this
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.on('acceptDataFromOpenerPage', function(data) {
            that.setData({
                feedback_data: data.data,
                FBid: data.data.FBid
            })
            // 获取评论
            that.update()
            // 浏览次数加一
            // let curr = data.data[0].view
            // curr ++
            // comment_db.doc(data.data[0]._id).update({
            //     data: {
            //         // 表示指示数据库将字段自增 10
            //         view: curr
            //     }
            // })
        })
    },
    update: function() {
        let that = this
        wx.showLoading()
        api.get_feedback_comment(this.data.FBid).then(res => {
            console.log(res)
            if (res.statusCode === 200 && res.data.Statue === 1) {
                let data = res.data.FeedbackList.reverse()
                for (let i = 0; i < data.length; i++) {
                    if (!data[i].UserImg) {
                        data[i].UserImg = this.data.anonymous
                    }                    
                }
                that.setData({
                    comment_list: data
                })
            } else {
                wx.showToast({
                    title: '网络错误',
                    icon: 'none'
                })
            }
            wx.hideLoading()
        })
    },
    // addAgree() {
    //     let curr = this.data.feedback_data[0].agree
    //     curr ++
    //     comment_db.doc(this.data.feedback_data[0]._id).update({
    //         data: {
    //             // 表示指示数据库将字段自增 10
    //             agree: curr
    //         }
    //     })
    //     this.setData({
    //         isAgree: true
    //     })
    //     wx.showToast({
    //       title: '点赞成功',
    //       icon: 'success'
    //     })
    // },
    onPullDownRefresh: function() {
        this.update()
        wx.stopPullDownRefresh()
    }
})