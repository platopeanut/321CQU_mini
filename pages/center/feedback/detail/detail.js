const feedback_api = require('../feedback_api')


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
    InputBlur() {
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
        feedback_api.sendFeedbackComment(Sid, this.data.comment, this.data.FBid).then(() => {
            that.setData({
                comment: '',
            })
            that.update()
        })
    },

    onShow: function () {
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
        feedback_api.getFeedbackComment(this.data.FBid).then(res => {
            let data = res.FeedbackList.reverse()
            for (let i = 0; i < data.length; i++) {
                if (!data[i].UserImg) {
                    data[i].UserImg = this.data.anonymous
                }
            }
            that.setData({
                comment_list: data
            })
        })
    },
    onPullDownRefresh: function() {
        this.update()
        wx.stopPullDownRefresh()
    }
})